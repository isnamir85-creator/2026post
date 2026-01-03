
import React from 'react';
import { WeatherData } from '../types';

interface WeatherPopupProps {
  weather: WeatherData | null;
  loading?: boolean;
  onConfirm: () => void;
}

const WeatherIcon: React.FC<{ status?: string, className?: string }> = ({ status, className }) => {
  if (status === 'clear') return <span className={`text-5xl ${className}`}>☀️</span>;
  if (status === 'cloudy') return <span className={`text-5xl ${className}`}>☁️</span>;
  if (status === 'rainy') return <span className={`text-5xl ${className}`}>☔</span>;
  if (status === 'snowy') return <span className={`text-5xl ${className}`}>❄️</span>;
  return <span className={`text-5xl ${className}`}>✨</span>;
};

const WeatherPopup: React.FC<WeatherPopupProps> = ({ weather, loading, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-stone-900/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-[3rem] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-t-[12px] border-red-600 animate-in zoom-in-95 duration-500 overflow-hidden relative">
        
        {/* 실시간 KMA 표시 배지 */}
        <div className="absolute top-4 right-6 flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full border border-blue-200">
          <span className={`w-1.5 h-1.5 bg-blue-600 rounded-full ${loading ? 'animate-bounce' : 'animate-pulse'}`}></span>
          <span className="text-[9px] font-black text-blue-700 uppercase tracking-tighter">
            {loading ? 'KMA Connecting...' : 'KMA Official Data'}
          </span>
        </div>

        <div className="p-8 space-y-7">
          <div className="text-center space-y-1">
            <div className="inline-block bg-yellow-400 px-4 py-1 rounded-full mb-2 shadow-sm">
              <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">기상청 단기 예보</span>
            </div>
            <h2 className="text-3xl font-ghibli font-bold text-stone-800 tracking-tight">오늘의 집배 날씨</h2>
            
            {!loading && weather ? (
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-bold text-stone-400">{weather.date} | {weather.location}</p>
                {weather.lastUpdated && (
                  <p className="text-[9px] font-medium text-blue-500 uppercase tracking-tight">
                    발표 시간: {weather.lastUpdated}
                  </p>
                )}
              </div>
            ) : (
              <div className="h-8 flex items-center justify-center gap-2">
                <div className="w-1 h-1 bg-stone-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-stone-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-stone-200 rounded-full animate-bounce"></div>
              </div>
            )}
          </div>

          {loading || !weather ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="text-6xl animate-bounce">🏍️</div>
                <div className="absolute -left-4 top-0 text-2xl opacity-20 animate-pulse">☁️</div>
                <div className="absolute -right-6 bottom-0 text-3xl opacity-30 animate-pulse [animation-delay:0.5s]">☁️</div>
              </div>
              <p className="text-stone-400 font-ghibli text-lg italic animate-pulse">
                기상청 서버에서 예보를 수신 중입니다...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-3xl p-4 border border-stone-100 text-center relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-10 group-hover:scale-110 transition-transform">
                    <WeatherIcon status={weather.am?.status} className="text-2xl" />
                  </div>
                  <p className="text-[9px] font-black text-stone-400 uppercase mb-2">오전 집배</p>
                  <WeatherIcon status={weather.am?.status} className="mb-2 block scale-75" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-stone-800 leading-none">{weather.am?.temp || '?'}</span>
                    <span className="text-[9px] font-black text-blue-500 mt-1">강수 {weather.am?.rainProb || '0%'}</span>
                  </div>
                </div>
                
                <div className="bg-stone-50 rounded-3xl p-4 border border-stone-100 text-center relative overflow-hidden group">
                  <div className="absolute top-2 right-2 opacity-10 group-hover:scale-110 transition-transform">
                    <WeatherIcon status={weather.pm?.status} className="text-2xl" />
                  </div>
                  <p className="text-[9px] font-black text-stone-400 uppercase mb-2">오후 집배</p>
                  <WeatherIcon status={weather.pm?.status} className="mb-2 block scale-75" />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-stone-800 leading-none">{weather.pm?.temp || '?'}</span>
                    <span className="text-[9px] font-black text-blue-500 mt-1">강수 {weather.pm?.rainProb || '0%'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-5 rounded-2xl border-l-4 border-red-500 shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="font-ghibli text-red-800 text-lg leading-tight">
                  {weather.advice || "안전운행 하시고 오늘도 화이팅하세요!"}
                </p>
              </div>
            </>
          )}

          <button 
            onClick={onConfirm} 
            disabled={loading}
            className={`w-full py-5 text-white rounded-[1.5rem] font-ghibli text-2xl shadow-xl transition-all active:scale-95 border-b-4 ${loading ? 'bg-stone-200 border-stone-300 cursor-not-allowed' : 'bg-red-600 shadow-red-200 hover:bg-red-700 border-red-900'}`}
          >
            {loading ? '서버 수신 중...' : '기상 확인 완료'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherPopup;
