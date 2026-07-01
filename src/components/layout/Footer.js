export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} SPRO Dashboard. Designed for field operations.</p>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="hover:text-sky-600">Privacy</a>
          <a href="#" className="hover:text-sky-600">Support</a>
          <a href="#" className="hover:text-sky-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
