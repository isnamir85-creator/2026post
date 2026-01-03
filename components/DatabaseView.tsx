
import React from 'react';
import { Resident } from '../types';

interface DatabaseViewProps {
  residents: Resident[];
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ residents }) => {
  const totalCount = residents.length;
  const uniqueBuildings = new Set(residents.map(r => r.buildingName)).size;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-[#e11d48] pt-8 pb-16 px-6 rounded-b-[3rem] shadow-lg">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-yellow-300 text-[10px] font-black uppercase tracking-[0.2em]">Data Administration</span>
            <h2 className="text-2xl font-ghibli font-bold text-white tracking-tight">수취불명 기록 대장</h2>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 -mb-24">
          <div className="bg-white rounded-[2rem] p-5 shadow-2xl border-t-4 border-yellow-400">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">총 기록수</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-red-600">{totalCount}</span>
              <span className="text-xs font-bold text-stone-300">건</span>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 shadow-2xl border-t-4 border-emerald-400">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">관할 건물</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-stone-800">{uniqueBuildings}</span>
              <span className="text-xs font-bold text-stone-300">개소</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50">
                  <th className="px-5 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b min-w-[140px]">배달지 주소</th>
                  <th className="px-4 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b text-center">호수</th>
                  <th className="px-5 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b text-right">수취인 성함</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {residents.map((res, index) => (
                  <tr key={res.id || index} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="text-[11px] font-bold text-stone-600 truncate group-hover:text-red-600 max-w-[180px]">
                        {res.buildingName}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-[10px] font-black border border-stone-200">
                        {res.unitNumber}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[15px] font-bold text-stone-800 font-ghibli">
                        {res.tenant}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {residents.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-stone-300 font-ghibli text-lg italic">기록된 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
      <div className="h-32"></div>
    </div>
  );
};

export default DatabaseView;
