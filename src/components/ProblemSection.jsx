import { MessageSquare, TrendingDown, MapPin } from 'lucide-react';

const problems = [
  {
    icon: MessageSquare,
    title: 'Too many time-wasters',
    desc: 'You post your car and spend days replying to people who never show up, ghost you, or just want to "have a look" with no intention of buying.',
  },
  {
    icon: TrendingDown,
    title: 'Lowball offers',
    desc: 'The moment you list your car, the lowballers come out. Getting a fair price without knowing the market is genuinely hard.',
  },
  {
    icon: MapPin,
    title: 'Awkward meetups & endless messages',
    desc: 'Coordinating test drives with strangers, answering the same questions over and over — it adds up to hours of your time.',
  },
];

export default function ProblemSection() {
  return (
    <section className="section-pad bg-white">
      <div className="container-max">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Selling a car shouldn't feel like a second job.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Most Kiwi sellers run into the same frustrating problems — and it costs them time, money, and stress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {problems.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-card transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <Icon size={20} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-6 py-4">
            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
            <p className="text-brand-800 font-medium text-sm sm:text-base">
              We help simplify the process from start to finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
