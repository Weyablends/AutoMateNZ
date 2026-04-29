import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-0.5 select-none" aria-label="AutoMate NZ home">
            <span className="text-xl font-extrabold tracking-tight text-gray-900">Auto</span>
            <span className="text-xl font-extrabold tracking-tight text-brand-600">Mate</span>
            <span className="text-[11px] font-semibold text-gray-400 ml-1 mt-2 tracking-widest">NZ</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              How it works
            </a>
            <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Benefits
            </a>
            <a href="#sell-my-car" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sell my car
            </a>
            <a
              href="/submit-car"
              className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Get Started
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-5 flex flex-col gap-3 shadow-lg">
          <a href="#how-it-works" onClick={close} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">
            How it works
          </a>
          <a href="#benefits" onClick={close} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">
            Benefits
          </a>
          <a href="#sell-my-car" onClick={close} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">
            Sell my car
          </a>
          <a
            href="/submit-car"
            onClick={close}
            className="mt-1 bg-brand-600 text-white text-sm font-semibold px-5 py-3 rounded-xl text-center hover:bg-brand-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
