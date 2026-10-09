import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  PackageCheck, 
  Layers, 
  Gift, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  AlertCircle, 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  Edit3, 
  Check,
  Crown,
  Star
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import CustomerAuthModal from '../common/CustomerAuthModal';

export default function CartPage() {
  const navigate = useNavigate();
  const { customer, isCustomerLoggedIn } = useAuth();
  const {
    selectedEvent,
    selectedDate,
    slotData,
    selectedPackage,
    selectedServices,
    selectedPreOrders,
    guestCount,
    calculations,
    toggleService,
    updatePreOrderQuantity,
    removePreOrder,
    updateGuestCount,
    clearBooking,
    confirmBooking
  } = useBooking();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const totalSelections = (selectedPackage ? 1 : 0) + selectedServices.length + selectedPreOrders.length;
  const isFullyBooked = slotData && !slotData.isAvailable;
  const canProceed = !isFullyBooked && selectedPackage;

  // Handle proceed to checkout
  const handleProceedClick = () => {
    setBookingError('');
    if (!slotData?.isAvailable) {
      setBookingError('Selected date is fully booked. Please choose an available calendar date.');
      return;
    }

    if (!selectedPackage) {
      setBookingError('Please choose a core package tier (Basic, Standard, or Premium) to proceed.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setBookingError('Please enter your event venue / banquet address.');
      return;
    }

    if (!isCustomerLoggedIn) {
      setAuthModalOpen(true);
    } else {
      setConfirmModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setConfirmModalOpen(true);
  };

  const handleFinalBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError('');

    try {
      const customerInfo = {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        address: deliveryAddress
      };

      const res = await confirmBooking(customerInfo, specialRequests);
      if (res.success && res.booking) {
        setConfirmModalOpen(false);
        navigate(`/booking-success/${res.booking._id}`, { state: { booking: res.booking } });
      }
    } catch (err) {
      setBookingError(err.message || 'Booking submission failed. Please verify slot availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '36px', paddingBottom: '90px', background: '#f8fafc', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1360px' }}>
        
        {/* Top Header & Breadcrumb */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
            <Link 
              to="/book" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: '#7c3aed', 
                fontWeight: '700', 
                fontSize: '0.9rem',
                padding: '6px 12px',
                borderRadius: '10px',
                background: '#ede9fe',
                transition: 'all 0.2s'
              }}
            >
              <ArrowLeft size={16} />
              <span>Continue Planning & Customizing</span>
            </Link>

            {totalSelections > 0 && (
              <button
                type="button"
                onClick={clearBooking}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={14} />
                <span>Reset Selections</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(124, 58, 237, 0.3)'
            }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
                Event Booking Summary & Cart
              </h1>
              <p style={{ fontSize: '0.98rem', color: '#64748b', marginTop: '2px' }}>
                Transparent itemized breakdown of your celebration reservation. Verify details and secure your slot.
              </p>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {bookingError && (
          <div style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: '18px',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#b91c1c',
            fontWeight: '700',
            fontSize: '0.94rem',
            marginBottom: '26px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <AlertCircle size={22} style={{ flexShrink: 0 }} />
            <span>{bookingError}</span>
          </div>
        )}

        {/* EMPTY CART STATE */}
        {totalSelections === 0 ? (
          <div className="card-white" style={{
            padding: '70px 30px',
            textAlign: 'center',
            borderRadius: '24px',
            maxWidth: '680px',
            margin: '40px auto',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <ShoppingBag size={40} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
              Your Event Cart is Empty
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '460px', margin: '0 auto 28px auto', lineHeight: '1.5' }}>
              You haven't selected any production package or services yet. Choose your celebration style, verify date capacity, and build your dream event.
            </p>
            <Link
              to="/book"
              className="btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '16px'
              }}
            >
              <Sparkles size={18} />
              <span>Start Planning Your Event (5-Step Builder)</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* 2-COLUMN LUXURY SUMMARY & CHECKOUT LAYOUT */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 440px',
            gap: '32px',
            alignItems: 'start'
          }} className="cart-layout-grid">
            
            {/* LEFT COLUMN: ITEMIZED BOOKING SELECTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* 1. CELEBRATION & CAPACITY CARD */}
              <div className="card-white" style={{ padding: '24px 28px', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}>1 & 2</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                      Event Category & Capacity
                    </h3>
                  </div>

                  <Link 
                    to="/book" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: '#7c3aed', 
                      fontSize: '0.82rem', 
                      fontWeight: '700' 
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Change Date or Category</span>
                  </Link>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Celebration Format</span>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#7c3aed', marginTop: '3px' }}>
                      {selectedEvent}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Reserved Date</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.02rem', fontWeight: '800', color: '#0f172a', marginTop: '3px' }}>
                      <Calendar size={16} style={{ color: '#7c3aed' }} />
                      <span>{selectedDate}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Database Slot Status</span>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: slotData?.isAvailable ? '#ecfdf5' : '#fef2f2',
                        color: slotData?.isAvailable ? '#059669' : '#dc2626',
                        border: slotData?.isAvailable ? '1px solid #a7f3d0' : '1px solid #fecaca',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: slotData?.isAvailable ? '#10b981' : '#ef4444' }} />
                        <span>{slotData?.isAvailable ? 'Slot Available ✓' : 'Fully Booked'}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Guest Count</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => updateGuestCount(Math.max(10, guestCount - 25))}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontWeight: '800'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', minWidth: '70px', textAlign: 'center' }}>
                        {guestCount} Guests
                      </span>
                      <button
                        type="button"
                        onClick={() => updateGuestCount(guestCount + 25)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontWeight: '800'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. CORE PRODUCTION PACKAGE CARD */}
              <div className="card-white" style={{ padding: '24px 28px', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}>3</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                      Core Production Package Tier
                    </h3>
                  </div>

                  <Link 
                    to="/book" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: '#7c3aed', 
                      fontSize: '0.82rem', 
                      fontWeight: '700' 
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Change Tier</span>
                  </Link>
                </div>

                {selectedPackage ? (
                  <div style={{
                    background: 'linear-gradient(135deg, #fbfaff 0%, #ffffff 100%)',
                    border: '2px solid #c4b5fd',
                    borderRadius: '18px',
                    padding: '22px',
                    boxShadow: '0 8px 24px -6px rgba(124, 58, 237, 0.12)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
                            {selectedPackage.name} Production Tier
                          </h4>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: selectedPackage.name === 'Premium' ? '#fef3c7' : '#ede9fe',
                            color: selectedPackage.name === 'Premium' ? '#b45309' : '#6d28d9',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {selectedPackage.name === 'Premium' ? <Crown size={12} /> : <Star size={12} />}
                            <span>{selectedPackage.name === 'Premium' ? 'Royal Platinum' : 'Most Popular'}</span>
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                          {selectedPackage.description}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#7c3aed', letterSpacing: '-0.5px' }}>
                          ₹{selectedPackage.price.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Base Production Included</span>
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '10px' }}>
                        Inclusions Confirmed for Your Date
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                        {selectedPackage.features?.map((feature, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#ede9fe',
                              color: '#7c3aed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#fffbeb',
                    border: '1.5px dashed #fde68a',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertCircle size={20} style={{ color: '#b45309' }} />
                      <span style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: '700' }}>
                        No core production package selected yet. A package is required to reserve.
                      </span>
                    </div>
                    <Link to="/book" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                      Choose Package in Step 3
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. CUSTOM ADD-ON SERVICES */}
              <div className="card-white" style={{ padding: '24px 28px', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}>4</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                      Custom Add-On Services ({selectedServices.length})
                    </h3>
                  </div>

                  <Link 
                    to="/book" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: '#7c3aed', 
                      fontSize: '0.82rem', 
                      fontWeight: '700' 
                    }}
                  >
                    <Plus size={13} />
                    <span>Add More Services</span>
                  </Link>
                </div>

                {selectedServices.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No custom catering, decor, or media services added.</p>
                    <Link to="/book" style={{ color: '#7c3aed', fontWeight: '700', fontSize: '0.85rem', marginTop: '6px', display: 'inline-block' }}>
                      + Browse Services Catalog
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedServices.map((service) => {
                      const isPerGuest = service.pricingUnit === 'per_guest';
                      const itemTotal = isPerGuest ? service.price * guestCount : service.price;

                      return (
                        <div
                          key={service._id || service.serviceId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1.5px solid #e2e8f0',
                            transition: 'all 0.2s',
                            gap: '14px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: '#f1f5f9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#7c3aed',
                              flexShrink: 0
                            }}>
                              <Layers size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                                {service.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {service.category} • {isPerGuest ? `₹${service.price.toLocaleString('en-IN')} × ${guestCount} guests` : 'Flat Rate'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                              ₹{itemTotal.toLocaleString('en-IN')}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleService(service)}
                              title="Remove Service"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: '#fef2f2',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '1px solid #fecaca',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. PRE-ORDER GOURMET TREATS & FAVORS */}
              <div className="card-white" style={{ padding: '24px 28px', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem'
                    }}>5</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                      Pre-Order Treats & Luxury Favors ({selectedPreOrders.length})
                    </h3>
                  </div>

                  <Link 
                    to="/book" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: '#7c3aed', 
                      fontSize: '0.82rem', 
                      fontWeight: '700' 
                    }}
                  >
                    <Plus size={13} />
                    <span>Add More Favors</span>
                  </Link>
                </div>

                {selectedPreOrders.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No gourmet sweets, dessert bars, or return gift hampers selected.</p>
                    <Link to="/book" style={{ color: '#7c3aed', fontWeight: '700', fontSize: '0.85rem', marginTop: '6px', display: 'inline-block' }}>
                      + Browse Favors & Treats
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedPreOrders.map((item) => {
                      const itemId = item._id || item.preOrderId;
                      return (
                        <div
                          key={itemId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1.5px solid #e2e8f0',
                            gap: '14px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#fef3c7',
                                color: '#d97706',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Gift size={20} />
                              </div>
                            )}

                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                ₹{item.price.toLocaleString('en-IN')} per unit
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Quantity Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              <button
                                type="button"
                                onClick={() => updatePreOrderQuantity(itemId, item.quantity - 1)}
                                style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              >
                                <Minus size={11} />
                              </button>
                              <span style={{ fontSize: '0.88rem', fontWeight: '800', minWidth: '32px', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updatePreOrderQuantity(itemId, item.quantity + 1)}
                                style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', minWidth: '85px', textAlign: 'right' }}>
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>

                            <button
                              type="button"
                              onClick={() => removePreOrder(itemId)}
                              title="Delete Item"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: '#fef2f2',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '1px solid #fecaca'
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY & CHECKOUT FORM */}
            <div style={{ position: 'sticky', top: '96px' }}>
              <div className="card-white" style={{
                padding: '28px',
                borderRadius: '24px',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.1)'
              }}>
                <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                      Reservation Bill
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: '#ede9fe',
                      color: '#6d28d9'
                    }}>
                      Live Estimate
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                    All inclusions, taxes, and production setups itemized
                  </p>
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#475569' }}>
                    <span>Core Package Production:</span>
                    <strong style={{ color: '#0f172a' }}>₹{calculations.packageCost.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#475569' }}>
                    <span>Bespoke Services ({selectedServices.length}):</span>
                    <strong style={{ color: '#0f172a' }}>₹{calculations.servicesCost.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#475569' }}>
                    <span>Favors & Pre-orders ({selectedPreOrders.length}):</span>
                    <strong style={{ color: '#0f172a' }}>₹{calculations.preOrdersCost.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}>
                    <span>Gross Subtotal:</span>
                    <span>₹{calculations.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {calculations.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#059669', fontWeight: '700' }}>
                      <span>Seasonal Package Discount (5%):</span>
                      <span>-₹{calculations.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#64748b' }}>
                    <span>GST & Production Fee (5%):</span>
                    <span>+₹{calculations.taxes.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div style={{
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
                  padding: '16px 18px',
                  borderRadius: '16px',
                  border: '1.5px solid #ddd6fe',
                  marginBottom: '22px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: '#6d28d9', letterSpacing: '0.5px' }}>
                        Grand Total Payable
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#7c3aed', marginTop: '2px' }}>
                        Locked price guarantee
                      </div>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
                      ₹{calculations.grandTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Host Details & Venue Form */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                      Venue / Banquet Hall Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Grand Royal Orchid Ballroom, Sector 12"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '36px', fontSize: '0.88rem', borderRadius: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                      Special Directives or Dietary Notes (Optional)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Jain food preferences, timing requirements, floral colors..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.85rem', borderRadius: '12px', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Auth Status Banner */}
                {!isCustomerLoggedIn && (
                  <div style={{
                    background: '#ede9fe',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    color: '#6d28d9',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Sign in to link booking to your profile</span>
                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(true)}
                      style={{ fontWeight: '800', color: '#7c3aed', textDecoration: 'underline' }}
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceedClick}
                  disabled={isSubmitting || !canProceed}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '1rem',
                    fontWeight: '800',
                    borderRadius: '16px',
                    boxShadow: canProceed ? '0 10px 25px rgba(124, 58, 237, 0.4)' : 'none',
                    opacity: canProceed ? 1 : 0.6,
                    cursor: canProceed ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <ShieldCheck size={18} />
                  <span>
                    {!selectedPackage 
                      ? 'Select Package Tier to Proceed' 
                      : isFullyBooked 
                        ? 'Date Fully Booked' 
                        : 'Review & Lock In Reservation'}
                  </span>
                  <ArrowRight size={16} />
                </button>

                {/* Security badges */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '16px',
                  fontSize: '0.74rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} style={{ color: '#10b981' }} />
                    <span>Guaranteed Slot</span>
                  </div>
                  <div>•</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                    <span>Zero Overbooking</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* CUSTOMER AUTH MODAL */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* FINAL CONFIRMATION MODAL */}
      {confirmModalOpen && (
        <div className="modal-overlay" onClick={() => setConfirmModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '36px', maxWidth: '600px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                  Review & Confirm Reservation
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Guaranteed capacity lock in MongoDB for <strong style={{ color: '#0f172a' }}>{selectedDate}</strong>
                </p>
              </div>
            </div>

            {/* Booking Recap Card */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Host Name</span>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{customer?.name}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Contact Phone</span>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{customer?.phone}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Celebration Event</span>
                  <div style={{ fontWeight: '800', color: '#7c3aed', marginTop: '2px' }}>{selectedEvent}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Reserved Date</span>
                  <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{selectedDate}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '16px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#334155' }}>Total Amount Payable:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#7c3aed' }}>
                  ₹{calculations.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFinalBooking}>
              <div className="form-group">
                <label className="form-label">Venue / Banquet Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palace Orchid Banquet, MG Road, Bangalore"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Directives & Dietary Notes (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="e.g., Jain food options required, gold & maroon stage theme, timing notes..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Modify Selections
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ flex: 2, padding: '14px' }}
                >
                  {isSubmitting ? 'Locking Spot in Database...' : 'Confirm & Reserve Slot'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Cart Layout Responsive CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .cart-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
