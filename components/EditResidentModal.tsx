
import React, { useState, useEffect } from 'react';
import { Resident } from '../types';

interface EditResidentModalProps {
  isOpen: boolean;
  resident: Resident | null;
  onClose: () => void;
  onUpdate: (updated: Resident) => void;
}

const EditResidentModal: React.FC<EditResidentModalProps> = ({ isOpen, resident, onClose, onUpdate }) => {
  const [unit, setUnit] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (resident) {
      setUnit(resident.unitNumber);
      setName(resident.tenant);
    }
  }, [resident]);

  if (!isOpen || !resident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit.trim() || !name.trim()) return;
    onUpdate({
      ...resident,
      unitNumber: unit,
      tenant: name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-stone-50 rounded-[3rem] shadow-2xl p-8 animate-in slide-in-from-bottom-10 duration-500 border-4 border-white">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-ghibli font-bold text-stone-800 tracking-tight">정보 수정</h2>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{resident.buildingName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-stone-400 ml-1 uppercase">배달 호수 (또는 층)</label>
              <input
                autoFocus
                type="text"
                className="w-full px-5 py-4 bg-white border-2 border-stone-100 rounded-[1.5rem] focus:ring-8 focus:ring-red-500/10 focus:border-red-200 outline-none transition-all text-sm font-bold placeholder:text-stone-200"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-stone-400 ml-1 uppercase">수취인 성함</label>
              <input
                type="text"
                className="w-full px-5 py-4 bg-white border-2 border-stone-100 rounded-[1.5rem] focus:ring-8 focus:ring-red-500/10 focus:border-red-200 outline-none transition-all text-sm font-bold placeholder:text-stone-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-[1.5rem] text-sm font-bold text-stone-400 bg-stone-100 hover:bg-stone-200 transition-colors active:scale-95"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!unit.trim() || !name.trim()}
                className="flex-1 py-4 rounded-[1.5rem] text-sm font-bold text-white bg-red-600 shadow-xl shadow-red-100 hover:bg-red-700 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 border-b-4 border-red-900 font-ghibli text-lg"
              >
                변경사항 저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditResidentModal;
