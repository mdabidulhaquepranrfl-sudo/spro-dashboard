'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export default function SearchableCountrySelect({
  countries,
  value,
  onChange,
  placeholder = 'Search and select country',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const normalizedValue = value != null ? String(value) : null;

  const selectedCountry = useMemo(
    () => countries.find((country) => String(country.id) === normalizedValue) ?? null,
    [countries, normalizedValue]
  );

  const filteredCountries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return countries ?? [];
    }

    return (countries ?? []).filter((country) =>
      [country.cont_name, country.cont_code, country.cont_conn]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }, [countries, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    onChange(country.id);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-slate-700">Select Country</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm outline-none transition hover:bg-white focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={selectedCountry ? 'font-medium text-slate-800' : 'text-slate-500'}>
          {selectedCountry?.cont_name || placeholder}
        </span>
        <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search country..."
              autoFocus
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          <ul className="max-h-64 overflow-y-auto py-1">
            {filteredCountries.length ? (
              filteredCountries.map((country) => {
                const isSelected = country.id === value;

                return (
                  <li key={country.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-[#E3FBE8] ${
                        isSelected ? 'bg-[#E3FBE8] font-semibold text-sky-700' : 'text-slate-700'
                      }`}
                    >
                      <span>{country.cont_name}</span>
                      <span className="text-xs text-slate-400">{country.cont_code}</span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-sm text-slate-500">No countries found.</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
