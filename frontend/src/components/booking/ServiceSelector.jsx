import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  Users 
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { api } from '../../services/api';

const CATEGORIES = [
  'All',
  'Food & Catering',
  'Mandap & Stage',
  'Flower Decoration',
  'Photography',
  'Music & Entertainment',
  'Lighting',
  'Furniture & Seating',
  'Makeup & Beauty'
];

export default function ServiceSelector() {
  const { 
    selectedServices, 
    toggleService, 
    isServiceSelected, 
    guestCount, 
    updateGuestCount 
  } = useBooking();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.getServices(activeCategory, searchTerm);
        if (res.success && res.services) {
          setServices(res.services);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [activeCategory, searchTerm]);

  return (
    <div className="card-white" style={{ padding: '28px', marginBottom: '28px', borderRadius: '24px' }}>
      
      {/* Step Header & Guest Count Adjuster */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '22px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: '800'
            }}>4</span>
            <span>Customize Services & Gourmet Catering</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            Add individual specialized services. Food menus dynamically multiply with your planned guest count.
          </p>
        </div>

        {/* Guest Count Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: '800',
            color: selectedServices.length > 0 ? '#047857' : '#64748b',
            background: selectedServices.length > 0 ? '#ecfdf5' : '#f1f5f9',
            padding: '6px 14px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: selectedServices.length > 0 ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
          }}>
            <Sparkles size={13} />
            <span>{selectedServices.length > 0 ? `${selectedServices.length} Services Added ✓` : 'Optional Add-ons'}</span>
          </span>

          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} style={{ color: '#7c3aed' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                Guests:
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => updateGuestCount(Math.max(10, guestCount - 25))}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => updateGuestCount(Number(e.target.value))}
                style={{
                  width: '56px',
                  textAlign: 'center',
                  fontWeight: '900',
                  fontSize: '0.9rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '3px'
                }}
                min="10"
                step="10"
              />
              <button
                onClick={() => updateGuestCount(guestCount + 25)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 14px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: '700',
                background: activeCategory === cat ? '#7c3aed' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : '#64748b',
                border: activeCategory === cat ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(124, 58, 237, 0.2)' : 'none',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{
              padding: '8px 12px 8px 34px',
              fontSize: '0.85rem',
              background: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <div className="pulse-dot available" style={{ width: '12px', height: '12px', marginBottom: '10px' }} />
          <p>Loading catalog items...</p>
        </div>
      ) : services.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontWeight: '600' }}>No services found in this category.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '22px',
          alignItems: 'stretch'
        }}>
          {services.map((service) => {
            const isSelected = isServiceSelected(service._id);
            const isPerGuest = service.pricingUnit === 'per_guest';
            const calculatedTotal = isPerGuest ? service.price * guestCount : service.price;

            return (
              <div
                key={service._id}
                style={{
                  background: isSelected ? '#ffffff' : '#f8fafc',
                  borderRadius: '18px',
                  border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 10px 24px -4px rgba(16, 185, 129, 0.2)' : 'var(--shadow-xs)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={service.image}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '999px'
                  }}>
                    {service.category}
                  </div>

                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#10b981',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '3px 9px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                    }}>
                      <Check size={12} strokeWidth={3} />
                      <span>Added</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                      {service.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.45', marginBottom: '12px', minHeight: '34px' }}>
                      {service.description}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    {/* Price display */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {isPerGuest ? ' / guest' : ' / event'}
                        </span>
                      </div>

                      {isPerGuest && (
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', background: '#ede9fe', padding: '2px 8px', borderRadius: '6px' }}>
                          Total: ₹{calculatedTotal.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleService(service)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '0.86rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        color: isSelected ? '#047857' : '#7c3aed',
                        border: isSelected ? '1.5px solid #a7f3d0' : '1.5px solid #7c3aed',
                        boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check size={15} strokeWidth={2.5} />
                          <span>Added to Plan (Click to Remove)</span>
                        </>
                      ) : (
                        <>
                          <Plus size={15} />
                          <span>Add to Booking Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
