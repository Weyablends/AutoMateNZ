import { MapPin, ShieldCheck, Users, Sparkles } from 'lucide-react';

const points = [
  { icon: MapPin, label: 'NZ Based', desc: 'Built for Kiwi sellers' },
  { icon: ShieldCheck, label: 'No Obligation', desc: 'Zero pressure, ever' },
  { icon: Users, label: 'Serious Buyers', desc: 'We filter the noise' },
  { icon: Sparkles, label: 'Hassle-Free', desc: 'Simple from start to finish' },
];

export default function TrustStrip() {
  return (
    <section className="bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {points.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
