import { useRef, useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
  const ref = useRef();
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        ref={ref}
        className="form-input"
        placeholder="Search transactions…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingLeft: 40 }}
      />
      {value && (
        <button
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', fontSize: '1rem' }}
          onClick={() => onChange('')}
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
