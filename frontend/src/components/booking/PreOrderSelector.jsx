import React, { useState, useEffect } from 'react';
import { Gift, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { api } from '../../services/api';

export default function PreOrderSelector() {
  const { 
    addPreOrder, 
    updatePreOrderQuantity, 
    removePreOrder, 
    getPreOrderQuantity,
    selectedPreOrders 
  } = useBooking();

  const [preOrders, setPreOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreOrders = async () => {
      try {
        const res = await api.getPreOrders();
        if (res.success && res.preOrders) {
          setPreOrders(res.preOrders);
        }
      } catch (err) {
        console.error('Error fetching pre-orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreOrders();
  }, []);

  const totalPreOrderCount = selectedPreOrders ? selectedPreOrders.reduce((acc, curr) => acc + curr.quantity, 0) : 0;

  return (
    <div className="card-white" style={{ padding: '28px', marginBottom: '28px', borderRadius: '24px' }}>
      
      {/* Step Header */}
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
              background: '#fef3c7',
              color: '#b45309',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: '800'
            }}>5</span>
            <span>Pre-Order Luxury Treats & Welcome Favors</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            Delight your guests with celebratory designer cakes, floral hampers, welcome mocktail kegs, and personalized return gifts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: '700',
            color: totalPreOrderCount > 0 ? '#b45309' : '#64748b',
            background: totalPreOrderCount > 0 ? '#fef3c7' : '#f1f5f9',
            padding: '5px 14px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Gift size={13} />
            <span>{totalPreOrderCount > 0 ? `${totalPreOrderCount} Items Selected` : 'Optional Add-ons'}</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '16px' }}>
          <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
          <span>Loading luxury pre-order catalog...</span>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '22px',
          alignItems: 'stretch'
        }}>
          {preOrders.map((item) => {
            const quantity = getPreOrderQuantity(item._id);
            const total = item.price * quantity;

            return (
              <div
                key={item._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: quantity > 0 ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                  boxShadow: quantity > 0 ? '0 10px 25px -4px rgba(245, 158, 11, 0.2)' : 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Image */}
                <div style={{ height: '145px', width: '100%', position: 'relative', overflow: 'hidden', background: '#f1f5f9' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    letterSpacing: '0.3px'
                  }}>
                    {item.category || 'Add-on'}
                  </div>

                  {quantity > 0 && (
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
                      <span>{quantity} Added</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px', lineHeight: '1.3' }}>
                      {item.name}
                    </h4>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      lineHeight: '1.45',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                          Unit Price
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {quantity > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: '#d97706', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                            Subtotal
                          </span>
                          <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#b45309' }}>
                            ₹{total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stepper / Add button */}
                    {quantity === 0 ? (
                      <button
                        onClick={() => addPreOrder(item, 1)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: '#fffbeb',
                          color: '#b45309',
                          border: '1.5px solid #fde68a',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fef3c7';
                          e.currentTarget.style.borderColor = '#f59e0b';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fffbeb';
                          e.currentTarget.style.borderColor = '#fde68a';
                        }}
                      >
                        <Plus size={15} />
                        <span>Pre-Order Item</span>
                      </button>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#fef3c7',
                        borderRadius: '12px',
                        padding: '5px 8px',
                        border: '1.5px solid #fde68a'
                      }}>
                        <button
                          onClick={() => updatePreOrderQuantity(item._id, quantity - 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-xs)'
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#92400e' }}>
                          Qty: {quantity}
                        </span>

                        <button
                          onClick={() => updatePreOrderQuantity(item._id, quantity + 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-xs)'
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
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
