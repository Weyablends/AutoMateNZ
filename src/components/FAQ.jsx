import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is there any obligation if I submit my details?',
    a: 'None at all. Submitting your car details is completely free and carries zero obligation. We review what you send us and get back to you — there\'s no pressure to proceed at any stage.',
  },
  {
    q: 'Do you buy the car directly from me?',
    a: 'Not directly. AutoMate is a service that helps you sell your car — we help with pricing guidance, listing preparation, and connecting you with serious buyer interest. We don\'t purchase vehicles ourselves.',
  },
  {
    q: 'How fast will I hear back after submitting?',
    a: "We aim to review submissions as quickly as possible. You can generally expect to hear from us within 1–2 business days, though we can't guarantee specific turnaround times. We'll always let you know where things are at.",
  },
  {
    q: 'What types of cars do you accept?',
    a: "We work with most standard passenger vehicles, SUVs, and utes registered in New Zealand. If you're unsure whether your vehicle is suitable, just submit the details and we'll let you know.",
  },
  {
    q: 'Do I need professional photos of my car?',
    a: "No — clear, decent-quality photos taken on a smartphone are perfectly fine to start with. Good lighting and a clean car go a long way. We can advise on presentation after reviewing your submission.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-gray-900 group-hover:text-brand-700 transition-colors duration-150">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180 text-brand-600' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="section-pad bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
            Common questions
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Straightforward answers — no jargon.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-100 rounded-2xl px-6 sm:px-8 shadow-card">
          {faqs.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
