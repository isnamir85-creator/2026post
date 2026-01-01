
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-indigo-700 px-6 pb-4">
      {/* Input Only */}
      <div className="relative group">
        <input
          type="text"
          placeholder="건물, 호수, 이름 검색..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/15 border border-white/10 rounded-2xl focus:outline-none focus:bg-white focus:text-indigo-900 focus:ring-4 focus:ring-indigo-500/30 transition-all text-sm text-white placeholder:text-white/50 shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="absolute left-3.5 top-3 w-4 h-4 text-white/50 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
