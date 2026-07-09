'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getStaffSuggestions } from '@/lib/getStaff';

export default function SearchableStaffInput({ value, onChange, placeholder = 'Staff ID', disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const containerRef = useRef(null);

  const normalizedValue = value != null ? String(value) : '';

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setFetchError('');
      return;
    }

    let active = true;
    const controller = new AbortController();

    async function loadSuggestions() {
      setIsLoading(true);
      setFetchError('');

      try {
        const results = await getStaffSuggestions(trimmed, { signal: controller.signal });
        if (active) {
          setSuggestions(results);
          setIsOpen(true);
        }
      } catch (error) {
        if (active) {
          setFetchError('Unable to load staff suggestions.');
          setSuggestions([]);
          console.error('Staff suggestions error:', error);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    const timeoutId = window.setTimeout(loadSuggestions, 300);
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const selectedSuggestion = useMemo(
    () => suggestions.find((item) => String(item.staff_id) === normalizedValue) ?? null,
    [suggestions, normalizedValue]
  );

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setSearchTerm(nextValue);
    onChange(nextValue);
    setIsOpen(nextValue.trim().length >= 3);
  };

  const handleSelect = (item) => {
    onChange(item.staff_id);
    setSearchTerm(item.staff_id);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-900 outline-none transition focus:border-[#59A14F] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        onFocus={() => {
          if (searchTerm.trim().length >= 3) {
            setIsOpen(true);
          }
        }}
      />

      {isOpen ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            {isLoading ? 'Loading staff...' : trimmedSuggestionsText(searchTerm)}
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {suggestions.length ? (
              suggestions.map((item) => (
                <li key={item.staff_id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm transition hover:bg-[#E3FBE8] ${
                      item.staff_id === normalizedValue ? 'bg-[#E3FBE8] font-semibold text-sky-700' : 'text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">{item.zone_name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-slate-500">{fetchError || 'Type 3+ characters to see suggestions.'}</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function trimmedSuggestionsText(term) {
  const trimmed = term.trim();
  if (!trimmed) return 'Type to search staff';
  return `Searching for “${trimmed}”`;
}
