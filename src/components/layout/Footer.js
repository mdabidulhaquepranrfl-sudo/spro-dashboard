export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-8xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center">© {year} SPRO Dashboard. Designed for field operations.</p>
      </div>
    </footer>
  );
}
