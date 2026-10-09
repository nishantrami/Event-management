import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Calendar, 
  Users, 
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getAllBookings({
        status: statusFilter !== 'All' ? statusFilter : '',
        eventType: eventTypeFilter !== 'All' ? eventTypeFilter : '',
        search: searchTerm
      });
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, eventTypeFilter, searchTerm]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setActionMsg(`Booking status updated to ${newStatus}. Capacity recalculated.`);
        fetchBookings();
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking(res.booking);
        }
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking? Slot capacity will be updated.')) {
      return;
    }
    try {
      const res = await api.deleteBooking(bookingId);
      if (res.success) {
        setActionMsg('Booking removed successfully');
        fetchBookings();
        setSelectedBooking(null);
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  return (
    <div>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
            Bookings Management
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Inspect, approve, complete, or cancel customer reservations
          </p>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7c3aed', background: '#ede9fe', padding: '6px 14px', borderRadius: '999px' }}>
          {bookings.length} Filtered Bookings
        </span>
      </div>

      {actionMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: '600', marginBottom: '20px' }}>
          <CheckCircle size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="card-white" style={{ padding: '18px 24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search ID, customer name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Event:</span>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="All">All Events</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Engagement">Engagement</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Corporate Events">Corporate Events</option>
            <option value="Religious Events">Religious Events</option>
          </select>
        </div>

      </div>

      {/* Bookings Table */}
      <div className="card-white" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No bookings found matching criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '14px 18px' }}>Booking ID</th>
                  <th style={{ padding: '14px 18px' }}>Customer Details</th>
                  <th style={{ padding: '14px 18px' }}>Event & Date</th>
                  <th style={{ padding: '14px 18px' }}>Package & Guests</th>
                  <th style={{ padding: '14px 18px' }}>Amount</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 18px', fontWeight: '800', color: '#7c3aed' }}>
                      {b.bookingId}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{b.customer?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.customer?.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{b.customer?.email}</div>
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{b.eventType}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={13} style={{ color: '#7c3aed' }} />
                        <span>{b.eventDate}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{b.package?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.guestCount} Guests</div>
                    </td>
                    <td style={{ padding: '16px 18px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span className={`status-pill ${b.status}`}>{b.status}</span>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={14} />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL & ACTION MODAL */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase' }}>
                  Admin Booking Inspector
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedBooking.eventType} ({selectedBooking.bookingId})
                </h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 18px', borderRadius: '12px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Current Status:</span>
                <div style={{ marginTop: '2px' }}>
                  <span className={`status-pill ${selectedBooking.status}`}>{selectedBooking.status}</span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {selectedBooking.status !== 'Confirmed' && (
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'Confirmed')}
                    style={{ padding: '6px 10px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.78rem', fontWeight: '700' }}
                  >
                    Confirm / Approve
                  </button>
                )}
                {selectedBooking.status !== 'Completed' && (
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'Completed')}
                    style={{ padding: '6px 10px', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '0.78rem', fontWeight: '700' }}
                  >
                    Complete
                  </button>
                )}
                {selectedBooking.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleStatusChange(selectedBooking._id, 'Cancelled')}
                    style={{ padding: '6px 10px', borderRadius: '6px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '0.78rem', fontWeight: '700' }}
                  >
                    Cancel Booking (Free Slot)
                  </button>
                )}
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>Customer Information</div>
              <div style={{ color: '#475569' }}>Name: {selectedBooking.customer?.name}</div>
              <div style={{ color: '#475569' }}>Email: {selectedBooking.customer?.email}</div>
              <div style={{ color: '#475569' }}>Phone: {selectedBooking.customer?.phone}</div>
              {selectedBooking.customer?.address && (
                <div style={{ color: '#475569' }}>Venue: {selectedBooking.customer?.address}</div>
              )}
            </div>

            {/* Services breakdown */}
            <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Services & Items</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Package: {selectedBooking.package?.name}</span>
                <span style={{ fontWeight: '700' }}>₹{selectedBooking.package?.price?.toLocaleString('en-IN')}</span>
              </div>
              {selectedBooking.services?.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>• {s.name} ({s.quantity}x)</span>
                  <span>₹{s.total?.toLocaleString('en-IN')}</span>
                </div>
              ))}
              {selectedBooking.preOrders?.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>• {p.name} (Qty: {p.quantity})</span>
                  <span>₹{p.total?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Financial Total */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: '800', color: '#0f172a' }}>Total Amount:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#7c3aed' }}>
                ₹{selectedBooking.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => handleDelete(selectedBooking._id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}
              >
                <Trash2 size={16} />
                <span>Delete Booking Record</span>
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
