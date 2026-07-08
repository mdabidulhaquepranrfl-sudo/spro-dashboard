'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchableCountrySelect from '@/components/profile/SearchableCountrySelect';
import { useCountry } from '@/context/CountryContext';
import { useAuth } from '@/context/AuthContext';
import { getCountries } from '@/lib/getCountries';
import { saveAuth } from '@/lib/authStorage';

export default function ProfilePage() {
  const router = useRouter();
  const { auth, logout } = useAuth();
  const { country, saveCountry } = useCountry();
  
  const user = auth?.user || {};
  
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user.name) setUserName(user.name);
    if (user.role) setUserRole(user.role);
    if (user.profile_pic) setProfilePic(user.profile_pic);
  }, [user]);

  useEffect(() => {
    if (country?.countryId) {
      setSelectedCountryId(country.countryId);
    }
  }, [country]);

  useEffect(() => {
    async function loadCountries() {
      setIsLoadingCountries(true);
      setErrorMessage('');

      try {
        const list = await getCountries();
        setCountries(list);
      } catch (error) {
        console.error('Countries fetch error:', error);
        setErrorMessage('Unable to load countries. Please try again.');
      } finally {
        setIsLoadingCountries(false);
      }
    }

    loadCountries();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedCountryId) {
      setErrorMessage('Please select a country before saving.');
      return;
    }

    const selectedCountry = countries.find((item) => item.id === selectedCountryId);

    if (!selectedCountry) {
      setErrorMessage('Selected country is invalid. Please choose again.');
      return;
    }

    if (!userName.trim()) {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    setIsSaving(true);

    try {
      // Update country preference
      saveCountry(selectedCountry);

      // Update user profile information
      const updatedAuth = {
        ...auth,
        user: {
          ...user,
          name: userName.trim(),
          role: userRole.trim(),
          profile_pic: profilePic.trim() || '/assets/img/avatars/profile.png',
        },
      };
      saveAuth(updatedAuth);

      setSuccessMessage('Profile saved successfully.');
      router.replace('/home');
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage('Unable to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayProfilePic = profilePic || '/assets/img/avatars/profile.png';

  return (
    <div className="space-y-4">
      <section className="w-full max-w-full overflow-visible rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={displayProfilePic}
              alt="User avatar"
              width={72}
              height={72}
              className="rounded-full border border-slate-200"
            />
            <div>
              <p className="text-sm font-semibold uppercase text-sky-600">Profile</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">{userName || 'User'}</h1>
              <p className="mt-1 text-sm text-slate-500">{userRole || ''}</p>
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
          <div>
            <label htmlFor="userName" className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              readOnly
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
            <SearchableCountrySelect
              countries={countries}
              value={selectedCountryId}
              onChange={setSelectedCountryId}
              disabled={isLoadingCountries || isSaving}
            />
          </div>

          {isLoadingCountries ? <p className="text-sm text-slate-500">Loading countries...</p> : null}
          {errorMessage ? <p className="text-sm text-amber-600">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={isLoadingCountries || isSaving || !selectedCountryId || !userName.trim()}
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>
    </div>
  );
}
