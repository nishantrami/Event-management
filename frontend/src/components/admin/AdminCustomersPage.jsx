import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle, 
  X,
  IndianRupee,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Deletion states
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCustomers(searchTerm);
      if (res.success && res.customers) {
        setCustomers(res.customers);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const handleViewCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setLoadingDetails(true);
    try {
      const res = await api.getAdminCustomerDetails(cust._id);
      if (res.success && res.bookings) {
        setCustomerBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to get customer bookings:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await api.deleteCustomer(customerToDelete._id);
      if (res.success) {
        setNotification({
          type: 'success',
          message: res.message || `Customer "${customerToDelete.name}" removed successfully.`
        });
        if (selectedCustomer && selectedCustomer._id === customerToDelete._id) {
          setSelectedCustomer(null);
        }
        setCustomerToDelete(null);
        await fetchCustomers();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete customer'
      });
    } finally {
      setDeleteLoading(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
            Registered Customers
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Manage registered customers, inspect reservation histories, or remove user accounts
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '0.88rem', background: '#ffffff' }}
          />
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div style={{
          background: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: notification.type === 'success' ? '#047857' : '#b91c1c',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600',
          marginBottom: '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span style={{ flex: 1 }}>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Customers Table */}
      <div className="card-white" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading customers from MongoDB...
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No registered customers found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '14px 18px' }}>Customer Name</th>
                  <th style={{ padding: '14px 18px' }}>Contact Info</th>
                  <th style={{ padding: '14px 18px' }}>Total Bookings</th>
                  <th style={{ padding: '14px 18px' }}>Total Spend</th>
                  <th style={{ padding: '14px 18px' }}>Last Booking Date</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#ede9fe',
                          color: '#7c3aed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.9rem'
                        }}>
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{c.email}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.phone}</div>
                    </td>
                    <td style={{ padding: '16px 18px', fontWeight: '700', color: '#7c3aed' }}>
                      {c.totalBookings} Event{c.totalBookings !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '16px 18px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#64748b' }}>
                      {c.lastBooking || 'No bookings'}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: '#ecfdf5',
                        color: '#047857',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        <CheckCircle size={12} />
                        <span>Active</span>
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleViewCustomer(c)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          title="View Profile & Booking History"
                        >
                          <Eye size={14} />
                          <span>History</span>
                        </button>

                        <button
                          onClick={() => setCustomerToDelete(c)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          title="Delete / Remove Registered Customer"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
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

      {/* DELETE CONFIRMATION MODAL */}
      {customerToDelete && (
        <div className="modal-overlay" onClick={() => !deleteLoading && setCustomerToDelete(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '30px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Remove Registered Customer?
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Permanent database deletion
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '18px' }}>
              Are you sure you want to remove <strong style={{ color: '#0f172a' }}>{customerToDelete.name}</strong> ({customerToDelete.email})? 
              This will permanently delete this registered user account and cancel any associated bookings.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '24px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Customer Name:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{customerToDelete.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Email:</span>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>{customerToDelete.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Total Bookings:</span>
                <span style={{ fontWeight: '700', color: '#7c3aed' }}>{customerToDelete.totalBookings}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setCustomerToDelete(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                style={{
                  padding: '9px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                }}
              >
                <Trash2 size={16} />
                <span>{deleteLoading ? 'Removing...' : 'Yes, Remove Customer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER DETAILS & BOOKINGS MODAL */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase' }}>
                  Customer Profile & Booking History
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedCustomer.name}
                </h3>
              </div>
              <button onClick={() => setSelectedCustomer(null)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Profile Bar */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Email:</span>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{selectedCustomer.email}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Phone:</span>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{selectedCustomer.phone}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Total Reservations:</span>
                <div style={{ fontWeight: '700', color: '#7c3aed' }}>{selectedCustomer.totalBookings}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Lifetime Value:</span>
                <div style={{ fontWeight: '800', color: '#059669' }}>₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Bookings List */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
              Associated Bookings
            </h4>

            {loadingDetails ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                Loading customer bookings...
              </div>
            ) : customerBookings.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
                No bookings recorded for this customer yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                {customerBookings.map((b) => (
                  <div key={b._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>
                        {b.eventType} ({b.bookingId})
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={12} />
                        <span>Date: {b.eventDate} • {b.package?.name} Package</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#0f172a' }}>
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <span className={`status-pill ${b.status}`} style={{ fontSize: '0.7rem' }}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setCustomerToDelete(selectedCustomer);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={15} />
                <span>Remove Customer</span>
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
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

