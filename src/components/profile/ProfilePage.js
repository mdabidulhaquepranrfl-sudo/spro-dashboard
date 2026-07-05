'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchableCountrySelect from '@/components/profile/SearchableCountrySelect';
import { useCountry } from '@/context/CountryContext';
import { useAuth } from '@/context/AuthContext';
import { getCountries } from '@/lib/getCountries';

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { country, saveCountry } = useCountry();
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (country?.countryId) {
      setSelectedCountryId(country.countryId);
    }
  }, [country]);

  useEffect(() => {
    async function loadCountries() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const list = await getCountries();
        setCountries(list);
      } catch (error) {
        console.error('Countries fetch error:', error);
        setErrorMessage('Unable to load countries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCountries();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!selectedCountryId) {
      setErrorMessage('Please select a country before saving.');
      return;
    }

    const selectedCountry = countries.find((item) => item.id === selectedCountryId);

    if (!selectedCountry) {
      setErrorMessage('Selected country is invalid. Please choose again.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      saveCountry(selectedCountry);
      setSuccessMessage('Country saved successfully.');
      router.replace('/home');
    } catch (error) {
      console.error('Country save error:', error);
      setErrorMessage('Unable to save country. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="w-full max-w-full overflow-visible rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/img/avatars/1.png"
              alt="User avatar"
              width={72}
              height={72}
              className="rounded-full border border-slate-200"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Profile</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">John Doe</h1>
              <p className="mt-1 text-sm text-slate-500">Admin</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            {country?.countryName ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Current country: <span className="font-semibold">{country.countryName}</span>
              </div>
            ) : null}

            <button
              type="button"
              onClick={logout}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-8 max-w-xl space-y-4">
          <SearchableCountrySelect
            countries={countries}
            value={selectedCountryId}
            onChange={setSelectedCountryId}
            disabled={isLoading || isSaving}
          />

          {isLoading ? <p className="text-sm text-slate-500">Loading countries...</p> : null}
          {errorMessage ? <p className="text-sm text-amber-600">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={isLoading || isSaving || !selectedCountryId}
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>
    </div>
  );
}
