import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  Cake,
  Building2,
  Gem,
  Award,
  Flame,
  Baby,
  GraduationCap,
  PartyPopper,
  Star,
  Check,
  ArrowRight,
  Clock,
  Utensils,
  Gift,
  PackageCheck,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import DateSlotPicker from '../booking/DateSlotPicker';
import PackageSelector from '../booking/PackageSelector';
import ServiceSelector from '../booking/ServiceSelector';
import PreOrderSelector from '../booking/PreOrderSelector';
import CustomerAuthModal from '../common/CustomerAuthModal';

const EVENT_TYPES = [
  {
    name: 'Wedding',
    icon: Gem,
    label: 'Royal Wedding',
    subtitle: 'Grand decor, sacred mandap & luxury catering',
    tag: 'Flagship'
  },
  {
    name: 'Birthday Party',
    icon: Cake,
    label: 'Birthday Gala',
    subtitle: 'Dynamic theme stages, DJ beats & fun zones',
    tag: 'Trending'
  },
  {
    name: 'Engagement',
    icon: Sparkles,
    label: 'Engagement Ceremony',
    subtitle: 'Ring ceremony, romantic florals & royal feasts',
    tag: 'Popular'
  },
  {
    name: 'Anniversary',
    icon: HeartHandshake,
    label: 'Anniversary Celebration',
    subtitle: 'Milestone silver/golden commemorations',
    tag: 'Romantic'
  },
  {
    name: 'Corporate Events',
    icon: Building2,
    label: 'Corporate Summit',
    subtitle: 'Conferences, AV setups, gala dinners & awards',
    tag: 'Business'
  },
  {
    name: 'Religious Events',
    icon: Flame,
    label: 'Religious Ritual',
    subtitle: 'Traditional pooja setups, serene mandap & satvik bhog',
    tag: 'Sacred'
  },
  {
    name: 'Baby Shower',
    icon: Baby,
    label: 'Baby Shower Gala',
    subtitle: 'Pastel balloons, cradle decor & welcoming favors',
    tag: 'Joyous'
  },
  {
    name: 'Graduation',
    icon: GraduationCap,
    label: 'Graduation Banquet',
    subtitle: 'Cap toss stages, banquet dining & live music',
    tag: 'Youth'
  },
  {
    name: 'Reception',
    icon: PartyPopper,
    label: 'Grand Reception',
    subtitle: 'Post-wedding gala, dance floors & lavish buffets',
    tag: 'Luxury'
  },
  {
    name: 'Other Special Events',
    icon: Star,
    label: 'Custom Special Event',
    subtitle: 'Bespoke celebrations tailored to your exact vision',
    tag: 'Bespoke'
  }
];

