import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Clock, Heart, ShieldCheck, Award, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#090d16', color: '#f8fafc', paddingTop: '72px', paddingBottom: '36px', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        
        {/* Top Trust Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          paddingBottom: '48px',
          marginBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>Guaranteed Spot Booking</h5>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Real-time database enforcement prevents double booking</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={22} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>Artisan Culinary Teams</h5>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Authentic Gujarati, Punjabi, South Indian & Continental</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Star size={22} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>4.9 / 5 Guest Satisfaction</h5>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Over 1,200+ fairytale celebrations created</p>
            </div>
          </div>
        </div>

        {/* 4-Column Navigation Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '40px',
          marginBottom: '54px'
        }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
              }}>
                <Sparkles size={20} style={{ color: '#fef08a' }} />
              </div>
              <span style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff' }}>
                EVENT<span style={{ color: '#a78bfa' }}>ORA</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '22px' }}>
              Premier luxury event management and turnkey date reservation platform. We curate dream weddings, grand corporate galas, and bespoke family milestones with royal precision.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '600' }}>
                ⭐ Top Luxury Planner 2026
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: '600' }}>
                🔒 Verified Slot Engine
              </span>
            </div>
          </div>

          {/* Popular Event Categories */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginBottom: '20px', letterSpacing: '0.2px' }}>
              Signature Celebrations
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { name: 'Royal Wedding & Reception', to: '/events' },
                { name: 'Milestone Birthday Celebrations', to: '/events' },
                { name: 'Grand Engagement Gala', to: '/events' },
                { name: 'Corporate Business Summits', to: '/events' },
                { name: 'Silver & Golden Anniversaries', to: '/events' },
                { name: 'Traditional Religious Pooja', to: '/events' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.to} style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s', display: 'inline-block' }} onMouseEnter={(e) => e.target.style.color = '#c4b5fd'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginBottom: '20px', letterSpacing: '0.2px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <li><Link to="/" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c4b5fd'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Home Showcase</Link></li>
              <li><Link to="/book" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c4b5fd'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Plan Event & Real-Time Slots</Link></li>
              <li><Link to="/services" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c4b5fd'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Services & Gourmet Catering</Link></li>
              <li><Link to="/packages" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c4b5fd'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Compare Pricing Packages</Link></li>
              <li><Link to="/my-bookings" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#c4b5fd'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Customer Bookings Portal</Link></li>
              <li><Link to="/admin/login" style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: '700' }}>Admin Console Access</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginBottom: '20px', letterSpacing: '0.2px' }}>
              Concierge & Galleria
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={18} style={{ color: '#a78bfa', marginTop: '2px', flexShrink: 0 }} />
                <span>Eventora Royal Galleria, 42 Palace Cross Road, Bangalore, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <span>+91 98765 43210 / +91 80 4455 6677</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={18} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <span>concierge@eventora.luxury</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={18} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <span>Mon - Sun: 9:00 AM - 10:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          color: '#64748b',
          fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} EVENTORA Luxury Event Management. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Crafted with <Heart size={14} style={{ color: '#ef4444' }} fill="#ef4444" /> for life’s most cherished celebrations
          </div>
        </div>
      </div>
    </footer>
  );
}
