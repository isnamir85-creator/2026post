
import React from 'react';
import { WeatherData } from '../types';

interface WeatherPopupProps {
  weather: WeatherData | null;
  onConfirm: () => void;
}

const WeatherIcon: React.FC<{ status: WeatherData['am']['status'], className?: string }> = ({ status, className }) => {
  switch (status) {
    case 'clear':
      return (
        <svg className={`${className} text-amber-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zm-12.37 12.37a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
        </svg>
      );
    case 'cloudy':
      return (
        <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      );
    case 'rainy':
      return (
        <svg className={`${className} text-blue-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM13 13v3a1 1 0 01-2 0v-3a1 1 0 012 0zm-4 0v3a1 1 0 01-2 0v-3a1 1 0 012 0zm8 0v3a1 1 0 01-2 0v-3a1 1 0 012 0z" />
        </svg>
      );
    case 'snowy':
      return (
        <svg className={`${className} text-indigo-200`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 13h-2v-2h2v2zm0 4h-2v-2h2v2zm4-4h-2v-2h2v2zm0 4h-2v-2h2v2zm-8-4H7v-2h2v2zm0 4H7v-2h2v2zm10.35-6.96A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      );
    default:
      return null;
  }
};

const WeatherPopup: React.FC<WeatherPopupProps> = ({ weather, onConfirm }) => {
  if (!weather) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-indigo-950/40 transition-all duration-700">
      <div className="w-full max-w-sm bg-white rounded-[3.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.25)] border border-white animate-in zoom-in-95 fade-in duration-500">
        <div className="text-center space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Morning Briefing</span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">오늘의 배송 날씨</h2>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="text-xs font-bold text-gray-400">{weather.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
              <span className="text-xs font-black text-indigo-600">{weather.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* AM */}
            <div className="bg-white border border-gray-100 p-5 rounded-[2.5rem] shadow-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Morning (오전)</span>
              <div className="flex flex-col items-center gap-2">
                <WeatherIcon status={weather.am.status} className="w-10 h-10" />
                <div className="text-center">
                  <span className="text-xl font-black text-gray-900 block leading-none">{weather.am.temp}</span>
                  <span className="text-[10px] font-bold text-blue-500">강수 {weather.am.rainProb}</span>
                </div>
              </div>
            </div>

            {/* PM */}
            <div className="bg-white border border-gray-100 p-5 rounded-[2.5rem] shadow-sm">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">Afternoon (오후)</span>
              <div className="flex flex-col items-center gap-2">
                <WeatherIcon status={weather.pm.status} className="w-10 h-10" />
                <div className="text-center">
                  <span className="text-xl font-black text-gray-900 block leading-none">{weather.pm.temp}</span>
                  <span className="text-[10px] font-bold text-blue-500">강수 {weather.pm.rainProb}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100/50">
            <p className="text-[11px] text-indigo-700 font-bold leading-relaxed">
              쾌적한 날씨입니다. 안전운행 하시고<br/>오늘도 친절한 배송 부탁드립니다!
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={onConfirm}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all active:scale-95"
            >
              배송 시작하기
            </button>
            
            <div className="pt-2">
              <div className="h-px w-12 bg-gray-200 mx-auto mb-3"></div>
              <p className="text-[10px] font-bold text-gray-400 tracking-tighter">
                이 앱은 <span className="text-indigo-500 font-black">첨단팀 전용</span>으로 외부열람을 금지 합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPopup;
