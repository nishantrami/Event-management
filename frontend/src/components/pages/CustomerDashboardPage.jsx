import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Sparkles, 
  Mail, 
  Phone, 
  Eye, 
  Printer, 
  X,
  Headphones
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function CustomerDashboardPage() {
  const { customer, updateCustomerProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  // Profile edit state
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  // Notifications feed
  const [notifications] = useState([
    { id: 1, title: 'Slot Confirmed & Verified', message: 'Your event date is locked in our capacity engine.', time: 'Just now', type: 'success' },
    { id: 2, title: 'Senior Director Assigned', message: 'Your event director will connect 48 hours prior.', time: 'Today', type: 'info' },
    { id: 3, title: 'Culinary Tasting Notice', message: 'Private tasting appointment available on request.', time: 'Yesterday', type: 'info' }
  ]);

  const fetchBookings = async () => {
    try {
      const res = await api.getMyBookings();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load my bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomerProfile(profileForm);
      setProfileMsg('Profile details updated successfully!');
      setEditProfileMode(false);
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  // Find upcoming event
  const upcomingEvent = bookings.find(b => b.status === 'Confirmed' || b.status === 'Pending');

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '90px', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Welcome Top Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)',
          borderRadius: '28px',
          padding: '36px',
          border: '1.5px solid #e2e8f0',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div className="heading-tagline" style={{ marginBottom: '10px' }}>
              <Sparkles size={14} />
              <span>VIP Client Portal</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              Welcome, {customer?.name || 'Valued Client'}
            </h1>
            <p style={{ fontSize: '0.98rem', color: '#64748b', marginTop: '4px', maxWidth: '600px' }}>
              Track your upcoming reservations, download official event receipts, review menu selections, and contact your dedicated concierge.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/book" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
              <Sparkles size={16} />
              <span>Plan Another Celebration</span>
            </Link>
          </div>
        </div>

        {/* 3-Column Highlights Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          
          {/* Upcoming Event Card */}
          <div className="card-white" style={{ padding: '26px', borderLeft: '4px solid #7c3aed', borderRadius: '22px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7c3aed' }}>
              Next Upcoming Celebration
            </span>
            {upcomingEvent ? (
              <div style={{ marginTop: '14px' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  {upcomingEvent.eventType}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#475569', marginTop: '6px' }}>
                  <Calendar size={16} style={{ color: '#7c3aed' }} />
                  <span style={{ fontWeight: '700' }}>{upcomingEvent.eventDate}</span>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`status-pill ${upcomingEvent.status}`}>
                    {upcomingEvent.status}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
                    ₹{upcomingEvent.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedBookingModal(upcomingEvent)}
                  style={{
                    marginTop: '14px',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    textAlign: 'center'
                  }}
                >
                  View Reservation Details →
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '16px', color: '#64748b', fontSize: '0.9rem' }}>
                No active upcoming events scheduled yet.
                <div style={{ marginTop: '12px' }}>
                  <Link to="/book" style={{ color: '#7c3aed', fontWeight: '700' }}>Reserve an event date →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="card-white" style={{ padding: '26px', borderRadius: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b' }}>
                Client Profile
              </span>
              <button
                onClick={() => setEditProfileMode(!editProfileMode)}
                style={{ fontSize: '0.82rem', fontWeight: '700', color: '#7c3aed' }}
              >
                {editProfileMode ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            {profileMsg && (
              <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: '700', marginBottom: '10px' }}>
                {profileMsg}
              </div>
            )}

            {editProfileMode ? (
              <form onSubmit={handleProfileSubmit}>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                    placeholder="Full Name"
                    style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="form-input"
                    placeholder="Phone"
                    style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Save Profile
                </button>
              </form>
            ) : (
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>{customer?.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#475569', marginTop: '8px' }}>
                  <Mail size={15} style={{ color: '#7c3aed' }} />
                  <span>{customer?.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#475569', marginTop: '6px' }}>
                  <Phone size={15} style={{ color: '#7c3aed' }} />
                  <span>{customer?.phone || 'No phone provided'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Concierge & Updates Card */}
          <div className="card-white" style={{ padding: '26px', borderRadius: '22px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Headphones size={15} style={{ color: '#d97706' }} />
              <span>Dedicated Concierge Line</span>
            </span>
            <div style={{ marginTop: '12px', fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
              Have custom dietary preferences or want to add a floral drone entry? Your dedicated director is on standby.
            </div>
            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} style={{ color: '#7c3aed' }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>+91 98765 43210</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Mon-Sun 9AM - 10PM IST</div>
              </div>
            </div>
          </div>
        </div>

        {/* MY BOOKINGS TABLE */}
        <div className="card-white" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a' }}>
                My Reservation History
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                All confirmed events registered in our database
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed', background: '#ede9fe', padding: '6px 16px', borderRadius: '999px' }}>
              {bookings.length} Registered Reservation{bookings.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
              <div className="pulse-dot available" style={{ width: '12px', height: '12px', marginBottom: '12px' }} />
              <p>Loading your reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px' }}>
              <Calendar size={44} style={{ color: '#94a3b8', margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>No bookings scheduled yet</h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '6px', maxWidth: '440px', margin: '6px auto 20px auto' }}>
                You have not booked any events yet. Check available dates and lock in your first luxury experience.
              </p>
              <Link to="/book" className="btn-primary" style={{ padding: '12px 26px' }}>
                Browse Events & Book Slot
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '14px 18px' }}>Booking ID</th>
                    <th style={{ padding: '14px 18px' }}>Event & Date</th>
                    <th style={{ padding: '14px 18px' }}>Package Tier</th>
                    <th style={{ padding: '14px 18px' }}>Guests</th>
                    <th style={{ padding: '14px 18px' }}>Total Amount</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Receipt & Details</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                      <td style={{ padding: '18px', fontWeight: '800', color: '#7c3aed' }}>
                        {b.bookingId}
                      </td>
                      <td style={{ padding: '18px' }}>
                        <div style={{ fontWeight: '800', color: '#0f172a' }}>{b.eventType}</div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Calendar size={13} style={{ color: '#7c3aed' }} />
                          <span>{b.eventDate}</span>
                        </div>
                      </td>
                      <td style={{ padding: '18px', color: '#334155', fontWeight: '700' }}>
                        {b.package?.name}
                      </td>
                      <td style={{ padding: '18px', color: '#64748b', fontWeight: '600' }}>
                        {b.guestCount}
                      </td>
                      <td style={{ padding: '18px', fontWeight: '900', color: '#0f172a' }}>
                        ₹{b.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '18px' }}>
                        <span className={`status-pill ${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '18px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedBookingModal(b)}
                          className="btn-secondary"
                          style={{
                            padding: '7px 14px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <Eye size={14} />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* DETAILED BOOKING MODAL */}
      {selectedBookingModal && (
        <div className="modal-overlay" onClick={() => setSelectedBookingModal(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '36px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '18px', marginBottom: '22px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Official Reservation Voucher
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedBookingModal.eventType} - {selectedBookingModal.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingModal(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Event Date</span>
                <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedBookingModal.eventDate}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Status</span>
                <div>
                  <span className={`status-pill ${selectedBookingModal.status}`}>
                    {selectedBookingModal.status}
                  </span>
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Package</span>
                <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedBookingModal.package?.name}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Total Paid</span>
                <div style={{ fontWeight: '900', color: '#7c3aed', fontSize: '1.15rem' }}>
                  ₹{selectedBookingModal.totalAmount?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Inclusions */}
            {selectedBookingModal.services?.length > 0 && (
              <div style={{ marginBottom: '18px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
                  Included Services & Menus
                </div>
                {selectedBookingModal.services.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '4px' }}>
                    <span>• {s.name}</span>
                    <span style={{ fontWeight: '700' }}>₹{s.total?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Address */}
            {selectedBookingModal.customer?.address && (
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', color: '#475569', marginBottom: '20px' }}>
                <strong>Venue:</strong> {selectedBookingModal.customer.address}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
