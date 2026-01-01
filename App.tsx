
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { NC_ORDER, L_DATA } from './data';
import { Resident, WeatherData } from './types';
import PostHeader from './components/PostHeader';
import SearchBar from './components/SearchBar';
import ResidentCard from './components/ResidentCard';
import AddResidentModal from './components/AddResidentModal';
import DatabaseView from './components/DatabaseView';
import WeatherPopup from './components/WeatherPopup';

// 한글 초성 추출 함수
const getChosung = (str: string) => {
  const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  let result = "";
  for(let i=0; i<str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if(code > -1 && code < 11172) result += cho[Math.floor(code/588)];
    else result += str.charAt(i);
  }
  return result;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'database'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<Resident[]>(L_DATA);
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetBuilding, setTargetBuilding] = useState<string | null>(null);
  
  // Weather Popup States
  const [showWeather, setShowWeather] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Fetch Weather using Gemini
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "현재 광주광역시 광산구 월계동의 오늘 날씨 정보를 알려줘. 오전/오후 상태(clear, cloudy, rainy, snowy 중 하나), 온도, 강수확률을 JSON 형식으로 제공해줘.",
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                date: { type: "string" },
                location: { type: "string" },
                am: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    temp: { type: "string" },
                    rainProb: { type: "string" }
                  }
                },
                pm: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    temp: { type: "string" },
                    rainProb: { type: "string" }
                  }
                }
              }
            }
          }
        });

        if (response.text) {
          setWeatherData(JSON.parse(response.text));
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        setWeatherData({
          date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          location: "광산구 월계동",
          am: { status: 'clear', temp: '14°C', rainProb: '0%' },
          pm: { status: 'cloudy', temp: '21°C', rainProb: '20%' }
        });
      }
    };

    fetchWeather();
  }, []);

  const toggleBuilding = (building: string) => {
    setExpandedBuildings((prev) => {
      const next = new Set(prev);
      if (next.has(building)) next.delete(building);
      else next.add(building);
      return next;
    });
  };

  const openAddModal = (e: React.MouseEvent, building: string) => {
    e.stopPropagation();
    setTargetBuilding(building);
    setIsModalOpen(true);
  };

  const handleAddResident = (unit: string, name: string) => {
    if (!targetBuilding) return;
    const newResident: Resident = {
      id: residents.length + 1,
      buildingName: targetBuilding,
      unitNumber: unit,
      tenant: name,
    };
    setResidents(prev => [...prev, newResident]);
    setExpandedBuildings(prev => {
      const next = new Set(prev);
      next.add(targetBuilding);
      return next;
    });
  };

  const filteredResidents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return residents;
    return residents.filter((r) => {
      const name = r.tenant.toLowerCase();
      const bName = r.buildingName.toLowerCase();
      const unit = r.unitNumber.toLowerCase();
      if (name.includes(term) || bName.includes(term) || unit.includes(term)) return true;
      if (getChosung(name).includes(term) || getChosung(bName).includes(term)) return true;
      return false;
    });
  }, [searchTerm, residents]);

  const groupedData = useMemo(() => {
    const groups: { [key: string]: Resident[] } = {};
    NC_ORDER.forEach(name => groups[name] = []);
    filteredResidents.forEach(res => {
      if (groups[res.buildingName]) groups[res.buildingName].push(res);
      else {
        if (!groups['기타']) groups['기타'] = [];
        groups['기타'].push(res);
      }
    });
    return groups;
  }, [filteredResidents]);

  const displayBuildings = useMemo(() => {
    if (searchTerm.trim().length > 0) {
      return NC_ORDER.filter(b => (groupedData[b]?.length || 0) > 0);
    }
    return NC_ORDER;
  }, [groupedData, searchTerm]);

  useMemo(() => {
    if (searchTerm.trim().length > 0) {
      setExpandedBuildings(new Set(displayBuildings));
    }
  }, [displayBuildings, searchTerm]);

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-[#F8FAFC] shadow-2xl overflow-hidden font-['Noto_Sans_KR'] relative border-x border-gray-100">
      {/* Weather Popup - Fixed Overlay */}
      {showWeather && (
        <WeatherPopup 
          weather={weatherData} 
          onConfirm={() => setShowWeather(false)} 
        />
      )}

      {/* App Content Wrapper */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Sticky Header Section */}
        {activeTab === 'list' && (
          <div className="shrink-0 shadow-xl z-50">
            <PostHeader />
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          </div>
        )}

        {/* Scrollable Area - 롤업 문제를 해결하기 위한 구조적 안정화 */}
        <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-44">
          {activeTab === 'list' ? (
            <div className="px-5 py-6 space-y-4">
              {displayBuildings.map((building) => {
                const residentsInBuilding = groupedData[building];
                const isExpanded = expandedBuildings.has(building);
                const hasUnknown = residentsInBuilding.length > 0;
                
                const parts = building.split(' (');
                const namePart = parts[0];
                const addrPart = parts[1] ? parts[1].replace(')', '') : '';

                return (
                  <div key={building} className={`bg-white rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'border-indigo-100 shadow-xl scale-[1.02]' : 'border-transparent shadow-sm hover:border-gray-200'}`}>
                    <div 
                      onClick={() => toggleBuilding(building)}
                      className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors gap-3 overflow-hidden"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`shrink-0 p-2.5 rounded-2xl shadow-lg transition-colors ${hasUnknown ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gray-100 text-gray-400 shadow-none'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                            <h3 className="font-black text-gray-900 text-[16px] tracking-tight leading-tight truncate shrink-0">
                              {namePart}
                            </h3>
                            {addrPart && (
                              <span className="text-[11px] text-gray-400 font-medium truncate shrink">
                                ({addrPart})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 min-w-0">
                            {hasUnknown && (
                              <span className="shrink-0 bg-red-50 text-red-600 text-[9px] px-1.5 py-0.5 rounded-full font-black border border-red-100 uppercase tracking-tighter">
                                수취인불명 {residentsInBuilding.length}
                              </span>
                            )}
                            {!hasUnknown && (
                              <span className="text-[10px] text-gray-300 font-bold px-1 tracking-tight">EMPTY</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                         <button 
                          onClick={(e) => openAddModal(e, building)}
                          className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                           </svg>
                         </button>
                         <svg className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                         </svg>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-5 pb-5 divide-y divide-gray-50 border-t border-gray-50 animate-in fade-in slide-in-from-top-1 duration-300">
                        {hasUnknown ? (
                          residentsInBuilding.map((res) => (
                            <ResidentCard key={res.id} resident={res} />
                          ))
                        ) : (
                          <div className="py-8 text-center bg-gray-50/50 rounded-2xl mt-2">
                            <p className="text-xs text-gray-400 font-medium">등록된 정보가 없습니다.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <DatabaseView residents={residents} />
          )}
        </main>

        {/* Premium Floating Navigation Bar */}
        <div className="absolute bottom-6 left-0 right-0 px-5 pointer-events-none z-[60]">
          <div className="max-w-[320px] mx-auto bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto flex items-center justify-between overflow-hidden relative">
            
            {/* Nav Item: Home */}
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-[2rem] transition-all relative z-10 ${activeTab === 'list' ? 'text-indigo-600 bg-indigo-50/50 shadow-inner' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'list' ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">홈 리스트</span>
            </button>
            
            {/* Nav Item: Weather (Special Button) */}
            <button 
              onClick={() => setShowWeather(true)}
              className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-[2rem] text-gray-400 hover:text-indigo-600 transition-all relative z-10 active:scale-90"
            >
              <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg shadow-indigo-100 mb-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.92h-2V3.5h2V.58zm6.41 2.85l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zM11 22.42h2V19.5h-2v2.92zm-6.06-4.21l-1.41 1.41 1.79 1.79 1.41-1.41-1.79-1.79zm13.13-1.79l1.41 1.41 1.79-1.79-1.41-1.41-1.79 1.79zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                </svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter text-indigo-600">날씨 브리핑</span>
            </button>

            {/* Nav Item: Database */}
            <button 
              onClick={() => setActiveTab('database')}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-[2rem] transition-all relative z-10 ${activeTab === 'database' ? 'text-indigo-600 bg-indigo-50/50 shadow-inner' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'database' ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">데이터베이스</span>
            </button>

          </div>
          {/* James Label fixed at the very bottom center */}
          <div className="mt-2 text-center opacity-40">
            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.4em] mr-1 italic">Post Aid Tool</span>
            <span className="font-signature text-xs text-indigo-900">James</span>
          </div>
        </div>
      </div>

      <AddResidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddResident}
        buildingName={targetBuilding || ''}
      />
    </div>
  );
};

export default App;
