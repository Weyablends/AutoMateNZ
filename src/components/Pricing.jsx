import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Fastest Auction',
    subtitle: 'Fast. Market-Driven. Transparent.',
    description: 'Best for sellers who want speed and are happy to let the market determine the final price.',
    price: '$399',
    period: '+ GST',
    note: 'No success fee',
    features: [
      'Professional clean & photography',
      'Trade Me auction listing',
      'Facebook advertising',
      'Enquiry handling & viewings',
      'Trade-in & finance facilitation',
      'Sale management through to settlement',
    ],
  },
  {
    name: 'Regular Consignment',
    subtitle: 'Controlled Price. Managed Sale.',
    description: 'Set a price and let us manage the sale. You only pay the success fee once it\'s sold.',
    price: '$399',
    period: '+ GST upfront',
    note: '$1,250 success fee on sale',
    features: [
      'Professional clean & photography',
      'Trade Me fixed-price listing',
      'Facebook advertising',
      'Managed negotiations & viewings',
      'Trade-in & finance facilitation',
      'Full sale management to settlement',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    subtitle: 'Luxury Consignment',
    description: 'Premium Presentation. Targeted Reach. A tailored, discreet sales process with premium presentation for high-value vehicles.',
    price: 'Custom',
    period: 'pricing',
    note: 'Structured consignment',
    features: [
      'Premium detailing & professional media',
      'Multi-channel premium listings',
      'Targeted buyer outreach',
      'Qualified viewings & test drives',
      'Strategic negotiation',
      'Full concierge service to settlement',
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-pad bg-white">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white border rounded-2xl p-8 shadow-card hover:shadow-card-lg transition-all duration-200 ${
                plan.popular ? 'border-brand-200 ring-2 ring-brand-100' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                {plan.subtitle && (
                  <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">{plan.subtitle}</p>
                )}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period !== 'pricing' && (
                    <span className="text-gray-500 text-sm"> {plan.period}</span>
                  )}
                </div>
                {plan.note && (
                  <p className="text-green-600 text-sm font-medium">{plan.note}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-gray-600">
                    <Check size={16} className="text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="/submit-car"
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 block text-center ${
                  plan.popular
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            All plans include our 100% satisfaction guarantee. Not happy? Get your money back.
          </p>
        </div>
      </div>
    </section>
  );
}