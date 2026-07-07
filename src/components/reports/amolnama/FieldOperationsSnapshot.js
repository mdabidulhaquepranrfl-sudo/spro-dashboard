'use client';

import { useEffect, useRef, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_LOCATIONS = [
  { site_name: 'N/A', last_visited: 'Last visited at ??' },
  { site_name: 'N/A', last_visited: 'Last visited at ??' },
];

const DEFAULT_LAST_GEO = { lat: '', lon: '', addr: '', };

export default function FieldOperationsSnapshot({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
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

        const keyLocationsResponse = await getReportData('key-locations', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        if (keyLocationsResponse?.status === 'success' && Array.isArray(keyLocationsResponse.data)) {
          setLocations(
            keyLocationsResponse.data.map((item) => ({
              site_name: item.site_name,
              last_visited: item.time || 'Last visited time unavailable',
            }))
          );
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
    <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Field Operations Snapshot</h3>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">Live overview</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-slate-900">Key Locations</h4>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-sky-700">
              Last three visited site
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
                  </div>
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
                </div>
              ))
            ) : (
              locations.map((location) => (
                <div key={location.site_name} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="font-medium text-slate-900">{location.site_name}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{location.last_visited}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-slate-900">Live Area Coverage</h4>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-cyan-700">
              Live
            </span>
          </div>

         <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 relative h-80 w-full">
            {isLoading && (
              <div className="absolute inset-0 z-10 overflow-hidden rounded-3xl bg-slate-200/70">
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
