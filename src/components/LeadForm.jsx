import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  make: '',
  model: '',
  year: '',
  kilometres: '',
  rego: '',
  askingPrice: '',
  location: '',
  photos: null,
  extraDetails: '',
};

const REQUIRED = ['fullName', 'phone', 'make', 'model', 'year', 'location'];

const YEAR_OPTIONS = Array.from({ length: 35 }, (_, i) => String(new Date().getFullYear() - i));

const NZ_LOCATIONS = [
  'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga',
  'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua',
  'New Plymouth', 'Whangarei', 'Invercargill', 'Whanganui', 'Gisborne', 'Other',
];

// ── Submit handler ──────────────────────────────────────────────────────────
// Sends car details to Netlify function → Google Sheets
async function submitToBackend(data) {
  console.log('[AutoMate NZ] Form submission:', data);
  
  const res = await fetch('/.netlify/functions/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formType: 'submission',
      ...data,
      timestamp: new Date().toISOString(),
    }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Submission failed');
  }
  
  return res.json();
}
// ────────────────────────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, label, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-brand-600 ml-0.5">*</span>}
    </label>
  );
}

function Input({ id, type = 'text', placeholder, value, onChange, error, ...rest }) {
  return (
    <div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

function Select({ id, value, onChange, children, error }) {
  return (
    <div>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none cursor-pointer ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

export default function LeadForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.make.trim()) next.make = 'Vehicle make is required.';
    if (!form.model.trim()) next.model = 'Vehicle model is required.';
    if (!form.year) next.year = 'Year is required.';
    if (!form.location) next.location = 'Location is required.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrorId = Object.keys(errs)[0];
      document.getElementById(firstErrorId)?.focus();
      return;
    }
    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      await submitToBackend({ ...form, submittedAt: new Date().toISOString() });
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section id="sell-my-car" className="section-pad bg-gray-50">
        <div className="container-max">
          <div className="max-w-lg mx-auto text-center bg-white rounded-3xl border border-gray-100 shadow-card p-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Thanks — we've got it!</h3>
            <p className="text-gray-500 leading-relaxed">
              Your car details have been received. We'll review them and be in touch shortly. No obligation at all.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sell-my-car" className="section-pad bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Get started</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
            Ready to sell your car?
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Send us your details and we'll review your vehicle. No pressure, no obligation.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-5">
            <p className="text-white font-semibold text-base">Your Car Details</p>
            <p className="text-brand-200 text-sm">Fields marked with * are required</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-6">
            {/* Personal details */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                Your Details
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="fullName" label="Full Name" required />
                  <Input
                    id="fullName"
                    placeholder="e.g. Sarah Thompson"
                    value={form.fullName}
                    onChange={set('fullName')}
                    error={errors.fullName}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="phone" label="Phone Number" required />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 021 123 4567"
                    value={form.phone}
                    onChange={set('phone')}
                    error={errors.phone}
                    autoComplete="tel"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="email" label="Email Address" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. sarah@email.com"
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle details */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                Vehicle Details
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="make" label="Vehicle Make" required />
                  <Input
                    id="make"
                    placeholder="e.g. Toyota"
                    value={form.make}
                    onChange={set('make')}
                    error={errors.make}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="model" label="Vehicle Model" required />
                  <Input
                    id="model"
                    placeholder="e.g. Corolla"
                    value={form.model}
                    onChange={set('model')}
                    error={errors.model}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="year" label="Year" required />
                  <Select id="year" value={form.year} onChange={set('year')} error={errors.year}>
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <FieldLabel htmlFor="kilometres" label="Kilometres" />
                  <Input
                    id="kilometres"
                    placeholder="e.g. 85,000"
                    value={form.kilometres}
                    onChange={set('kilometres')}
                    error={errors.kilometres}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="rego" label="Registration Number" />
                  <Input
                    id="rego"
                    placeholder="e.g. ABC123"
                    value={form.rego}
                    onChange={set('rego')}
                    error={errors.rego}
                    className="uppercase"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="askingPrice" label="Asking Price (NZD)" />
                  <Input
                    id="askingPrice"
                    placeholder="e.g. $14,500"
                    value={form.askingPrice}
                    onChange={set('askingPrice')}
                    error={errors.askingPrice}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="location" label="Location" required />
                  <Select id="location" value={form.location} onChange={set('location')} error={errors.location}>
                    <option value="">Select your city / region</option>
                    {NZ_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Photos + extra */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
                Photos & Notes
              </p>

              <div className="mb-4">
                <FieldLabel htmlFor="photos" label="Vehicle Photos" />
                <label
                  htmlFor="photos"
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-brand-300 cursor-pointer transition-colors duration-150"
                >
                  <Upload size={20} className="text-gray-400 mb-1.5" />
                  <p className="text-sm font-medium text-gray-500">Click to upload photos</p>
                  <p className="text-xs text-gray-400">JPG, PNG, HEIC up to 10MB each</p>
                  <input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => setForm((f) => ({ ...f, photos: e.target.files }))}
                  />
                </label>
                {form.photos && form.photos.length > 0 && (
                  <p className="mt-1.5 text-xs text-green-600 font-medium">
                    {form.photos.length} file{form.photos.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="extraDetails" label="Extra Details" />
                <textarea
                  id="extraDetails"
                  rows={4}
                  placeholder="Any additional info — service history, modifications, reason for selling, etc."
                  value={form.extraDetails}
                  onChange={set('extraDetails')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors duration-150 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 text-base shadow-md hover:shadow-lg"
            >
              {submitting ? 'Submitting…' : 'Submit My Car'}
            </button>

            <p className="text-center text-xs text-gray-400">
              No obligation. We review your details and get back to you — simple as that.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
