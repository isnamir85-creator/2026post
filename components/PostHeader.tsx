
import React from 'react';

const PostHeader: React.FC = () => {
  return (
    <header className="px-6 mb-2 relative overflow-hidden group">
      <div className="relative z-10 flex items-center gap-3 bg-[#e11d48] p-3 rounded-2xl shadow-lg border-b-2 border-red-800/30">
        <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-md flex items-center justify-center border border-white/20">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="font-ghibli text-lg font-bold text-white leading-none">대한민국 우체국</h1>
          <p className="text-[8px] text-yellow-300 font-black tracking-widest mt-0.5 opacity-80 uppercase">design by James</p>
        </div>
        <div className="bg-white/20 px-2 py-0.5 rounded-md border border-white/10">
          <span className="text-[9px] font-black text-white">집배용</span>
        </div>
      </div>
    </header>
  );
}

export default PostHeader;
