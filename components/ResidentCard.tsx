
import React from 'react';
import { Resident } from '../types';

interface ResidentCardProps {
  resident: Resident;
  onClick?: () => void;
}

const ResidentCard: React.FC<ResidentCardProps> = ({ resident, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="py-4 px-3 flex items-center justify-between group animate-in zoom-in-95 duration-500 bg-white/50 rounded-2xl border border-stone-100 mb-2 cursor-pointer hover:bg-red-50/50 transition-colors active:scale-[0.98]"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-ghibli text-xl font-bold text-stone-800">{resident.tenant}</span>
          <span className="text-[9px] text-red-500 font-black border-2 border-red-500 px-1.5 py-0.5 rounded rotate-[-5deg] scale-90 opacity-80 uppercase">
            수취인불명
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-white bg-red-600 px-2.5 py-1 rounded-md shadow-sm">
            {resident.unitNumber}
          </span>
          <span className="text-[9px] text-stone-400 font-medium">배달구역: {resident.id}</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm border border-stone-200">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>
    </div>
  );
};

export default ResidentCard;
