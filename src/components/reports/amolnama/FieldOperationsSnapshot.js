'use client';

import { useEffect, useRef, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_LAST_GEO = { lat: '', lon: '', addr: '', }; 

export default function FieldOperationsSnapshot({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [lastGeo, setLastGeo] = useState(DEFAULT_LAST_GEO);
  const [isLoading, setIsLoading] = useState(Boolean(staffId && startDate && endDate));
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!staffId || !startDate || !endDate) return;

    async function fetchFieldOperations() {
      setIsLoading(true);
      try {
        const lastGeoResponse = await getReportData('last-geo', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        if (lastGeoResponse?.status === 'success') {
          setLastGeo({
            lat: lastGeoResponse.lat ?? DEFAULT_LAST_GEO.lat,
            lon: lastGeoResponse.lon ?? DEFAULT_LAST_GEO.lon,
            addr: lastGeoResponse.addr?.trim() ? lastGeoResponse.addr : 'Address not available',
          });
        }
      } catch (error) {
        console.error('Field operations fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFieldOperations();
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const latitude = Number(lastGeo.lat);
    const longitude = Number(lastGeo.lon);

    if (!mapContainerRef.current || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return undefined;
    }

    const initializeMap = () => {
      if (!window.L || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([latitude, longitude], 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      window.L.marker([latitude, longitude]).addTo(map).bindPopup(lastGeo.addr || 'Last known location');

      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 120);
    };

    if (window.L) {
      initializeMap();
      return undefined;
    }

    const leafletStylesheet = document.createElement('link');
    leafletStylesheet.rel = 'stylesheet';
    leafletStylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletStylesheet);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.async = true;
    leafletScript.onload = initializeMap;
    document.body.appendChild(leafletScript);

    return () => {
      if (leafletScript.parentNode) {
        leafletScript.parentNode.removeChild(leafletScript);
      }
      if (leafletStylesheet.parentNode) {
        leafletStylesheet.parentNode.removeChild(leafletStylesheet);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lastGeo.addr, lastGeo.lat, lastGeo.lon]);

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-1 bg-white">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-slate-900">Live Area Coverage</h4>
            </div>
            <span className="rounded-full bg-[#E3FBE8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-700">
              Live
            </span>
          </div>

         <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 relative h-80 w-full">
            {isLoading && (
              <div className="absolute inset-0 z-10 overflow-hidden rounded-xl bg-slate-200/70">
                <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.16),transparent_45%),linear-gradient(180deg,rgba(14,165,233,0.08),transparent)]" />
                <div className="absolute inset-x-4 top-4 h-4 rounded-full bg-slate-300" />
                <div className="absolute inset-x-4 top-12 h-3 w-2/3 rounded-full bg-slate-300" />
                <div className="absolute inset-x-4 bottom-4 h-20 rounded-2xl border border-slate-300 bg-white/70" />
              </div>
            )}
            <div className={`absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.14),transparent_45%),linear-gradient(180deg,rgba(14,165,233,0.06),transparent)] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
              <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