export default function BookingFlowPage() {
  const navigate = useNavigate();
  const {
    selectedEvent,
    setEvent,
    selectedDate,
    slotData,
    selectedPackage,
    selectedServices,
    selectedPreOrders,
    calculations,
    confirmBooking
  } = useBooking();

  const { customer, isCustomerLoggedIn } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Smooth scroll to target step element
  const scrollToStep = (stepId) => {
    const el = document.getElementById(stepId);
    if (el) {
      const yOffset = -150; // account for navbar + sticky stepper
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Calculate configuration progress (out of 5)
  const progressStats = useMemo(() => {
    let completed = 0;
    if (selectedEvent) completed++;
    if (selectedDate && slotData?.isAvailable) completed++;
    if (selectedPackage) completed++;
    if (selectedServices && selectedServices.length > 0) completed++;
    if (selectedPreOrders && selectedPreOrders.length > 0) completed++;
    const percent = Math.round((completed / 5) * 100);
    return { completed, percent };
  }, [selectedEvent, selectedDate, slotData, selectedPackage, selectedServices, selectedPreOrders]);

  const totalPreOrderItems = selectedPreOrders
    ? selectedPreOrders.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  const totalSelections = (selectedPackage ? 1 : 0) + (selectedServices?.length || 0) + (selectedPreOrders?.length || 0);

  // Navigate to dedicated Event Booking Summary & Cart Page
  const handleProceedClick = () => {
    navigate('/cart');
  };

  // Called after successful authentication from modal
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setConfirmModalOpen(true);
  };

  // Final booking execution
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
    <div style={{ paddingTop: '32px', paddingBottom: '90px', background: '#f8fafc', minHeight: '90vh' }}>
      <div className="booking-container">

        {/* Page Hero Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #ede9fe 0%, #fae8ff 100%)',
            color: '#7c3aed',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: '800',
            letterSpacing: '0.3px',
            marginBottom: '10px',
            border: '1px solid #ddd6fe'
          }}>
            <Sparkles size={14} />
            <span>Interactive 5-Step Real-Time Event Builder</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2.1rem, 3.5vw, 2.8rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                Design & Reserve Your Special Event
              </h1>
              <p style={{ fontSize: '1.02rem', color: '#64748b', marginTop: '6px', maxWidth: '780px' }}>
                Customize your celebration format, verify live capacity in database, select core production packages, add bespoke catering, and lock in your reservation.
              </p>
            </div>

            {/* Overall Progress Gauge */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
                  Progress Meter
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                  {progressStats.completed} of 5 Steps Configured
                </div>
              </div>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: `conic-gradient(#7c3aed ${progressStats.percent * 3.6}deg, #f1f5f9 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  color: '#7c3aed'
                }}>
                  {progressStats.percent}%
                </div>
              </div>
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

        {/* INTERACTIVE STICKY PROGRESS STEPPER BAR */}
        <div style={{
          position: 'sticky',
          top: '84px',
          zIndex: 45,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(226, 232, 240, 0.95)',
          borderRadius: '20px',
          padding: '12px 18px',
          marginBottom: '32px',
          boxShadow: '0 12px 30px -10px rgba(15, 23, 42, 0.08)'
        }}>
          <div className="stepper-grid-responsive">

            {/* Step 1 Quick Tab */}
            <button
              onClick={() => scrollToStep('step-1')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: selectedEvent ? '#f5f3ff' : '#f8fafc',
                border: selectedEvent ? '1.5px solid #c4b5fd' : '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: selectedEvent ? '#7c3aed' : '#e2e8f0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {selectedEvent ? <Check size={14} strokeWidth={3} /> : '1'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Step 1</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedEvent || 'Category'}
                </div>
              </div>
            </button>

            {/* Step 2 Quick Tab */}
            <button
              onClick={() => scrollToStep('step-2')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: slotData?.isAvailable ? '#f0fdf4' : '#f8fafc',
                border: slotData?.isAvailable ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: slotData?.isAvailable ? '#10b981' : '#e2e8f0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {slotData?.isAvailable ? <Check size={14} strokeWidth={3} /> : '2'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Step 2</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedDate ? selectedDate.substring(5) : 'Date & Capacity'}
                </div>
              </div>
            </button>

            {/* Step 3 Quick Tab */}
            <button
              onClick={() => scrollToStep('step-3')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: selectedPackage ? '#f5f3ff' : '#f8fafc',
                border: selectedPackage ? '1.5px solid #c4b5fd' : '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: selectedPackage ? '#7c3aed' : '#e2e8f0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {selectedPackage ? <Check size={14} strokeWidth={3} /> : '3'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Step 3</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedPackage?.name ? `${selectedPackage.name} Tier` : 'Package Tier'}
                </div>
              </div>
            </button>

            {/* Step 4 Quick Tab */}
            <button
              onClick={() => scrollToStep('step-4')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: selectedServices.length > 0 ? '#f0fdf4' : '#f8fafc',
                border: selectedServices.length > 0 ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: selectedServices.length > 0 ? '#10b981' : '#e2e8f0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {selectedServices.length > 0 ? <Check size={14} strokeWidth={3} /> : '4'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Step 4</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedServices.length > 0 ? `${selectedServices.length} Services` : 'Services'}
                </div>
              </div>
            </button>

            {/* Step 5 Quick Tab */}
            <button
              onClick={() => scrollToStep('step-5')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: totalPreOrderItems > 0 ? '#fffbeb' : '#f8fafc',
                border: totalPreOrderItems > 0 ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: totalPreOrderItems > 0 ? '#f59e0b' : '#e2e8f0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {totalPreOrderItems > 0 ? <Check size={14} strokeWidth={3} /> : '5'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Step 5</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {totalPreOrderItems > 0 ? `${totalPreOrderItems} Items` : 'Favors & Treats'}
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* 5-STEP EVENT BUILDER (FULL PAGE WIDTH) */}
        <div style={{ width: '100%' }}>

            {/* STEP 1: SELECT EVENT TYPE */}
            <div id="step-1" className="card-white" style={{ padding: '28px', marginBottom: '28px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
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
                    }}>1</span>
                    <span>Select Celebration Category</span>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                    Choose the celebration style you want our production crew and catering team to orchestrate
                  </p>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#7c3aed', background: '#ede9fe', padding: '5px 14px', borderRadius: '999px' }}>
                  {selectedEvent} Selected ✓
                </span>
              </div>

              {/* 10 Luxury Category Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '14px',
                marginBottom: '20px'
              }}>
                {EVENT_TYPES.map((typeObj) => {
                  const isSelected = selectedEvent === typeObj.name;
                  const Icon = typeObj.icon;
                  return (
                    <div
                      key={typeObj.name}
                      onClick={() => setEvent(typeObj.name)}
                      style={{
                        padding: '16px 18px',
                        borderRadius: '18px',
                        background: isSelected ? 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)' : '#ffffff',
                        border: isSelected ? '2px solid #7c3aed' : '1.5px solid #e2e8f0',
                        boxShadow: isSelected ? '0 10px 24px -4px rgba(124, 58, 237, 0.25)' : 'var(--shadow-xs)',
                        cursor: 'pointer',
                        transition: 'all 0.22s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '115px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#c4b5fd';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: isSelected ? '#7c3aed' : '#ede9fe',
                          color: isSelected ? '#ffffff' : '#7c3aed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={20} />
                        </div>

                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isSelected ? '#ede9fe' : '#f1f5f9',
                          color: isSelected ? '#6d28d9' : '#64748b',
                          textTransform: 'uppercase'
                        }}>
                          {typeObj.tag}
                        </span>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: isSelected ? '#6d28d9' : '#0f172a', lineHeight: '1.3' }}>
                          {typeObj.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px', lineHeight: '1.35' }}>
                          {typeObj.subtitle}
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#7c3aed',
                          color: '#ffffff',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Footer Action */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Currently Selected: <strong style={{ color: '#7c3aed' }}>{selectedEvent}</strong>. Proceed to verify live capacity.
                </div>
                <button
                  type="button"
                  onClick={() => scrollToStep('step-2')}
                  className="btn-primary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Proceed to Step 2: Date & Capacity</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* STEP 2: DATE & CAPACITY AVAILABILITY */}
            <div id="step-2">
              <DateSlotPicker />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px', marginBottom: '28px' }}>
                <button
                  type="button"
                  onClick={() => scrollToStep('step-3')}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Proceed to Step 3: Choose Production Package</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* STEP 3: PACKAGE SELECTOR */}
            <div id="step-3">
              <PackageSelector />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px', marginBottom: '28px' }}>
                <button
                  type="button"
                  onClick={() => scrollToStep('step-4')}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Proceed to Step 4: Custom Catering & Decor</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* STEP 4: SERVICES MARKETPLACE & GUEST COUNT */}
            <div id="step-4">
              <ServiceSelector />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px', marginBottom: '28px' }}>
                <button
                  type="button"
                  onClick={() => scrollToStep('step-5')}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Proceed to Step 5: Pre-Order Treats & Favors</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* STEP 5: PRE-ORDER ITEMS & SPECIAL TREATS */}
            <div id="step-5">
              <PreOrderSelector />
              {/* Step 5 Bottom Action: Go to Cart / Event Booking Summary */}
              <div style={{
                marginTop: '16px',
                marginBottom: '36px',
                padding: '26px 32px',
                background: '#ffffff',
                border: '2px solid #ede9fe',
                borderRadius: '24px',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '18px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: '#7c3aed' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#7c3aed', letterSpacing: '0.5px' }}>
                      Selections Configured
                    </span>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', marginTop: '3px' }}>
                    {selectedPackage ? `${selectedPackage.name} Tier • ${totalSelections} Items Ready` : 'Ready to Proceed to Booking Summary'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
                    Current Total Estimate: <strong style={{ color: '#7c3aed', fontSize: '1.15rem' }}>₹{calculations.grandTotal.toLocaleString('en-IN')}</strong> ({totalSelections} items configured)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn-primary"
                  style={{
                    padding: '16px 36px',
                    fontSize: '1.05rem',
                    fontWeight: '800',
                    borderRadius: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 28px rgba(124, 58, 237, 0.4)'
                  }}
                >
                  <ShoppingBag size={20} />
                  <span>Proceed to Event Booking Summary & Cart ({totalSelections})</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

        </div>

      </div>

      {/* Floating Quick-Access Cart Bar at Bottom of Screen */}
      {totalSelections > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          background: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
          maxWidth: '92vw',
          width: 'max-content'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <ShoppingBag size={17} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#f8fafc' }}>
                {selectedPackage ? `${selectedPackage.name} Tier` : selectedEvent} • {selectedDate}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {totalSelections} selections • <strong style={{ color: '#a78bfa' }}>₹{calculations.grandTotal.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/cart')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              padding: '9px 20px',
              borderRadius: '999px',
              fontSize: '0.88rem',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            <span>View Summary & Cart</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

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

      {/* Responsive layout styles for stepper and booking grid */}
      <style>{`
        @media (max-width: 900px) {
          .stepper-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .stepper-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
