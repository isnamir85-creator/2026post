
import React from 'react';
import { Resident } from '../types';

interface ResidentCardProps {
  resident: Resident;
}

const ResidentCard: React.FC<ResidentCardProps> = ({ resident }) => {
  return (
    <div className="py-5 flex items-center justify-between group animate-in fade-in slide-in-from-left-2 duration-300 overflow-hidden">
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2.5 mb-1.5 overflow-hidden">
          <span className="text-base font-black text-gray-900 tracking-tight truncate">{resident.tenant}</span>
          <div className="shrink-0 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[9px] text-red-600 font-black uppercase">수취인불명</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg truncate">
            {resident.unitNumber}
          </span>
          <span className="text-[10px] text-gray-300 font-medium shrink-0">ID: #{resident.id.toString().padStart(3, '0')}</span>
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          // 확인 완료 로직
        }}
        className="shrink-0 w-11 h-11 rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-90"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
};

export default ResidentCard;
