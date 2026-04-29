import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MessageSquare, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitContactForm } from '../backendService';

export default function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes (max 5MB per file, max 3 files)
    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5000000) {
        setError(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setImages([...images, ...newImages]);
    setError('');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Try Firebase submission first
      await submitContactForm(formData, images);

      // Show success message
      setSuccess(true);
      setFormData({ email: '', phone: '', message: '' });
      setImages([]);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (firebaseError) {
      console.warn("Firebase submission failed, using email fallback:", firebaseError);
      
      // Fallback to email if backend not available
      const subject = encodeURIComponent('AutoMate NZ Contact Form Submission');
      const body = encodeURIComponent(`
New contact form submission from AutoMate NZ website:

Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}

Number of images: ${images.length}

---
Sent from AutoMate NZ contact form
      `);

      try {
        const mailtoLink = `mailto:sebmeijer47@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        setFormData({ email: '', phone: '', message: '' });
        setImages([]);
      } catch (emailError) {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 mt-2">Get in touch with our team. We'd love to hear from you.</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="+64 21 123 4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-vertical"
                  placeholder="Tell us about your car selling needs..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Car Images (Optional - Max 3 images, 5MB each)
              </label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-brand-300 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={img.preview}
                        alt={img.name}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-xs text-gray-600 p-2 truncate">{img.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-medium text-green-800">✓ Message sent successfully! We'll be in touch soon.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-700 active:scale-95 transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Your details and images are securely submitted to our team. We'll contact you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}