
import React, { useState } from 'react';

interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (unit: string, name: string) => void;
  buildingName: string;
}

const AddResidentModal: React.FC<AddResidentModalProps> = ({ isOpen, onClose, onAdd, buildingName }) => {
  const [unit, setUnit] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit.trim() || !name.trim()) return;
    onAdd(unit, name);
    setUnit('');
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10 sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">수취인불명 추가</h2>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">{buildingName.split(' (')[0]}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 ml-1 uppercase">호수 (또는 층)</label>
              <input
                autoFocus
                type="text"
                placeholder="예: 808호, 2층"
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-bold placeholder:text-gray-300"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 ml-1 uppercase">수취인 이름</label>
              <input
                type="text"
                placeholder="성함을 입력하세요"
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-bold placeholder:text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-sm font-black text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!unit.trim() || !name.trim()}
                className="flex-1 py-4 rounded-2xl text-sm font-black text-white bg-indigo-600 shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddResidentModal;
