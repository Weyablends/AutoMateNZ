import { DollarSign, UserX, Image, Clock, MapPin, ThumbsUp } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Get help pricing your car',
    desc: 'Know what your car is actually worth in the current NZ market — so you list confidently, not blindly.',
  },
  {
    icon: UserX,
    title: 'Avoid tyre-kickers',
    desc: 'We help focus attention on people who are genuinely ready to buy, not just browsing.',
  },
  {
    icon: Image,
    title: 'Better listing presentation',
    desc: 'A well-presented listing sells faster and at a better price. We help you put your best foot forward.',
  },
  {
    icon: Clock,
    title: 'Save time',
    desc: "Less back-and-forth, fewer wasted conversations. You get on with your life while we help manage the process.",
  },
  {
    icon: MapPin,
    title: 'NZ-based support',
    desc: "We're a New Zealand service, built for the NZ car market. No overseas call centres, no generic advice.",
  },
  {
    icon: ThumbsUp,
    title: 'Simple, no-pressure process',
    desc: "No pushy sales tactics. No obligation. Just a straightforward process designed to help you sell smarter.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="section-pad bg-white">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Why AutoMate</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
            Why sellers use AutoMate
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            We're not a listing site — we're a service designed around making the process work for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-brand-200 hover:bg-brand-50/40 hover:shadow-card transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform duration-200">
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
