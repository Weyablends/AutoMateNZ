import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Comparison from './components/Comparison';
import Pricing from './components/Pricing';
import LeadForm from './components/LeadForm';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Contact from './components/Contact';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Hero />
            <TrustStrip />
            <ProblemSection />
            <HowItWorks />
            <Benefits />
            <Comparison />
            <Pricing />
            <LeadForm />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />
        </div>
      } />
      <Route path="/contact" element={<Contact />} />
      <Route path="/submit-car" element={
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="py-16 px-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-4">Submit Your Car</h1>
              <p className="text-gray-600 text-center mb-12">Fill in the details below and we'll get back to you within 24 hours.</p>
              <LeadForm />
            </div>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}
