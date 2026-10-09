import React from 'react';
import {
  Calendar,
  Users,
  PackageCheck,
  Layers,
  Gift,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function BookingSummaryCard({ onProceed, isSubmitting = false }) {
  const {
    selectedEvent,
    selectedDate,
    slotData,
    selectedPackage,
    selectedServices,
    selectedPreOrders,
    guestCount,
    calculations
  } = useBooking();

  const isFullyBooked = slotData && !slotData.isAvailable;
  const canProceed = !isFullyBooked && selectedPackage;

  return (
    <div className="card-white" style={{
      padding: '26px',
      borderRadius: '24px',
      border: '1.5px solid #e2e8f0',
      position: 'sticky',
      top: '96px',
      boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.08)',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
            Event Booking Summary
          </h3>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '6px',
            background: '#ede9fe',
            color: '#6d28d9'
          }}>
            Real-time Cart
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
          Itemized transparent breakdown
        </p>
      </div>

      {/* Event & Date Header */}
      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>Event:</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#7c3aed' }}>{selectedEvent}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
            <Calendar size={14} style={{ color: '#7c3aed' }} />
            <span>{selectedDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#334155' }}>
            <Users size={14} style={{ color: '#7c3aed' }} />
            <span>{guestCount} Guests</span>
          </div>
        </div>
      </div>

      {/* Selected Items Breakdown */}
      <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '18px', paddingRight: '4px' }}>

        {/* Core Package - Customer selection required */}
        {selectedPackage ? (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            background: '#f5f3ff',
            padding: '10px 12px',
            borderRadius: '12px',
            border: '1.5px solid #ddd6fe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PackageCheck size={16} style={{ color: '#7c3aed' }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#6d28d9' }}>
                  {selectedPackage.name} Package
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7c3aed' }}>
                  Core Production Tier
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>
              ₹{selectedPackage.price.toLocaleString('en-IN')}
            </span>
          </div>
        ) : (
          <div style={{
            marginBottom: '12px',
            background: '#fffbeb',
            border: '1.5px dashed #fde68a',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '0.8rem',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>Select a package in Step 3 to add to cart</span>
          </div>
        )}

        {/* Selected Services */}
        {selectedServices.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              Add-on Services ({selectedServices.length})
            </div>
            {selectedServices.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>
                <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  • {s.name} {s.pricingUnit === 'per_guest' ? `(${guestCount}x)` : ''}
                </span>
                <span style={{ fontWeight: '600' }}>₹{s.total.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pre-Orders */}
        {selectedPreOrders.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              Pre-Orders ({selectedPreOrders.length})
            </div>
            {selectedPreOrders.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>
                <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  • {p.name} ({p.quantity}x)
                </span>
                <span style={{ fontWeight: '600' }}>₹{p.total.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Calculations */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
          <span>Subtotal</span>
          <span>₹{calculations.subtotal.toLocaleString('en-IN')}</span>
        </div>

        {calculations.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#059669', fontWeight: '600' }}>
            <span>Special Seasonal Discount (5%)</span>
            <span>-₹{calculations.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
          <span>GST & Event Service Taxes (5%)</span>
          <span>₹{calculations.taxes.toLocaleString('en-IN')}</span>
        </div>

        <div style={{
          borderTop: '1.5px dashed #cbd5e1',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>Grand Total</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Inclusive of all taxes</div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#7c3aed' }}>
            ₹{calculations.grandTotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Warnings if fully booked */}
      {isFullyBooked && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '16px',
          fontSize: '0.8rem',
          color: '#991b1b',
          fontWeight: '600'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>This date is fully booked. Please choose another date to enable booking.</span>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={onProceed}
        disabled={!canProceed || isSubmitting}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span>
          {isSubmitting
            ? 'Processing Confirmation...'
            : !selectedPackage
              ? 'Select Package in Step 3 to Proceed'
              : 'Continue to Confirmation'}
        </span>
        {!isSubmitting && <ArrowRight size={18} />}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
        <ShieldCheck size={14} style={{ color: '#10b981' }} />
        <span>Strict capacity control • 100% Guaranteed Booking</span>
      </div>

    </div>
  );
}
