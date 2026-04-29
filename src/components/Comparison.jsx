import { X, Check } from 'lucide-react';

const rows = [
  {
    feature: 'Handling buyer messages',
    diy: 'You handle every message yourself',
    automate: 'We help filter serious interest',
  },
  {
    feature: 'Pricing your vehicle',
    diy: 'You guess based on gut feel',
    automate: 'We help review market pricing',
  },
  {
    feature: 'Dealing with lowballers',
    diy: 'You deal with every lowball offer',
    automate: 'We help reduce time-wasters',
  },
  {
    feature: 'Building your listing',
    diy: 'You build the listing alone',
    automate: 'We help improve presentation',
  },
  {
    feature: 'Overall experience',
    diy: 'Stressful and time-consuming',
    automate: 'Simple, guided, low-pressure',
  },
];

export default function Comparison() {
  return (
    <section className="section-pad bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Comparison</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
            Why not just list it yourself?
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            You can — but here's what that usually looks like versus selling with AutoMate.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[640px] bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-gray-900 text-white">
              <div className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-300">What you're dealing with</p>
              </div>
              <div className="px-6 py-4 border-l border-gray-700">
                <p className="text-sm font-semibold text-gray-300">Selling yourself</p>
              </div>
              <div className="px-6 py-4 border-l border-gray-700 bg-brand-600">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">With AutoMate</p>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">Recommended</span>
                </div>
              </div>
            </div>

            {/* Rows */}
            {rows.map(({ feature, diy, automate }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} border-t border-gray-100`}
              >
                <div className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-700">{feature}</p>
                </div>
                <div className="px-6 py-4 border-l border-gray-100">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={11} className="text-red-500" strokeWidth={3} />
                    </div>
                    <p className="text-sm text-gray-500">{diy}</p>
                  </div>
                </div>
                <div className="px-6 py-4 border-l border-brand-100 bg-brand-50/30">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                    <p className="text-sm text-brand-800 font-medium">{automate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
