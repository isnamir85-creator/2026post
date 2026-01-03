
import React, { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_KEY = 'df20b76721ea47b36bdfff1cbb937145';

interface PathPoint {
  latlng: any;
  name: string;
}

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [pathCoords, setPathCoords] = useState<PathPoint[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const polylineRef = useRef<any>(null);

  const routePoints = [
    { name: "169", addr: "광주 광산구 월계로 169" },
    { name: "173", addr: "광주 광산구 월계로 173" },
    { name: "175", addr: "광주 광산구 월계로 175" },
    { name: "183", addr: "광주 광산구 월계로 183" },
  ];

  const tutorialMessages = [
    "반가워요! 집배원님만의 완벽한 배달 루트를 설계해볼까요? 🏍️",
    "'경로 수정' 버튼을 누르면 모든 지점을 자유롭게 옮길 수 있어요!",
    "마커의 이름을 클릭하면 지번을 바꿀 수 있고, 'X'로 삭제도 가능해요.",
    "인도를 따라 구불구불하게 마커를 배치하면 더 정확한 경로가 완성됩니다!",
    "자, 이제 시작해볼까요? 마을을 멋지게 건설해보세요! 🏠✨"
  ];

  useEffect(() => {
    // 최초 실행 시 튜토리얼 표시 여부 확인 (예: localStorage 사용 가능)
    const hasSeenTutorial = localStorage.getItem('seen_map_tutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(35.2140, 126.8360),
          level: 3,
        };
        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
        setMap(kakaoMap);

        const geocoder = new window.kakao.maps.services.Geocoder();
        const initialCoords: PathPoint[] = [];

        let processedCount = 0;
        routePoints.forEach((point, index) => {
          geocoder.addressSearch(point.addr, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              initialCoords[index] = {
                latlng: new window.kakao.maps.LatLng(result[0].y, result[0].x),
                name: point.name
              };
            }
            
            processedCount++;
            if (processedCount === routePoints.length) {
              const filtered = initialCoords.filter(c => c);
              setPathCoords(filtered);
              setLoading(false);
              renderPath(kakaoMap, filtered, false);
            }
          });
        });
      });
    };

    return () => {
      const script = document.querySelector(`script[src*="${KAKAO_KEY}"]`);
      if (script) document.head.removeChild(script);
    };
  }, []);

  const clearMap = () => {
    markers.forEach(m => m.setMap(null));
    overlays.forEach(o => o.setMap(null));
    if (polylineRef.current) polylineRef.current.setMap(null);
    setMarkers([]);
    setOverlays([]);
  };

  const deletePoint = (index: number) => {
    const nextPath = pathCoords.filter((_, i) => i !== index);
    setPathCoords(nextPath);
    renderPath(map, nextPath, isEditing);
  };

  const renamePoint = (index: number) => {
    const newName = window.prompt("지점 이름을 수정하세요:", pathCoords[index].name);
    if (newName !== null && newName.trim() !== "") {
      const nextPath = [...pathCoords];
      nextPath[index].name = newName;
      setPathCoords(nextPath);
      renderPath(map, nextPath, isEditing);
    }
  };

  const renderPath = (mapObj: any, points: PathPoint[], editingMode: boolean) => {
    clearMap();
    if (!mapObj || points.length === 0) return;

    const linePath = points.map(p => p.latlng);
    const newMarkers: any[] = [];
    const newOverlays: any[] = [];

    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 6,
      strokeColor: '#ef4444',
      strokeOpacity: 0.8,
      strokeStyle: 'dashed'
    });
    polyline.setMap(mapObj);
    polylineRef.current = polyline;

    points.forEach((p, i) => {
      if (editingMode) {
        const marker = new window.kakao.maps.Marker({
          position: p.latlng,
          draggable: true,
          image: new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            new window.kakao.maps.Size(32, 44)
          )
        });

        window.kakao.maps.event.addListener(marker, 'dragend', () => {
          const newPos = marker.getPosition();
          setPathCoords(prev => {
            const next = [...prev];
            next[i] = { ...next[i], latlng: newPos };
            polyline.setPath(next.map(cp => cp.latlng));
            return next;
          });
        });

        marker.setMap(mapObj);
        newMarkers.push(marker);

        // 편집 전용 라벨 (이름 클릭 수정 + 삭제 버튼)
        const content = document.createElement('div');
        content.className = "flex flex-col items-center -translate-y-14 group cursor-default";
        content.innerHTML = `
          <div class="flex items-center gap-1.5 animate-in slide-in-from-top-2">
            <div id="rename-${i}" class="bg-blue-500 text-white text-[11px] font-black px-3 py-1 rounded-full border-2 border-white shadow-xl hover:bg-blue-600 transition-colors">
              ${p.name}
            </div>
            <div id="delete-${i}" class="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg cursor-pointer hover:bg-red-700 active:scale-90 transition-all">
              ✕
            </div>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          position: p.latlng,
          content: content,
          yAnchor: 1
        });
        overlay.setMap(mapObj);
        newOverlays.push(overlay);

        // 이벤트 바인딩
        setTimeout(() => {
          document.getElementById(`rename-${i}`)?.addEventListener('click', () => renamePoint(i));
          document.getElementById(`delete-${i}`)?.addEventListener('click', () => deletePoint(i));
        }, 0);

      } else {
        const content = `
          <div class="bg-white/95 px-3 py-1.5 rounded-2xl border-[3px] border-red-600 shadow-2xl transform -translate-y-2 flex items-center gap-2">
            <span class="text-[13px] font-black text-red-600">${p.name}</span>
            <div class="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          </div>
        `;
        const overlay = new window.kakao.maps.CustomOverlay({
          position: p.latlng,
          content: content,
          yAnchor: 1
        });
        overlay.setMap(mapObj);
        newOverlays.push(overlay);
      }
    });

    setMarkers(newMarkers);
    setOverlays(newOverlays);
    
    if (!editingMode && points.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      linePath.forEach(p => bounds.extend(p));
      mapObj.setBounds(bounds, 100);
    }
  };

  const toggleEdit = () => {
    const nextMode = !isEditing;
    setIsEditing(nextMode);
    renderPath(map, pathCoords, nextMode);
  };

  const handleAddPoint = () => {
    if (!map) return;
    const name = window.prompt("추가할 지점의 이름을 입력하세요:", (pathCoords.length + 1).toString());
    if (name !== null && name.trim() !== "") {
      const center = map.getCenter();
      const newPoint = { latlng: center, name: name };
      const nextPath = [...pathCoords, newPoint];
      setPathCoords(nextPath);
      renderPath(map, nextPath, isEditing);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('seen_map_tutorial', 'true');
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        path[stroke-dasharray] {
          stroke-dasharray: 12, 12;
          animation: dash-move 15s linear infinite;
          stroke-linecap: round;
        }
        @keyframes dash-move {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .simpsons-bubble {
          position: relative;
          background: #fff;
          border: 4px solid #000;
          border-radius: 20px;
          padding: 20px;
        }
        .simpsons-bubble:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 0;
          border: 20px solid transparent;
          border-top-color: #000;
          border-bottom: 0;
          border-left: 0;
          margin-left: -10px;
          margin-bottom: -20px;
        }
      `}} />

      {loading && (
        <div className="absolute inset-0 z-[60] bg-[#fdfaf7] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-yellow-400 rounded-full animate-spin"></div>
          <p className="font-ghibli text-xl text-stone-600">지도 데이터를 불러오는 중...</p>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full"></div>

      {/* 상단 툴바 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        <button 
          onClick={toggleEdit}
          className={`px-6 py-3.5 rounded-3xl shadow-2xl flex items-center gap-2.5 transition-all active:scale-95 border-b-[6px] ${isEditing ? 'bg-yellow-400 text-black border-yellow-600 font-black' : 'bg-white text-stone-700 border-stone-200 font-bold'}`}
        >
          {isEditing ? (
            <>
              <span className="text-xl">✅</span>
              <span className="text-sm">편집 완료</span>
            </>
          ) : (
            <>
              <span className="text-xl">🛠️</span>
              <span className="text-sm">순로 수정</span>
            </>
          )}
        </button>

        <button 
          onClick={handleAddPoint}
          className="px-6 py-3.5 bg-white text-stone-700 rounded-3xl shadow-2xl flex items-center gap-2.5 transition-all active:scale-95 border-b-[6px] border-stone-200 font-bold"
        >
          <span className="text-xl">➕</span>
          <span className="text-sm">주소 추가</span>
        </button>
      </div>

      {/* 우측 하단 컨트롤 */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-3">
        <button 
          onClick={() => setShowTutorial(true)}
          className="w-12 h-12 bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center border-b-4 border-yellow-600 active:scale-90"
          title="도움말"
        >
          <span className="text-2xl font-black">?</span>
        </button>
        <button 
          onClick={() => {
            if (navigator.geolocation && map) {
              navigator.geolocation.getCurrentPosition((pos) => {
                map.panTo(new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
              });
            }
          }}
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border-b-4 border-stone-100 active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
        </button>
      </div>

      {/* 게임 스타일 튜토리얼 모달 */}
      {showTutorial && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* 심슨 스타일 캐릭터 또는 아이콘 (이미지 대신 이모지로 대체) */}
            <div className="text-[120px] mb-[-40px] z-10 animate-bounce select-none">
              👷‍♂️
            </div>
            
            <div className="simpsons-bubble w-full shadow-[0_20px_0_rgba(0,0,0,0.2)]">
              <div className="text-center space-y-4">
                <div className="bg-yellow-400 inline-block px-4 py-1 rounded-full border-2 border-black font-black text-xs uppercase tracking-widest">
                  Level {tutorialStep + 1}
                </div>
                <p className="font-ghibli text-2xl font-bold leading-tight text-stone-800 break-keep">
                  {tutorialMessages[tutorialStep]}
                </p>
                
                <div className="flex gap-3 pt-4">
                  {tutorialStep > 0 && (
                    <button 
                      onClick={() => setTutorialStep(s => s - 1)}
                      className="flex-1 py-3 bg-stone-100 border-2 border-black rounded-xl font-black active:scale-95 shadow-[0_4px_0_#000]"
                    >
                      이전
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (tutorialStep < tutorialMessages.length - 1) {
                        setTutorialStep(s => s + 1);
                      } else {
                        closeTutorial();
                      }
                    }}
                    className="flex-1 py-3 bg-yellow-400 border-2 border-black rounded-xl font-black active:scale-95 shadow-[0_4px_0_#000]"
                  >
                    {tutorialStep === tutorialMessages.length - 1 ? "마을로 가기!" : "다음"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 편집 모드 오버레이 안내 */}
      {isEditing && !showTutorial && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 w-max pointer-events-none">
          <div className="bg-black/80 text-white px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-yellow-400 flex items-center gap-3 animate-bounce">
            <span className="text-lg">🏗️</span>
            <span className="text-xs font-black tracking-tight">마커를 옮겨서 완벽한 인도를 설계하세요!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
