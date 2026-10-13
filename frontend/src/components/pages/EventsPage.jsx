import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  HeartHandshake, 
  Cake, 
  Gem, 
  Flame, 
  Building2, 
  Baby, 
  GraduationCap, 
  PartyPopper, 
  Star,
  Check,
  Calendar,
  ShieldCheck,
  X
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { api } from '../../services/api';

const EVENT_PILLS = [
  'All',
  'Wedding',
  'Birthday Party',
  'Engagement',
  'Corporate Events',
  'Anniversary',
  'Religious Events',
  'Baby Shower',
  'Reception'
];

export default function EventsPage() {
  const navigate = useNavigate();
  const { setEvent } = useBooking();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPill, setSelectedPill] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getEvents(searchTerm);
        if (res.success && res.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchTerm]);

  const handleSelectEvent = (name) => {
    setEvent(name);
    navigate('/book');
  };

  const filteredEvents = selectedPill === 'All' 
    ? events 
    : events.filter(e => e.name.toLowerCase().includes(selectedPill.toLowerCase()));

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '90px', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <Sparkles size={14} />
              <span>Turnkey Event Collections</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Explore Event Categories
            </h1>
            <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '6px', maxWidth: '640px' }}>
              Select a celebration category to check real-time date availability, compare package inclusions, and customize gourmet catering and floral decor.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search wedding, birthday, gala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '44px', paddingRight: searchTerm ? '38px' : '16px', background: '#ffffff', boxShadow: 'var(--shadow-xs)' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  padding: '4px'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
          {EVENT_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => setSelectedPill(pill)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: '700',
                background: selectedPill === pill ? '#7c3aed' : '#ffffff',
                color: selectedPill === pill ? '#ffffff' : '#475569',
                border: selectedPill === pill ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                boxShadow: selectedPill === pill ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'var(--shadow-xs)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Grid or Empty/Loading State */}
        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
            <div className="pulse-dot available" style={{ width: '14px', height: '14px', marginBottom: '12px' }} />
            <p style={{ fontWeight: '600' }}>Loading luxury event collections...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="card-white" style={{ padding: '60px', textAlign: 'center', maxWidth: '540px', margin: '40px auto' }}>
            <p style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>
              No categories found
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
              We could not find any event collections matching "{searchTerm || selectedPill}".
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedPill('All'); }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '24px'
          }}>
            {filteredEvents.map((evt) => (
              <div
                key={evt._id}
                className="card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '24px'
                }}
              >
                <div>
                  <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={evt.image}
                      alt={evt.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    
                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px' }}>
                      {evt.popular && (
                        <div style={{
                          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Star size={12} fill="#ffffff" />
                          <span>Popular</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '24px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {evt.tagline}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px 0' }}>
                      {evt.name}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.55', minHeight: '44px' }}>
                      {evt.description}
                    </p>

                    {/* Features list */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                        <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>Real-Time Date Slots</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                        <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>Curated Banquets</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                        <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>Theme Blueprints</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                        <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>Concierge Assigned</span>
                      </div>
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
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>Starting from</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                      ₹{evt.startingPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectEvent(evt.name)}
                    className="btn-primary"
                    style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                  >
                    <span>Plan Event</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Bespoke Custom Event Planning Box */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: '24px',
          padding: '36px 40px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '6px' }}>
              Planning an Exclusive Bespoke Celebration?
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#c7d2fe', maxWidth: '580px' }}>
              From palace takeovers to multi-day destination ceremonies, our master directors design custom 3D blueprints and curated tasting menus in 24 hours.
            </p>
          </div>
          <Link to="/book" className="btn-gold" style={{ padding: '12px 26px', fontSize: '0.95rem' }}>
            <span>Schedule VIP Consultation</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
