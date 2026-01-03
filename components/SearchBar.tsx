
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const HondaSuperCub = () => (
  <svg width="60" height="27" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-x-[-1] drop-shadow-sm">
    {/* 바퀴 스포크 애니메이션 (속도에 맞춰 더 천천히) */}
    <g className="animate-spin-slowest">
      {/* 뒷바퀴 */}
      <circle cx="95" cy="45" r="12" stroke="#333" strokeWidth="2.5" fill="#1a1a1a" />
      <path d="M95 35V55M85 45H105" stroke="#444" strokeWidth="1" />
      {/* 앞바퀴 */}
      <circle cx="25" cy="45" r="12" stroke="#333" strokeWidth="2.5" fill="#1a1a1a" />
      <path d="M25 35V55M15 45H35" stroke="#444" strokeWidth="1" />
    </g>

    {/* 엔진 및 머플러 (실버/그레이) */}
    <rect x="45" y="42" width="50" height="6" rx="3" fill="#94a3b8" /> {/* 머플러 */}
    <circle cx="65" cy="45" r="6" fill="#64748b" /> {/* 엔진부 */}
    
    {/* 메인 바디 (레드) */}
    <path d="M35 45L45 22H65L100 32V45H35Z" fill="#E11D48" />
    <path d="M30 22H45L35 45H22L30 22Z" fill="#FFFFFF" /> {/* 레그 실드 (화이트 치마) */}
    
    {/* 시트 (블랙) */}
    <path d="M65 28C65 25 75 22 85 22C90 22 92 25 92 28H65Z" fill="#18181b" />

    {/* 빨간 우체국 박스 및 로고 */}
    <rect x="80" y="10" width="35" height="22" rx="2" fill="#E11D48" />
    <g transform="translate(87, 16) scale(0.45)">
      {/* 하얀색 제비 로고 심볼 */}
      <path d="M2 8C5 -1 15 -1 18 8L10 14L2 8Z" fill="white" />
      <rect x="5" y="9" width="10" height="1.5" fill="#E11D48" rx="0.3" />
    </g>

    {/* 핸들 및 헤드라이트 */}
    <path d="M40 22L38 12H48L45 22" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    <circle cx="38" cy="14" r="4" fill="#E11D48" /> {/* 라이트 케이스 */}
    <circle cx="38" cy="14" r="2.5" fill="#FEF9C3" className="animate-pulse" /> {/* 노란 전등 */}
    
    {/* 백미러 */}
    <line x1="42" y1="12" x2="44" y2="6" stroke="#333" strokeWidth="1" />
    <circle cx="44" cy="6" r="1.5" fill="#94a3b8" />
  </svg>
);

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="px-6 mb-4 relative">
      <div className="relative group overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-md transition-all focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
        
        {/* 애니메이션 설정: 12초 주기로 더 여유롭게 질주 */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="animate-cub-run-slowest absolute inset-y-0 left-0 flex items-center">
            <div className="relative transform translate-y-2">
              <HondaSuperCub />
              <div className="absolute -left-2 bottom-0.5 opacity-20 animate-smoke-slowest text-[8px]">💨</div>
            </div>
          </div>
        </div>

        {/* 검색 입력창 */}
        <div className="relative animate-input-bump-slowest">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 animate-icon-jump-slowest">
            <svg className="w-5 h-5 text-stone-300 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="수취인/건물 검색"
            className="w-full pl-12 pr-6 py-4 bg-transparent outline-none text-sm font-bold text-stone-800 placeholder:text-stone-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cub-run-slowest {
          0% { transform: translateX(-100px); opacity: 0; }
          5% { opacity: 1; }
          48% { transform: translateX(40px) rotate(-0.5deg); }
          50% { transform: translateX(60px) translateY(-1px) rotate(0.5deg); }
          52% { transform: translateX(80px) rotate(0deg); }
          100% { transform: translateX(550px); opacity: 0; }
        }

        @keyframes input-bump-slowest {
          0%, 48%, 54%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
          52% { transform: translateY(0.5px); }
        }

        @keyframes icon-jump-slowest {
          0%, 48%, 56%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.2); color: #e11d48; }
        }

        @keyframes spin-slowest {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes smoke-slowest {
          0% { transform: scale(0.5) translateX(0); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: scale(1.1) translateX(-10px); opacity: 0; }
        }

        .animate-cub-run-slowest { animation: cub-run-slowest 12s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-input-bump-slowest { animation: input-bump-slowest 12s infinite; }
        .animate-icon-jump-slowest { animation: icon-jump-slowest 12s infinite; }
        .animate-spin-slowest circle, .animate-spin-slowest path { 
          animation: spin-slowest 0.8s linear infinite; 
          transform-origin: center;
        }
        /* 개별 바퀴 회전축 설정 */
        .animate-spin-slowest circle:nth-child(1) { transform-origin: 95px 45px; }
        .animate-spin-slowest circle:nth-child(3) { transform-origin: 25px 45px; }
        .animate-smoke-slowest { animation: smoke-slowest 1.5s ease-out infinite; }
      `}} />
    </div>
  );
};

export default SearchBar;
