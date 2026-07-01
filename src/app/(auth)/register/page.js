import Link from 'next/link';

export const metadata = {
  title: 'Register – SPRO Dashboard',
  description: 'Create your SPRO Dashboard account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_55%,_#e2e8f0)] px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-200 backdrop-blur">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 text-lg font-semibold text-white shadow-lg shadow-sky-200">
            S
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Start managing field insights with a modern workspace</p>
        </div>

        <form action="/home" method="get" className="mt-8 space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input id="username" name="username" type="text" placeholder="Enter your username" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" autoFocus />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input id="reg-email" name="email" type="email" placeholder="Enter your email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input id="reg-password" name="password" type="password" placeholder="••••••••••••" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
            <span>I agree to the privacy policy and terms of service.</span>
          </label>
          <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700">
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
