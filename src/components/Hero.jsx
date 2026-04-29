import { ArrowRight, ChevronDown, Check, Search, Car } from 'lucide-react';

function ProductCard() {
  return (
    <div className="relative">
      {/* Decorative blur blobs */}
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 w-full max-w-sm mx-auto">
        {/* Card header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
            <Car size={17} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">AutoMate NZ</p>
            <p className="text-sm font-semibold text-gray-900 leading-tight">Car Sale Request</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-green-600">Live</span>
          </div>
        </div>

        {/* Rego field */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Registration</label>
          <div className="mt-1.5 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 gap-3">
            <div className="flex items-center gap-1.5">
              <div className="bg-yellow-400 rounded-sm px-1.5 py-0.5 shadow-sm">
                <span className="text-[10px] font-black text-gray-900 tracking-wide">NZ</span>
              </div>
              <span className="text-sm font-mono font-bold text-gray-800 tracking-widest">ABC · 123</span>
            </div>
            <Search size={14} className="text-gray-400 ml-auto" />
          </div>
        </div>

        {/* Estimated value */}
        <div className="mb-4 bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-4 border border-brand-100">
          <p className="text-[11px] font-semibold text-brand-500 uppercase tracking-wider mb-1">Estimated Value</p>
          <p className="text-2xl font-extrabold text-gray-900">$12,500 – $15,000</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Based on current NZ market data</p>
        </div>

        {/* Progress steps */}
        <div className="mb-4 space-y-2">
          {[
            { label: 'Details received', done: true },
            { label: 'Pricing reviewed', done: true },
            { label: 'Listing ready', done: false },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-green-500' : 'bg-gray-100 border border-gray-200'
                }`}
              >
                {done && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              <span className={`text-sm ${done ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Status footer */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5">
          <span className="text-xs text-gray-400 font-medium">Status</span>
          <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
            Ready for Review
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              New Zealand's smarter way to sell your car
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              Sell Your Car{' '}
              <span className="text-brand-600">Without</span>{' '}
              the Hassle
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              AutoMate helps Kiwis sell their cars faster, safer, and smarter — without dealing with endless messages,
              lowball offers, or time-wasters.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href="#sell-my-car"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-700 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg text-base"
              >
                Sell My Car
                <ArrowRight size={18} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-7 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-150 text-base"
              >
                See How It Works
                <ChevronDown size={16} />
              </a>
            </div>

            <p className="text-sm text-gray-400 font-medium tracking-wide">
              NZ based &nbsp;·&nbsp; No obligation &nbsp;·&nbsp; Quick response
            </p>
          </div>

          {/* Right: Product UI card */}
          <div className="flex justify-center lg:justify-end">
            <ProductCard />
          </div>
        </div>
      </div>
    </section>
  );
}
