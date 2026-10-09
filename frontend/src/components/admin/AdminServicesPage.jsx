import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Check, 
  X, 
  UtensilsCrossed, 
  Gift, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../services/api';

const SERVICE_CATEGORIES = [
  'Food & Catering',
  'Mandap & Stage',
  'Flower Decoration',
  'Photography',
  'Music & Entertainment',
  'Lighting',
  'Furniture & Seating',
  'Makeup & Beauty'
];

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'preorders'
  const [services, setServices] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentItem, setCurrentItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food & Catering',
    description: '',
    price: '',
    pricingUnit: 'fixed',
    image: '',
    availability: true
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'services') {
        const res = await api.getServices(categoryFilter, searchTerm, true);
        if (res.success && res.services) setServices(res.services);
      } else {
        const res = await api.getPreOrders('All', searchTerm, true);
        if (res.success && res.preOrders) setPreOrders(res.preOrders);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, categoryFilter, searchTerm]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setFormData({
      name: '',
      category: activeTab === 'services' ? 'Food & Catering' : 'Add-on',
      description: '',
      price: '',
      pricingUnit: 'fixed',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      availability: true
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      pricingUnit: item.pricingUnit || 'fixed',
      image: item.image,
      availability: item.availability !== undefined ? item.availability : true
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (activeTab === 'services') {
        if (modalMode === 'create') {
          await api.createService(formData);
          setMsg('Service created successfully!');
        } else {
          await api.updateService(currentItem._id, formData);
          setMsg('Service updated successfully!');
        }
      } else {
        if (modalMode === 'create') {
          await api.createPreOrder(formData);
          setMsg('Pre-order item created successfully!');
        } else {
          await api.updatePreOrder(currentItem._id, formData);
          setMsg('Pre-order item updated successfully!');
        }
      }
      setModalOpen(false);
      fetchData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeTab === 'services') {
        await api.deleteService(id);
      } else {
        await api.deletePreOrder(id);
      }
      setMsg('Item deleted successfully!');
      fetchData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const newAvail = !item.availability;
      if (activeTab === 'services') {
        await api.updateService(item._id, { availability: newAvail });
      } else {
        await api.updatePreOrder(item._id, { availability: newAvail });
      }
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to toggle availability');
    }
  };

  const items = activeTab === 'services' ? services : preOrders;

  return (
    <div>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
            Service & Pre-Order Catalog
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Manage marketplace offerings, catering menus, decor pricing, and availability
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Plus size={18} />
          <span>Add New {activeTab === 'services' ? 'Service' : 'Pre-Order Item'}</span>
        </button>
      </div>

      {msg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: '600', marginBottom: '20px' }}>
          <Check size={18} />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs and Filter Bar */}
      <div className="card-white" style={{ padding: '18px 24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
        
        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => { setActiveTab('services'); setCategoryFilter('All'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: activeTab === 'services' ? '#ffffff' : 'transparent',
              color: activeTab === 'services' ? '#7c3aed' : '#64748b',
              boxShadow: activeTab === 'services' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Services Marketplace ({services.length})
          </button>
          <button
            onClick={() => { setActiveTab('preorders'); setCategoryFilter('All'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: activeTab === 'preorders' ? '#ffffff' : 'transparent',
              color: activeTab === 'preorders' ? '#7c3aed' : '#64748b',
              boxShadow: activeTab === 'preorders' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Pre-Orders ({preOrders.length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {activeTab === 'services' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '8px 12px' }}
            >
              <option value="All">All Categories</option>
              {SERVICE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

      </div>

      {/* Items Table */}
      <div className="card-white" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading catalog...
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No items found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '14px 18px' }}>Item</th>
                  <th style={{ padding: '14px 18px' }}>Category</th>
                  <th style={{ padding: '14px 18px' }}>Price</th>
                  <th style={{ padding: '14px 18px' }}>Availability</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', padding: '3px 10px', borderRadius: '6px', background: '#ede9fe', color: '#6d28d9' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                      {item.pricingUnit === 'per_guest' && <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}> / guest</span>}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: item.availability ? '#ecfdf5' : '#fef2f2',
                          color: item.availability ? '#047857' : '#b91c1c',
                          border: item.availability ? '1px solid #a7f3d0' : '1px solid #fecaca'
                        }}
                      >
                        {item.availability ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.availability ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #fecaca',
                            background: '#fff1f2',
                            color: '#b91c1c',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} />
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

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', padding: '32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                {modalMode === 'create' ? 'Add New Item' : 'Edit Catalog Item'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#b91c1c', marginBottom: '16px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item / Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Royal Punjabi Spread"
                />
              </div>

              {activeTab === 'services' && (
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    {SERVICE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  placeholder="Provide attractive description..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                {activeTab === 'services' && (
                  <div className="form-group">
                    <label className="form-label">Pricing Structure</label>
                    <select
                      value={formData.pricingUnit}
                      onChange={(e) => setFormData({ ...formData, pricingUnit: e.target.value })}
                      className="form-input"
                    >
                      <option value="fixed">Fixed Rate</option>
                      <option value="per_guest">Per Guest (Multiplied with Guest Count)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  {submitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
