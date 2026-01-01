
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
      {/* DB View Header */}
      <div className="bg-indigo-700 pt-8 pb-16 px-6">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em]">Internal Assets</span>
            <h2 className="text-2xl font-black text-white tracking-tight">Data Explorer</h2>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 -mb-24">
          <div className="bg-white rounded-[2rem] p-5 shadow-2xl shadow-indigo-900/10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Total Records</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">{totalCount}</span>
              <span className="text-xs font-bold text-gray-300">명단</span>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-5 shadow-2xl shadow-indigo-900/10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Coverage</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-indigo-600">{uniqueBuildings}</span>
              <span className="text-xs font-bold text-gray-300">건물</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table Section */}
      <div className="mt-20 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">#ID</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 min-w-[120px]">Building</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Unit</th>
                  <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Tenant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {residents.map((res, idx) => (
                  <tr key={res.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-bold text-gray-300 tabular-nums">
                        {res.id.toString().padStart(3, '0')}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-[150px]">
                      <div className="text-xs font-black text-gray-800 truncate group-hover:text-indigo-600">
                        {res.buildingName.split(' (')[0]}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black whitespace-nowrap">
                        {res.unitNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[13px] font-black text-gray-900 whitespace-nowrap">
                        {res.tenant}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="py-10 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
          End of Database Stream
        </p>
      </div>
    </div>
  );
};

export default DatabaseView;
