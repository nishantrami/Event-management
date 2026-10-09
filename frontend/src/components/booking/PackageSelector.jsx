import React, { useState, useEffect } from 'react';
import { Check, Star, Crown, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { api } from '../../services/api';

export default function PackageSelector() {
  const { selectedPackage, selectPackage } = useBooking();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.getPackages();
        if (res.success && res.packages) {
          setPackages(res.packages);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="card-white" style={{ padding: '40px', textAlign: 'center', color: '#64748b', borderRadius: '24px', marginBottom: '28px' }}>
        <div className="pulse-dot available" style={{ width: '12px', height: '12px', marginBottom: '10px' }} />
        <p>Loading curated packages...</p>
      </div>
    );
  }

  return (
    <div className="card-white" style={{ padding: '28px', marginBottom: '28px', borderRadius: '24px' }}>

      {/* Step Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
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
            }}>3</span>
            <span>Select Core Production Package</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            Choose a starting tier foundation. You can customize catering, mandap decor, and photographers in the next step.
          </p>
        </div>

        <span style={{
          fontSize: '0.78rem',
          fontWeight: '800',
          color: selectedPackage ? '#7c3aed' : '#b45309',
          background: selectedPackage ? '#ede9fe' : '#fef3c7',
          padding: '5px 14px',
          borderRadius: '999px',
          border: selectedPackage ? '1px solid #ddd6fe' : '1px solid #fde68a'
        }}>
          {selectedPackage ? `${selectedPackage.name} Tier Selected ✓` : '⚠️ Please Select a Tier'}
        </span>
      </div>

      {/* 3 Package Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {packages.map((pkg) => {
          const isSelected = selectedPackage?._id === pkg._id || selectedPackage?.name === pkg.name;
          const isStandard = pkg.name === 'Standard';
          const isPremium = pkg.name === 'Premium';

          return (
            <div
              key={pkg._id || pkg.name}
              style={{
                position: 'relative',
                background: isSelected ? '#ffffff' : '#f8fafc',
                borderRadius: '22px',
                border: isSelected
                  ? '2.5px solid #7c3aed'
                  : isStandard
                    ? '1.5px solid #cbd5e1'
                    : '1.5px solid #e2e8f0',
                boxShadow: isSelected
                  ? '0 12px 30px -4px rgba(124, 58, 237, 0.25)'
                  : 'var(--shadow-xs)',
                padding: '30px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Badge */}
              {(pkg.badge || isStandard || isPremium) && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: isPremium
                    ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                    : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isPremium ? <Crown size={13} /> : <Star size={13} />}
                  <span>{pkg.badge || (isPremium ? 'Royal Platinum' : 'Most Popular')}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                    {pkg.name} Tier
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px', minHeight: '38px', lineHeight: '1.45' }}>
                    {pkg.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#64748b' }}>₹</span>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
                    {pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ base production</span>
                </div>

                {/* Features list */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '22px', flexGrow: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
                    Key Inclusions
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pkg.features?.map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: isSelected ? '#ede9fe' : '#f1f5f9',
                          color: isSelected ? '#7c3aed' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button Aligned at Bottom */}
              <button
                onClick={() => selectPackage(isSelected ? null : pkg)}
                className={isSelected ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '13px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  borderRadius: '14px',
                  marginTop: 'auto',
                  background: isSelected ? '#10b981' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#7c3aed',
                  borderColor: isSelected ? '#10b981' : '#c4b5fd',
                  boxShadow: isSelected ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isSelected ? '✓ Selected Tier (Click to Remove)' : `Select ${pkg.name} Tier`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
