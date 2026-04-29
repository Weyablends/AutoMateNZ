import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section-pad bg-gray-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container-max relative text-center">
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-4">Ready when you are</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
          Skip the stress.{' '}
          <span className="text-brand-400">Sell smarter.</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">
          Submit your car details today and let AutoMate help you sell faster, safer, and with less hassle.
        </p>
        <a
          href="#sell-my-car"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-500 active:scale-95 transition-all duration-150 shadow-lg hover:shadow-brand-600/25 hover:shadow-xl text-base"
        >
          Start Selling
          <ArrowRight size={18} />
        </a>
        <p className="mt-5 text-gray-500 text-sm">NZ based · No obligation · No cost to enquire</p>
      </div>
    </section>
  );
}
