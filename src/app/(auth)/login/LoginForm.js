'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCountries } from '@/lib/getCountries';
import { loginUser } from '@/lib/loginClient';
import { saveAuth } from '@/lib/authStorage';
import { saveCountryPreference } from '@/lib/countryStorage';
import SearchableCountrySelect from '@/components/profile/SearchableCountrySelect';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [countryId, setCountryId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    const queryStaff = searchParams?.get('staffId') ?? searchParams?.get('stuffId') ?? '';
    const queryPassword = searchParams?.get('password') ?? '';
    const queryCountry = searchParams?.get('countryId');

    if (queryStaff) setStaffId(queryStaff);
    if (queryPassword) setPassword(queryPassword);
    if (queryCountry) setCountryId(Number(queryCountry));
    if (queryStaff || queryPassword || queryCountry) {
      setAutoLogin(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadCountries() {
      setIsLoading(true);
      try {
        const list = await getCountries();
        setCountries(list);
      } catch (error) {
        console.error('Countries fetch error:', error);
        setErrorMessage('Unable to load country list. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCountries();
  }, []);

  useEffect(() => {
    if (!autoLogin || isLoading || !staffId || !password || !countryId) {
      return;
    }

    handleLogin({ staffId, password, countryId });
  }, [autoLogin, isLoading, staffId, password, countryId]);

  const isAutoLoginPending = autoLogin && (isLoading || isLoggingIn);

  const handleLogin = async ({ staffId, password, countryId }) => {
    if (!staffId.trim() || !password.trim() || !countryId) {
      return;
    }

    setErrorMessage('');
    setIsLoggingIn(true);

    try {
      const response = await loginUser({ countryId, username: staffId.trim(), password: password.trim() });
      if (response?.success !== 1) {
        setErrorMessage(response?.message || 'Login failed. Please check your credentials.');
        return;
      }

      const userData = response.data;
      const country = userData?.country;
      if (!country) {
        throw new Error('Login response did not include country information.');
      }

      saveCountryPreference({
        id: country.id,
        cont_name: country.name,
        cont_code: country.code,
        cont_conn: country.connection,
      });

      saveAuth({
        user: {
          user_id: userData.user_id,
          username: userData.username,
          name: userData.name,
          profile_pic: userData.profile_pic || '',
          role: userData.role || '',
        },
        country,
      });

      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin({ staffId, password, countryId });
  };

  if (isAutoLoginPending) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-white px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="absolute inset-0 bg-white/95" />
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-[28px] border border-slate-200 bg-white/95 px-8 py-10 shadow-[0_20px_70px_rgba(2,6,23,0.12)]">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
          <p className="text-center text-lg font-semibold text-slate-900">Logging in…</p>
          <p className="max-w-sm text-center text-sm text-slate-500">
            Please wait while we verify your credentials and load your dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0" />
      </div>

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/20 bg-white/90 shadow-[0_20px_70px_rgba(2,6,23,0.3)] backdrop-blur-xl lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[280px] overflow-hidden lg:flex">
          <img
            src="/assets/img/backgrounds/login_img.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-100">
              SPRO Operations
            </div>
            <p className="mt-2 max-w-md text-sm text-slate-200/90">
              Monitor progress, review targets, and manage reports from one elegant dashboard.
            </p>
          </div>
        </div>

        <div className="w-full bg-white/95 p-6 sm:p-7 lg:p-8">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-base font-semibold text-white shadow-lg shadow-sky-200">
              SPRO
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in with staff ID, password, and country.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="staffId" className="mb-2 block text-sm font-medium text-slate-700">
                Staff ID
              </label>
              <input
                id="staffId"
                name="staffId"
                type="text"
                autoFocus
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
                placeholder="Enter staff ID"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
              <SearchableCountrySelect
                countries={countries}
                value={countryId}
                onChange={setCountryId}
                disabled={isLoading || isLoggingIn}
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || isLoggingIn || !staffId.trim() || !password.trim() || !countryId}
              className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 lg:text-left">
            New here?{' '}
            <Link href="/register" className="font-semibold text-sky-600 hover:text-sky-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-sm text-slate-500">
            Loading...
          </div>
        </main>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}