
import React from 'react';

const PostHeader: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-white pt-4 pb-2 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-none uppercase">LC타워 (11705)</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">ONLINE</span>
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
