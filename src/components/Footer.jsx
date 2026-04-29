import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-0.5 mb-2">
              <span className="text-lg font-extrabold text-white">Auto</span>
              <span className="text-lg font-extrabold text-brand-400">Mate</span>
              <span className="text-[11px] font-semibold text-gray-500 ml-1 mt-1.5 tracking-widest">NZ</span>
            </div>
            <p className="text-sm text-gray-500">Helping Kiwis sell cars the easy way.</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Contact</Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600">
            © {year} AutoMate NZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
