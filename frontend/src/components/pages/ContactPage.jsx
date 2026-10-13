import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  HelpCircle,
  ExternalLink,
  HeartHandshake,
  Compass
} from 'lucide-react';
import { api } from '../../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Royal Wedding',
    eventDate: '',
    guestCount: '150',
    location: 'Bangalore',
    budget: '₹3,00,000 - ₹6,00,000',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How far in advance should we reserve our event date?',
      a: 'For weddings and large corporate conventions, we strongly recommend booking 3 to 9 months in advance. Because Eventora caps simultaneous celebrations per calendar date to ensure absolute execution perfection, auspicious dates fill up quickly.'
    },
    {
      q: 'Can we schedule an in-person meeting or private food tasting?',
      a: 'Yes! You are welcome to visit our Flagship Royal Galleria in Bangalore or our Mumbai and Delhi design salons. For all major bookings, we also host executive chef tastings for your core family or organizing committee.'
    },
    {
      q: 'Do you manage destination weddings outside major cities?',
      a: 'Absolutely. Eventora regularly choreographs turnkey destination celebrations in Udaipur, Jaipur, Goa, Jim Corbett, and international venues with our travel-ready production directors.'
    },
    {
      q: 'How does your real-time slot capacity guarantee prevent double booking?',
      a: 'Our proprietary slot engine synchronizes directly with our database. Once a date reaches its capacity threshold, the system automatically locks the date to guarantee our undivided attention on your celebration.'
    },
    {
      q: 'Can we customize our decor and catering outside the standard packages?',
      a: 'Yes, 100%. Our package tiers provide a transparent production baseline, but every single floral element, mandap fabric, stage LED, and culinary live counter can be customized to your taste.'
    }
  ];

  const studios = [
    {
      city: 'Bangalore Flagship Galleria',
      address: 'Eventora Royal Galleria, 42 Palace Cross Road, Vasanth Nagar, Bangalore - 560052',
      phone: '+91 80 4455 6677 / +91 98765 43210',
      hours: 'Mon - Sun: 9:00 AM - 9:30 PM IST',
      type: 'Headquarters & Showcase'
    },
    {
      city: 'Mumbai Design Studio',
      address: 'Level 4, The Grand Pavilion, Linking Road, Bandra West, Mumbai - 400050',
      phone: '+91 22 6677 8899 / +91 98765 43210',
      hours: 'Tue - Sun: 10:00 AM - 8:30 PM IST',
      type: 'Tasting Salon & Styling'
    },
    {
      city: 'Delhi NCR Executive Lounge',
      address: 'Tower B, Worldmark 2, Aerocity Hospitality District, New Delhi - 110037',
      phone: '+91 11 4433 2211 / +91 98765 43210',
      hours: 'Mon - Sat: 9:30 AM - 8:00 PM IST',
      type: 'Corporate & VIP Concierge'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your name, email, and contact number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContactInquiry(formData);
      if (res.success) {
        setSubmitSuccess({
          referenceNumber: res.referenceNumber,
          message: res.message,
          data: { ...formData }
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Eventora Luxury Concierge! I would like to inquire about planning an event:\n` +
    `• Name: ${formData.name || 'Valued Guest'}\n` +
    `• Event: ${formData.eventType}\n` +
    `• Target Date: ${formData.eventDate || 'Flexible'}\n` +
    `• Guests: ${formData.guestCount}\n` +
    `• City: ${formData.location}`
  );

  return (
    <div className="contact-page-wrapper" style={{ paddingTop: '36px', paddingBottom: '90px', background: '#f8fafc', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* PAGE HERO HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 46px auto' }}>
          <div className="heading-tagline" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} />
            <span>Dedicated Event Concierge & VIP Consultations</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.8px', lineHeight: '1.15' }}>
            Let’s Bring Your Vision <br />
            <span style={{ color: '#7c3aed', fontStyle: 'italic' }}>To Royal Life</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', marginTop: '12px', lineHeight: '1.65' }}>
            Whether you are planning an opulent destination wedding, a milestone birthday gala, or an executive conference, our senior directors are at your service.
          </p>
        </div>

        {/* 4 FAST CONTACT PILLARS */}
        <div className="contact-pillars-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '46px'
        }}>
          {/* Card 1: Direct Hotline */}
          <a 
            href="tel:+919876543210" 
            className="card-interactive" 
            style={{
              padding: '24px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Phone size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>
                Instant Concierge Desk
              </span>
              <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                +91 98765 43210
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#7c3aed', fontWeight: '600', marginTop: '4px' }}>
                Click to call directly →
              </p>
            </div>
          </a>

          {/* Card 2: WhatsApp Chat */}
          <a 
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-interactive" 
            style={{
              padding: '24px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>
                WhatsApp VIP Lounge
              </span>
              <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                Live Chat Support
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#059669', fontWeight: '600', marginTop: '4px' }}>
                Start WhatsApp chat →
              </p>
            </div>
          </a>

          {/* Card 3: Email Concierge */}
          <a 
            href="mailto:concierge@eventora.luxury" 
            className="card-interactive" 
            style={{
              padding: '24px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Mail size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>
                Executive Inquiries
              </span>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: '#0f172a', marginTop: '2px', wordBreak: 'break-all' }}>
                concierge@eventora.luxury
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '600', marginTop: '4px' }}>
                Send written proposal →
              </p>
            </div>
          </a>

          {/* Card 4: Slot Checker Quick Link */}
          <Link 
            to="/book" 
            className="card-interactive" 
            style={{
              padding: '24px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
              border: '1.5px solid #d8b4fe'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#7c3aed',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b21a8' }}>
                Instant Reservation
              </span>
              <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                Live Slot Engine
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#7c3aed', fontWeight: '700', marginTop: '4px' }}>
                Check real-time dates →
              </p>
            </div>
          </Link>
        </div>

        {/* 2-COLUMN MAIN CONTENT: INQUIRY FORM + EXPERIENCE SIDEBAR */}
        <div className="contact-main-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
          gap: '36px',
          alignItems: 'start',
          marginBottom: '60px'
        }}>
          
          {/* LEFT: INTERACTIVE CONSULTATION FORM */}
          <div className="card-white" style={{ padding: '36px', borderRadius: '26px' }}>
            
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  color: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: '2px solid #a7f3d0',
                  boxShadow: '0 10px 24px -4px rgba(16, 185, 129, 0.3)'
                }}>
                  <CheckCircle2 size={44} strokeWidth={2.5} />
                </div>

                <div className="heading-tagline" style={{ background: '#ecfdf5', color: '#065f46', marginBottom: '12px' }}>
                  <ShieldCheck size={14} />
                  <span>VIP Inquiry Confirmed</span>
                </div>

                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                  Thank You, {submitSuccess.data.name}!
                </h2>
                <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
                  Your event inquiry has been logged in our executive database. A Senior Celebration Director will contact you within 4 hours.
                </p>

                {/* Reference pill */}
                <div style={{
                  display: 'inline-block',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  marginBottom: '28px'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
                    Official Inquiry Reference Code
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#7c3aed', letterSpacing: '1px' }}>
                    {submitSuccess.referenceNumber}
                  </span>
                </div>

                {/* Summary card */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'left',
                  marginBottom: '28px',
                  border: '1px solid #e2e8f0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  fontSize: '0.88rem'
                }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Event Type</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{submitSuccess.data.eventType}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Target Date</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{submitSuccess.data.eventDate || 'To be decided'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Planned Guests</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{submitSuccess.data.guestCount} Guests</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>City</span>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{submitSuccess.data.location}</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Eventora, I just submitted consultation inquiry #${submitSuccess.referenceNumber} for my ${submitSuccess.data.eventType}. Let's discuss!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                    style={{ padding: '12px 24px', borderRadius: '12px', background: '#059669' }}
                  >
                    <MessageSquare size={16} />
                    <span>Continue on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        eventType: 'Royal Wedding',
                        eventDate: '',
                        guestCount: '150',
                        location: 'Bangalore',
                        budget: '₹3,00,000 - ₹6,00,000',
                        message: ''
                      });
                    }}
                    className="btn-secondary"
                    style={{ padding: '12px 24px', borderRadius: '12px' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}>
                      ✦
                    </span>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>
                      Schedule a VIP Consultation
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>
                    Share your celebration parameters and our senior creative team will prepare a tailored presentation and itemized cost projection.
                  </p>
                </div>

                {errorMessage && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    color: '#b91c1c',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    marginBottom: '20px'
                  }}>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Row 1: Name & Email */}
                  <div className="form-responsive-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Radhika Singhania"
                        required
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. radhika@example.com"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone & Event Type */}
                  <div className="form-responsive-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                    <div>
                      <label className="form-label">Mobile Number (WhatsApp Preferred) *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        required
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Celebration Format</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="Royal Wedding">Royal Wedding & Mandap Ceremony</option>
                        <option value="Birthday Party">Milestone Birthday Party</option>
                        <option value="Engagement">Grand Engagement Gala</option>
                        <option value="Corporate Events">Corporate Summit & Gala Dinner</option>
                        <option value="Anniversary">Silver / Golden Anniversary</option>
                        <option value="Religious Events">Traditional Religious Ceremony & Pooja</option>
                        <option value="Baby Shower">Baby Shower & Welcoming Gala</option>
                        <option value="Reception">Post-Wedding Grand Reception</option>
                        <option value="Other Special Events">Bespoke Custom Celebration</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Event Date & Guests */}
                  <div className="form-responsive-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                    <div>
                      <label className="form-label">Target Celebration Date</label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Estimated Guest Count</label>
                      <select
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="50">Intimate Gathering (Up to 50 Guests)</option>
                        <option value="150">Grand Gathering (50 - 150 Guests)</option>
                        <option value="300">Prestigious Gala (150 - 300 Guests)</option>
                        <option value="600">Royal Scale (300 - 600 Guests)</option>
                        <option value="1000+">Mega Celebration (600 - 1,500+ Guests)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: City & Budget */}
                  <div className="form-responsive-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                    <div>
                      <label className="form-label">Event Destination / City</label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="Bangalore">Bangalore (Palace / Resorts)</option>
                        <option value="Mumbai">Mumbai & Alibaug</option>
                        <option value="Delhi NCR">Delhi NCR & Gurugram</option>
                        <option value="Udaipur & Jaipur">Rajasthan Royal Palaces (Udaipur / Jaipur)</option>
                        <option value="Goa">Goa Beachfront Destination</option>
                        <option value="Other Location">Other City / International</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Estimated Production Budget</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000 (Silver Intimate)</option>
                        <option value="₹1,50,000 - ₹3,50,000">₹1,50,000 - ₹3,50,000 (Gold Standard)</option>
                        <option value="₹3,50,000 - ₹8,00,000">₹3,50,000 - ₹8,00,000 (Platinum Elite)</option>
                        <option value="₹8,00,000 - ₹20,00,000+">₹8,00,000 - ₹20,00,000+ (Imperial Royal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Message */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="form-label">Special Requests / Themes / Dietary Preferences</label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your dream themes (e.g. pastel floral mandap, Michelin live pasta counters, acoustic violinists, 4K cinematic video)..."
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '16px',
                      fontSize: '1rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                      boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)'
                    }}
                  >
                    {loading ? (
                      <span>Submitting Your VIP Request...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Consultation Request</span>
                      </>
                    )}
                  </button>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
                    🔒 Zero spam guarantee. Your contact details remain confidential under Eventora Privacy Protocol.
                  </p>
                </form>
              </div>
            )}

          </div>

          {/* RIGHT: GALLERIA STUDIOS & TRUST ASSURANCES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Galleria Studio Cards */}
            <div className="card-white" style={{ padding: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <Building2 size={20} style={{ color: '#7c3aed' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                  Our Design Studios & Salons
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {studios.map((studio, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                        {studio.city}
                      </h4>
                      <span style={{ fontSize: '0.68rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: '#ede9fe', color: '#7c3aed' }}>
                        {studio.type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                      <MapPin size={15} style={{ color: '#7c3aed', flexShrink: 0, marginTop: '2px' }} />
                      <span>{studio.address}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                      <Phone size={14} style={{ color: '#7c3aed', flexShrink: 0 }} />
                      <a href={`tel:${studio.phone.split('/')[0].trim()}`} style={{ color: 'inherit', fontWeight: '600' }}>
                        {studio.phone}
                      </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b' }}>
                      <Clock size={14} style={{ color: '#7c3aed', flexShrink: 0 }} />
                      <span>{studio.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <MessageSquare size={22} style={{ color: '#6ee7b7' }} />
                <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#ffffff' }}>
                  Instant WhatsApp VIP Desk
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#d1fae5', lineHeight: '1.6', marginBottom: '18px' }}>
                Prefer instant messaging? Share your date and venue vision directly with our lead styling coordinator on WhatsApp.
              </p>
              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#065f46',
                  padding: '11px 22px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <span>Message Now on WhatsApp</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Guaranteed Execution Badge */}
            <div className="card-white" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                  Real-Time Slot Lock Guarantee
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Dates confirmed through Eventora are backed by database lock and comprehensive indemnity insurance.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div style={{ maxWidth: '880px', margin: '0 auto 60px auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <HelpCircle size={14} />
              <span>Inquiry Knowledge Base</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '4px' }}>
              Everything you need to know about booking dates, menu tastings, and vendor choreography
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="card-white" 
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: isOpen ? '1.5px solid #c4b5fd' : '1px solid #e2e8f0'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: isOpen ? '#f5f3ff' : '#ffffff'
                    }}
                  >
                    <span style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={18} style={{ color: '#7c3aed', flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    )}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px 24px', background: '#f5f3ff', color: '#475569', fontSize: '0.9rem', lineHeight: '1.65' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM REAL-TIME BUILDER CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 100%)',
          borderRadius: '28px',
          padding: '48px 36px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid #312e81'
        }}>
          <div className="heading-tagline" style={{ background: 'rgba(255,255,255,0.1)', color: '#fbbf24', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '14px' }}>
            <Sparkles size={14} />
            <span>Ready to Reserve Right Now?</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>
            Experience Our Real-Time Date Capacity Engine
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
            Check database availability for your desired date, select your core production tier, and configure gourmet menus in 5 simple steps.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/book"
              className="btn-accent"
              style={{
                padding: '16px 36px',
                fontSize: '1rem',
                fontWeight: '800',
                borderRadius: '14px',
                background: '#7c3aed',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)'
              }}
            >
              <span>Launch Event Builder & Slots</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/packages"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 30px',
                fontSize: '1rem',
                fontWeight: '700',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <span>Compare Fixed Packages</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
