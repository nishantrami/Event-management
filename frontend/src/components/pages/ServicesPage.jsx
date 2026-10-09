import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Utensils, Gift, ShieldCheck, Award, Star } from 'lucide-react';
import ServiceSelector from '../booking/ServiceSelector';
import PreOrderSelector from '../booking/PreOrderSelector';

export default function ServicesPage() {
  return (
    <div style={{ paddingTop: '40px', paddingBottom: '90px', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '36px'
        }}>
          <div>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <Sparkles size={14} />
              <span>Artisanal Services Marketplace</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Event Services & Gourmet Catering
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '6px', maxWidth: '640px' }}>
              Discover handcrafted mandap architectures, exotic floral arrangements, live interactive catering stations, and artisanal celebration hampers.
            </p>
          </div>

          <Link to="/book" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            <span>Go to Event Planner & Slots</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Value Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div className="card-white" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '18px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Utensils size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>Dynamic Guest Scaling</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Food automatically calculates per planned guest</div>
            </div>
          </div>

          <div className="card-white" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '18px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>30+ Verified Master Vendors</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Zero random contractors; 100% insured execution</div>
            </div>
          </div>

          <div className="card-white" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '18px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>Transparent Itemized Pricing</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Zero hidden vendor markups or commissions</div>
            </div>
          </div>
        </div>

        {/* Embedded Services Marketplace */}
        <div className="card-white" style={{ padding: '36px', marginBottom: '36px', borderRadius: '28px' }}>
          <ServiceSelector />
        </div>

        {/* Pre-Orders Section */}
        <div className="card-white" style={{ padding: '36px', marginBottom: '36px', borderRadius: '28px' }}>
          <PreOrderSelector />
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/book" className="btn-gold" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
            <span>Lock In Date & Check Availability</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
