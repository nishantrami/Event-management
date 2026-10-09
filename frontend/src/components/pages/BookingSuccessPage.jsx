import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Calendar, 
  Printer, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { useBooking } from '../../context/BookingContext';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const { clearBooking } = useBooking();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // Clear cart selections since booking is confirmed
    if (clearBooking) {
      clearBooking();
    }
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          const res = await api.getBookingById(id);
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', color: '#64748b' }}>
        <div className="pulse-dot available" style={{ width: '16px', height: '16px', marginBottom: '14px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>Loading your confirmed reservation...</h3>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Booking not found</h2>
        <p style={{ color: '#64748b', marginTop: '6px' }}>We could not locate this reservation record.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: '20px' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 0 90px 0', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        {/* Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            color: '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px -4px rgba(16, 185, 129, 0.35)',
            marginBottom: '20px',
            border: '2px solid #a7f3d0'
          }}>
            <CheckCircle2 size={46} strokeWidth={2.5} />
          </div>

          <div className="heading-tagline" style={{ background: '#ecfdf5', color: '#065f46', marginBottom: '12px' }}>
            <ShieldCheck size={15} />
            <span>Guaranteed Spot Reserved in MongoDB</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            🎉 Your Celebration is Confirmed!
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', marginTop: '6px' }}>
            Congratulations! Your event date has been locked on our calendar. Your designated master concierge will connect with you 48 hours prior.
          </p>
        </div>

        {/* Printable Official Receipt Card */}
        <div 
          className="card-white print-section"
          style={{
            padding: '40px',
            boxShadow: 'var(--shadow-xl)',
            marginBottom: '32px',
            borderRadius: '28px',
            position: 'relative'
          }}
        >
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '24px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
                  EVENT<span style={{ color: '#7c3aed' }}>ORA</span>
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '3px 10px', borderRadius: '6px', background: '#ede9fe', color: '#6d28d9', letterSpacing: '0.5px' }}>
                  OFFICIAL RECEIPT
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                Luxury Event Planning, Catering & Turnkey Management
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Booking Reference</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#7c3aed', letterSpacing: '0.5px' }}>
                {booking.bookingId}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '4px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: '#ecfdf5',
                color: '#047857',
                fontSize: '0.78rem',
                fontWeight: '800',
                border: '1px solid #a7f3d0'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>CONFIRMED & LOCKED</span>
              </div>
            </div>
          </div>

          {/* Customer & Event Details Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '20px',
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Details</span>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                {booking.customer?.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>{booking.customer?.phone}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>{booking.customer?.email}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event & Date</span>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#7c3aed', marginTop: '4px' }}>
                {booking.eventType}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <Calendar size={15} style={{ color: '#7c3aed' }} />
                <span>{booking.eventDate}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Planned Guests: {booking.guestCount}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Production Tier</span>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                {booking.package?.name} Package
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>Base Price: ₹{booking.package?.price?.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>
                ✓ Guaranteed Date Capacity
              </div>
            </div>
          </div>

          {/* Itemized Services Breakdown */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '10px' }}>
              Itemized Reservation Breakdown
            </h4>

            {/* Core Package */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #e2e8f0', fontSize: '0.92rem' }}>
              <span style={{ fontWeight: '700', color: '#1e293b' }}>{booking.package?.name} Core Event Production Tier</span>
              <span style={{ fontWeight: '800', color: '#0f172a' }}>₹{booking.package?.price?.toLocaleString('en-IN')}</span>
            </div>

            {/* Services */}
            {booking.services?.map((svc, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #e2e8f0', fontSize: '0.9rem', color: '#475569' }}>
                <span>
                  • {svc.name} {svc.pricingUnit === 'per_guest' ? `(${booking.guestCount} guests @ ₹${svc.price})` : ''}
                </span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{svc.total?.toLocaleString('en-IN')}</span>
              </div>
            ))}

            {/* Pre-Orders */}
            {booking.preOrders?.map((pre, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #e2e8f0', fontSize: '0.9rem', color: '#475569' }}>
                <span>• {pre.name} (Qty: {pre.quantity})</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{pre.total?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Financial Summary */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '18px',
            padding: '22px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '24px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
              <span>Subtotal Amount</span>
              <span style={{ fontWeight: '600' }}>₹{booking.subtotal?.toLocaleString('en-IN')}</span>
            </div>

            {booking.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#059669', fontWeight: '700' }}>
                <span>Seasonal Courtesy Discount (5%)</span>
                <span>-₹{booking.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
              <span>GST & Service Taxes (5%)</span>
              <span style={{ fontWeight: '600' }}>₹{booking.taxes?.toLocaleString('en-IN')}</span>
            </div>

            <div style={{
              borderTop: '2px solid #e2e8f0',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Total Amount Paid:</span>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Inclusive of all taxes & insurance</div>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: '900', color: '#7c3aed' }}>
                ₹{booking.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Venue & Notes */}
          {booking.customer?.address && (
            <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '14px', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#0f172a' }}>Venue Address:</strong> {booking.customer.address}
            </div>
          )}

          {booking.specialRequests && (
            <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: '8px', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <strong style={{ color: '#0f172a' }}>Special Directives:</strong> {booking.specialRequests}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={handlePrint}
            className="btn-secondary"
            style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
          >
            <Printer size={18} />
            <span>Print / Save PDF Receipt</span>
          </button>

          <Link 
            to="/my-bookings" 
            className="btn-primary"
            style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
          >
            <span>Track in My Bookings</span>
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: 1px solid #000000 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
