import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  Cake, 
  Gem, 
  Award, 
  Clock, 
  ChevronRight,
  Headphones,
  Check,
  Utensils,
  Camera,
  Music,
  Flame,
  Building2,
  Smile
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { setEvent, setDate, updateGuestCount } = useBooking();

  // Quick Hero Interactive Slot Checker State
  const [quickEvent, setQuickEvent] = useState('Wedding');
  const [quickDate, setQuickDate] = useState('2026-10-18');
  const [quickGuests, setQuickGuests] = useState(150);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  const handleHeroQuickCheck = (e) => {
    e.preventDefault();
    setEvent(quickEvent);
    setDate(quickDate);
    updateGuestCount(quickGuests);
    navigate('/book');
  };

  const handleSelectEvent = (eventName) => {
    setEvent(eventName);
    navigate('/book');
  };

  const featuredEvents = [
    {
      name: 'Wedding',
      category: 'Weddings',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      tagline: 'Your Royal Fairytale Wedding',
      description: 'Turnkey wedding planning, royal mandap architectures, gourmet multi-course banquets, and complete venue choreography.',
      price: '₹1,50,000',
      tag: 'Most Popular',
      features: ['Royal Mandap Setup', 'Multi-Course Dining', 'Cinematic 4K Video', 'Senior Coordinator']
    },
    {
      name: 'Birthday Party',
      category: 'Birthdays',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      tagline: 'Celebrate Milestones in Grand Style',
      description: 'Thematic balloon styling, designer tiered cakes, interactive entertainment, DJ sound system, and live street-food counters.',
      price: '₹25,000',
      tag: 'Trending',
      features: ['Theme Balloon Arch', 'Celebration Cake', 'DJ Sound & Lights', 'Interactive Host']
    },
    {
      name: 'Engagement',
      category: 'Engagements',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      tagline: 'The First Step of Forever',
      description: 'Opulent floral stage backdrops, ambient warm mood lighting, gourmet appetizer service, and candid couple portrait photography.',
      price: '₹65,000',
      tag: 'Signature',
      features: ['Floral Stage Backdrop', 'Appetizer Platter', 'Ring Ceremony Stage', 'Candid Photographer']
    },
    {
      name: 'Corporate Events',
      category: 'Corporate',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      tagline: 'Flawless Executive Summits',
      description: 'State-of-the-art AV projection, corporate stage branding, executive luncheon buffets, and seamless protocol management.',
      price: '₹85,000',
      tag: 'Executive',
      features: ['LED Video Wall', 'Executive Buffet', 'Podium & Mics', 'Delegate Registration']
    },
    {
      name: 'Anniversary',
      category: 'Anniversaries',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      tagline: 'Cherishing Decades of Love',
      description: 'Intimate candlelight dining setups, live acoustic violinists, champagne toast arrangements, and nostalgic photo galleries.',
      price: '₹35,000',
      tag: 'Romantic',
      features: ['Candlelight Ambient Decor', 'Live Violinist', 'Custom Memory Wall', 'Three-Course Dinner']
    },
    {
      name: 'Religious Events',
      category: 'Religious',
      image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      tagline: 'Sacred Rituals & Divine Grace',
      description: 'Traditional pooja and havan setups, pure sattvic organic catering, marigold ceremonial floral decor, and sacred seating.',
      price: '₹40,000',
      tag: 'Spiritual',
      features: ['Pooja Mandap Setup', 'Pure Sattvic Dining', 'Ceremonial Flowers', 'Traditional Seating']
    }
  ];

  const filteredEvents = activeCategoryFilter === 'All' 
    ? featuredEvents 
    : featuredEvents.filter(e => e.category === activeCategoryFilter);

  const steps = [
    {
      num: '01',
      title: 'Discover Your Event',
      desc: 'Browse through weddings, milestone birthdays, engagements, or corporate galas with clear pricing and complete transparency.'
    },
    {
      num: '02',
      title: 'Check Live Date Capacity',
      desc: 'Our real-time engine verifies spot availability directly with our database. When dates fill up, they close automatically.'
    },
    {
      num: '03',
      title: 'Tailor Packages & Catering',
      desc: 'Customize royal mandaps, multi-cuisine gourmet menus, live entertainment, and pre-ordered celebratory treats in seconds.'
    },
    {
      num: '04',
      title: 'Guaranteed Spot Confirmation',
      desc: 'Receive your instant printable official reservation receipt with guaranteed date allocation and assigned senior director.'
    }
  ];

  const reviews = [
    {
      name: 'Karan & Ananya Mehta',
      event: 'Royal Destination Wedding (17 Oct 2026)',
      rating: 5,
      comment: 'Eventora made our wedding planning effortless and magical! The real-time slot system gave us complete peace of mind, and the Floral Mandap was straight out of a royal Bollywood dream.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      location: 'Bangalore Palace'
    },
    {
      name: 'Vikram Singhania',
      event: 'Annual Business Conclave',
      rating: 5,
      comment: 'Outstanding catering and stage production for our 450-guest corporate summit. Every coordinator was punctual, proactive, and exceptionally refined. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      location: 'Grand Ballroom, Bangalore'
    },
    {
      name: 'Dr. Shalini Deshmukh',
      event: 'Silver Jubilee Anniversary',
      rating: 5,
      comment: 'From the candlelight ambient lighting to the acoustic live singers, our family celebrated the most heartwarming evening. The transparent, itemized invoice meant zero hidden surprises.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      location: 'The Leela Palace'
    }
  ];

  return (
    <div>
      
      {/* 1. HERO SECTION WITH SOLID LUXURY BACKGROUND PHOTO */}
      <section style={{
        position: 'relative',
        backgroundColor: '#0b0f19',
        color: '#ffffff',
        paddingTop: '80px',
        paddingBottom: '90px',
        borderBottom: '1px solid #1e293b',
        overflow: 'hidden'
      }}>
        {/* Background Image with Solid Dark Overlay (No Gradient) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', textAlign: 'center', margin: '0 auto' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '0.88rem',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <Sparkles size={16} style={{ color: '#fbbf24' }} />
            <span>Premier Luxury Event Planning & Real-Time Booking</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: '8px',
              paddingLeft: '10px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#f8fafc'
            }}>
              <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>4.9/5</span>
            </div>
          </div>

          {/* Heading - Solid Color Only, No Gradients */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: '1.14',
            color: '#ffffff',
            letterSpacing: '-1.5px',
            marginBottom: '22px'
          }}>
            Where Grand Celebrations <br />
            <span style={{ color: '#ffffff', fontStyle: 'italic', fontWeight: '800' }}>
              Become Royal Realities.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.2rem',
            color: '#94a3b8',
            lineHeight: '1.7',
            marginBottom: '36px',
            maxWidth: '720px',
            margin: '0 auto 36px auto'
          }}>
            Curate fairytale weddings, milestone birthdays, and prestigious corporate galas with live date slot reservation, Michelin-grade catering, and master floral mandaps.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '44px' }}>
            <Link to="/book" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              fontSize: '1.05rem',
              fontWeight: '600',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <span>Reserve Date & Plan</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/events" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              fontSize: '1.05rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Calendar size={18} style={{ color: '#ffffff' }} />
              <span>Browse 10 Event Categories</span>
            </Link>
          </div>

          {/* INTERACTIVE LIVE DATE CHECKER BAR (CENTERED CLEAN WIDGET) */}
          <div style={{
            maxWidth: '880px',
            margin: '0 auto 36px auto',
            background: '#ffffff',
            borderRadius: '18px',
            padding: '24px 28px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot available" />
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#047857' }}>
                  Real-Time Date Availability Engine
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#0f172a', background: '#f1f5f9', padding: '4px 12px', borderRadius: '999px' }}>
                Instant Check
              </span>
            </div>

            <form onSubmit={handleHeroQuickCheck} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Event Type</label>
                <select
                  value={quickEvent}
                  onChange={(e) => setQuickEvent(e.target.value)}
                  className="form-input"
                  style={{ padding: '10px 14px', fontSize: '0.9rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                >
                  <option value="Wedding">Royal Wedding</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Corporate Events">Corporate Event</option>
                  <option value="Anniversary">Anniversary</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Event Date</label>
                <input
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="form-input"
                  style={{ padding: '10px 14px', fontSize: '0.9rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Estimated Guests</label>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  step="25"
                  value={quickGuests}
                  onChange={(e) => setQuickGuests(Number(e.target.value))}
                  className="form-input"
                  style={{ padding: '10px 14px', fontSize: '0.9rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px 20px',
                  fontSize: '0.92rem',
                  height: '46px',
                  width: '100%',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
              >
                <span>Check & Plan</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Quick Proof Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '28px',
            paddingTop: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#e2e8f0' }}>Guaranteed Capacity Lock</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#e2e8f0' }}>30+ Verified Master Services</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.92rem', fontWeight: '600', color: '#e2e8f0' }}>Zero Hidden Surcharges</span>
            </div>
          </div>

        </div>
      </section>



      {/* 2. METRICS & TRUST TICKER BANNER */}
      <section style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '36px 0',
        borderBottom: '1px solid #1e293b'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '28px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
                1,250<span style={{ color: '#a78bfa' }}>+</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>
                Grand Celebrations Delivered
              </p>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
                100<span style={{ color: '#34d399' }}>%</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>
                Zero Double-Booking Guarantee
              </p>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
                45<span style={{ color: '#fbbf24' }}>+</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>
                Master Culinary & Mandap Artisans
              </p>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
                4.98<span style={{ color: '#fbbf24' }}>★</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>
                Client Trust & Happiness Score
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE CELEBRATION CATEGORIES */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="heading-tagline" style={{ marginBottom: '10px' }}>
                <Sparkles size={14} />
                <span>Handcrafted Celebration Collections</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                Explore Curated Event Types
              </h2>
            </div>
            
            <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontWeight: '700', fontSize: '0.95rem' }}>
              <span>View All 10 Event Categories</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* Interactive Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
            {['All', 'Weddings', 'Birthdays', 'Engagements', 'Corporate', 'Anniversaries', 'Religious'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  background: activeCategoryFilter === cat ? '#7c3aed' : '#f8fafc',
                  color: activeCategoryFilter === cat ? '#ffffff' : '#475569',
                  border: activeCategoryFilter === cat ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                  boxShadow: activeCategoryFilter === cat ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Event Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            {filteredEvents.map((evt, idx) => (
              <div 
                key={idx}
                className="card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '24px'
                }}
              >
                <div>
                  <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={evt.image} 
                      alt={evt.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      loading="lazy"
                    />
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(6px)',
                      color: '#0f172a',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {evt.tag}
                    </div>
                  </div>

                  <div style={{ padding: '24px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {evt.tagline}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 10px 0' }}>
                      {evt.name}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.55', marginBottom: '18px' }}>
                      {evt.description}
                    </p>

                    {/* Features included */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      {evt.features.map((f, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                          <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '16px 24px 24px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f8fafc'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>Starting package from</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{evt.price}</div>
                  </div>
                  <button 
                    onClick={() => handleSelectEvent(evt.name)}
                    className="btn-primary" 
                    style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                  >
                    <span>Plan Event</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE 4 PILLARS OF EVENTORA */}
      <section style={{ padding: '80px 0', background: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <div className="heading-tagline" style={{ marginBottom: '14px' }}>
                <Award size={14} />
                <span>The Eventora Standard</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '16px' }}>
                Why Host Families & Prestigious Brands Choose Us
              </h2>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
                Static inquiry websites simply forward phone numbers to unverified contractors. Eventora is an end-to-end luxury production powerhouse where dates, venues, gourmet catering, and master styling are guaranteed under one unified contract.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Real-Time Capacity Guard (No Overbooking)</h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px', lineHeight: '1.5' }}>
                      Dates dynamically close in our database when capacity is reached. Your slot reservation is permanent and insured.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Utensils size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Michelin-Grade Artisanal Culinary Brigades</h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px', lineHeight: '1.5' }}>
                      Bespoke multi-course Gujarati, Punjabi, South Indian, Pan-Asian, and Continental banquets managed by veteran executive chefs.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Dedicated 24/7 Senior Event Concierge</h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '2px', lineHeight: '1.5' }}>
                      A designated master director oversees vendor arrivals, sound tests, food tastings, and timeline execution so you can enjoy being the host.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '4px solid #ffffff'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80"
                  alt="Eventora Luxury Experience"
                  style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Floating Guarantee Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                background: '#ffffff',
                padding: '16px 22px',
                borderRadius: '18px',
                boxShadow: 'var(--shadow-xl)',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>100% On-Time Execution</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Backed by verified SLA guarantees</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS 4-STEP TIMELINE */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px auto' }}>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <Clock size={14} />
              <span>Effortless Planning</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              How Event Booking Works
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '8px' }}>
              Our transparent 4-stage workflow guarantees that your date is secured without any vendor conflicts or double bookings.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {steps.map((st, idx) => (
              <div 
                key={idx}
                className="card-white"
                style={{
                  padding: '32px 24px',
                  borderRadius: '24px',
                  border: '1.5px solid #e2e8f0',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '2.8rem',
                    fontWeight: '900',
                    color: '#ede9fe',
                    lineHeight: '1',
                    marginBottom: '16px',
                    fontFamily: 'monospace'
                  }}>
                    {st.num}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                    {st.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
                    {st.desc}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontSize: '0.82rem', fontWeight: '700' }}>
                  <span>Step {idx + 1} of 4</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CLIENT REVIEWS */}
      <section style={{ padding: '80px 0', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 48px auto' }}>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <HeartHandshake size={14} />
              <span>Real Host Experiences</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Cherished Words from Our Clients
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '6px' }}>
              Read authentic feedback from families and business leaders who celebrated with Eventora.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '26px'
          }}>
            {reviews.map((rev, idx) => (
              <div 
                key={idx} 
                className="card-white"
                style={{
                  borderRadius: '24px',
                  padding: '30px',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="#d97706" style={{ color: '#d97706' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.65', fontStyle: 'italic', marginBottom: '24px' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ede9fe' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>{rev.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: '700' }}>{rev.event}</span>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{rev.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERTING VIP CALL TO ACTION */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)',
            borderRadius: '32px',
            padding: '64px 40px',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(76, 29, 149, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ambient Background Shimmer */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fef08a', fontSize: '0.85rem', fontWeight: '700', marginBottom: '20px' }}>
              <Sparkles size={16} />
              <span>Limited Dates Available for Upcoming Celebration Season</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.9rem)', fontWeight: '800', marginBottom: '18px', letterSpacing: '-0.5px' }}>
              Ready to Craft an Unforgettable Celebration?
            </h2>
            <p style={{ fontSize: '1.08rem', color: '#c7d2fe', maxWidth: '640px', margin: '0 auto 36px auto', lineHeight: '1.65' }}>
              Check availability for your preferred date, select your tailored package tier, and lock in your reservation with full guaranteed capacity.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/book" className="btn-gold" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                <span>Start Planning Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/services" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 30px',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                borderRadius: '14px',
                fontWeight: '700',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                transition: 'all 0.2s'
              }}>
                <span>Browse All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
