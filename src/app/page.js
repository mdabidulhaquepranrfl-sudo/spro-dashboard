import { Suspense } from 'react';
import AuthLayout from '@/app/(auth)/layout';
import LoginForm from '@/app/(auth)/login/LoginForm';

export default function RootPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-white px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
            <div className="flex flex-col items-center gap-4 rounded-[28px] border border-slate-200 bg-white/95 px-8 py-10 shadow-[0_20px_70px_rgba(2,6,23,0.12)]">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
              <p className="text-center text-lg font-semibold text-slate-900">Loading...</p>
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
