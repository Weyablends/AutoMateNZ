import { ClipboardList, Search, FileText, Handshake } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Submit your car details',
    desc: 'Fill in a quick form with your vehicle info — make, model, year, ks, and a few photos. Takes about 3 minutes.',
  },
  {
    number: '02',
    icon: Search,
    title: 'We review your vehicle and pricing',
    desc: 'Our team looks at current NZ market data to help you understand what your car is actually worth — no guessing.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'We help prepare a better listing',
    desc: 'Good listings sell faster. We help you present your car in the best light with clear info and strong presentation.',
  },
  {
    number: '04',
    icon: Handshake,
    title: 'We connect you with serious buyer interest',
    desc: "We help surface your vehicle to people who are genuinely looking to buy — reducing the noise and back-and-forth.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
            How AutoMate Works
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Four simple steps — and we're with you the whole way.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ number, icon: Icon, title, desc }, i) => (
            <div
              key={number}
              className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow duration-200"
            >
              {/* Connector line (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%+1px)] w-6 h-0.5 bg-gray-200 z-10" />
              )}

              <div className="flex items-start gap-3 mb-4">
                <span className="text-4xl font-extrabold text-gray-100 leading-none select-none">{number}</span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center mb-4 shadow-sm">
                <Icon size={18} className="text-white" />
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
