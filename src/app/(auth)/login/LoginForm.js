'use client';

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberStaffId, setRememberStaffId] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderImages = [
    '/assets/img/login_slider_1.jpg',
    '/assets/img/login_slider_2.jpg',
    '/assets/img/login_slider_3.jpg',
  ];

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
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % sliderImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

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
      <main className="relative flex h-screen w-screen max-h-screen max-w-full items-center justify-center bg-[#F8FAFC] px-4 py-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        <div className="relative z-10 flex flex-col items-center gap-4 rounded-[24px] border border-slate-200 bg-white px-10 py-12 shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <p className="text-center text-lg font-semibold text-slate-900">Logging in…</p>
          <p className="max-w-sm text-center text-sm text-slate-500">
            Please wait while we verify your credentials and load your dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 h-screen w-screen max-h-screen max-w-full overflow-hidden bg-[#F8FAFC]">
      {/* Left Portion: Carousel */}
      <section className="relative hidden lg:block h-full w-full overflow-hidden">
        <div className="absolute inset-0">
          {sliderImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Login slide ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover ${ index === 2 ? 'object-top' : ''} transition-opacity duration-1000 ease-in-out ${activeSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
            />
          ))}
          <div className="absolute inset-0 bg-slate-200/10" />
        </div>

        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="bg-white/30 backdrop-blur-md border border-white/40 p-3 rounded-2xl shadow-xl">
            <h5 className="font-thin text-2xl text-black mb-3">Connecting Businesses Worldwide</h5>
            <p className="text-sm text-slate-600 font-small leading-relaxed">
              Welcome to SPRO, the centralized enterprise portal of PRAN-RFL Group.
            </p>
          </div>
        </div>
      </section>

      {/* Right Portion: Login Form */}
      <section className="flex h-screen items-center justify-center overflow-y-auto p-2 sm:p-4 lg:p-6">
        <div className="w-full max-w-[460px] max-h-[98vh] overflow-y-auto rounded-[24px] border border-[#F1F5F9] bg-white p-8 sm:p-6 lg:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]">

          <div className="flex items-center justify-center gap-2">
            <img
              src="/assets/img/spro_logo.svg"
              alt="SPRO Logo"
              className="h-7 w-auto shrink-0 lg:h-8"
            />
            <h4 className="m-0 leading-none text-2xl font-bold text-slate-800">
              Web Portal
            </h4>
          </div>

          <p className="mt-2 text-center text-sm font-medium text-slate-400">
            Login using your HRIS credentials.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* ... rest of your form remains the same ... */}

            <div>
              <SearchableCountrySelect
                countries={countries}
                value={countryId}
                onChange={setCountryId}
                disabled={isLoading || isLoggingIn}
                placeholder="Search and select a country"
              />
            </div>

            <div>
              <label htmlFor="staffId" className="mb-1 block text-sm font-medium text-slate-700">
                Staff ID
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                  <i className="bx bx-user text-base" />
                </span>
                <input
                  id="staffId"
                  name="staffId"
                  type="text"
                  autoComplete="username"
                  value={staffId}
                  onChange={(event) => setStaffId(event.target.value)}
                  placeholder="Enter your Staff ID"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 text-sm font-medium transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                  <i className="bx bx-lock-alt text-base" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your hris password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 text-sm font-medium transition-all text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} text-base`} />
                </button>
              </div>
            </div>

            <label className="inline-flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-slate-500">
              <input
                type="checkbox"
                checked={rememberStaffId}
                onChange={(event) => setRememberStaffId(event.target.checked)}
                className="mt-0 h-4 w-4 shrink-0 rounded border-slate-300 align-middle text-emerald-500"
              />
              <span className="leading-none">  Remember Staff ID</span>
            </label>

            {errorMessage ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || isLoggingIn || !staffId.trim() || !password.trim() || !countryId}
              className="bg-[#00AA4F] hover:bg-[#009142] text-white font-bold py-3.5 rounded-xl w-full text-base tracking-wide shadow-md shadow-emerald-200/50 transition-all transform active:scale-95 mt-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>

            <div className="bg-[#E0F2FE] text-[#0369A1] rounded-xl p-3 flex items-start gap-3 mt-4 border border-blue-100 text-xs font-medium leading-normal">
              <span className="mt-0.5 text-base flex items-center">
                <i className="bx bx-info-circle" />
              </span>
              <span>Staff ID and Password are authenticated through the HRIS system.</span>
            </div>

            <div className="text-xs font-semibold text-slate-400 tracking-wide transition-colors flex flex-wrap items-center justify-center gap-4 mt-5">
              <a href="#" className="hover:text-slate-600">Contact IT Support</a>
              <span className="h-px w-2 bg-slate-200" />
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            </div>

            <p className="text-[10px] font-medium text-slate-400 mt-4 text-center block">
              © 2026 PRAN-RFL Group. All rights reserved.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-sm text-slate-500">Loading...</div>
        </main>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}