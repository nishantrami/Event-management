import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, X, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import PackageSelector from '../booking/PackageSelector';

export default function PackagesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Can I add extra customized services or food items to my selected package?',
      a: 'Yes, absolutely! The package serves as your core production foundation. In the booking flow, you can add specialized multi-cuisine catering menus (which automatically multiply with your planned guest count), pre-ordered celebration cakes, drone photography, and live entertainment.'
    },
    {
      q: 'How does the guaranteed date slot capacity system work?',
      a: 'Unlike static inquiry directories, Eventora operates an active database capacity engine. Once our maximum simultaneous event capacity is reserved for a specific calendar date (typically 3 concurrent celebrations), the date automatically closes in our database to ensure zero overbooking and 100% dedicated vendor focus.'
    },
    {
      q: 'What if our expected guest count increases closer to the event date?',
      a: 'You can easily adjust your guest count directly through your customer dashboard or by contacting your assigned senior event concierge up to 5 business days before your scheduled celebration.'
    },
    {
      q: 'Is there a private tasting session included for gourmet catering?',
      a: 'Yes! For all Royal Gold and Imperial Platinum bookings, we arrange a private culinary tasting session for up to 4 family members with our executive chef to finalize menu spice levels, presentation, and custom dishes.'
    }
  ];

  const comparisonRows = [
    { feature: 'Starting Base Price', basic: '₹25,000', standard: '₹60,000', premium: '₹1,50,000' },
    { feature: 'Recommended Event Scale', basic: 'Intimate (25-75 guests)', standard: 'Grand (75-250 guests)', premium: 'Imperial (250-1000+ guests)' },
    { feature: 'Stage & Mandap Architecture', basic: 'Standard Themed Backdrop', standard: 'Custom Floral Stage Arch', premium: 'Royal Bespoke Mandap & Canopy' },
    { feature: 'Gourmet Catering Inclusions', basic: 'Basic Buffet Setup Available', standard: 'Multi-Cuisine 4-Course Menu', premium: 'Michelin-Grade 7-Course Royal Feast' },
    { feature: 'Photography & Cinema', basic: 'Candid Still Photos', standard: 'Full Day Photography + Teaser', premium: 'Cinematic 4K Video + Drone + Photo Album' },
    { feature: 'Sound & Lighting Production', basic: 'Basic Ambient Sound', standard: 'Professional DJ & Mood Uplights', premium: 'Concert-Grade Sound, Moving Heads & Smoke' },
    { feature: 'Dedicated Event Concierge', basic: 'On-Call Coordinator', standard: 'Senior On-Ground Director', premium: 'Master Event Director + 4 Coordinators' },
    { feature: 'Date Reschedule Flexibility', basic: 'Up to 14 days prior', standard: 'Up to 7 days prior', premium: 'Complimentary VIP Reschedule Pass' }
  ];

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '90px', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
          <div className="heading-tagline" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} />
            <span>Turnkey Celebration Tiers</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Compare Event Packages
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '8px' }}>
            Transparent fixed-rate pricing designed for every scale. You can always add custom food, decor, and photographers.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="card-white" style={{ padding: '36px', marginBottom: '50px', borderRadius: '28px' }}>
          <PackageSelector />
        </div>

        {/* Detailed Side-by-Side Comparison Matrix */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
              Full Feature Comparison Matrix
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
              Review inclusions across Silver, Gold, and Platinum tiers
            </p>
          </div>

          <div className="card-white" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '18px 24px', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', width: '35%' }}>Feature</th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: '800', color: '#475569', width: '20%' }}>Basic Tier</th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: '800', color: '#7c3aed', width: '22%' }}>Standard (Popular)</th>
                    <th style={{ padding: '18px 20px', fontSize: '0.95rem', fontWeight: '800', color: '#d97706', width: '23%' }}>Premium (Royal)</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
                        {row.feature}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.88rem', color: '#475569' }}>
                        {row.basic}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: '700', color: '#7c3aed' }}>
                        {row.standard}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '0.88rem', fontWeight: '700', color: '#b45309' }}>
                        {row.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <HelpCircle size={14} />
              <span>Common Questions</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="card-white"
                  style={{ borderRadius: '18px', overflow: 'hidden' }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      color: '#0f172a'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: '#7c3aed' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px 24px', fontSize: '0.88rem', color: '#475569', lineHeight: '1.65', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA to Booking Flow */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/book" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
            <span>Proceed to Date & Slot Booking</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
