import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { api } from '../../services/api';

export default function DateSlotPicker() {
  const { 
    selectedEvent, 
    selectedDate, 
    setDate, 
    slotData, 
    slotLoading, 
    checkSlot 
  } = useBooking();

  const [calendarSlots, setCalendarSlots] = useState({});

  const upcomingDates = React.useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      list.push({ date: dateStr, label });
    }
    return list;
  }, []);

  const targetMonth = (selectedDate || '').substring(0, 7) || new Date().toISOString().substring(0, 7);

  // Fetch slots preview for the selected month
  useEffect(() => {
    const fetchCalendarOverview = async () => {
      try {
        const res = await api.getCalendarSlots(selectedEvent, targetMonth);
        if (res.success && res.slots) {
          const map = {};
          res.slots.forEach(s => {
            map[s.date] = s;
          });
          setCalendarSlots(map);
        }
      } catch (err) {
        console.warn('Could not load calendar map:', err);
      }
    };

    fetchCalendarOverview();
  }, [selectedEvent, targetMonth]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    checkSlot(selectedEvent, newDate);
  };

  const handleQuickSelect = (dateStr) => {
    setDate(dateStr);
    checkSlot(selectedEvent, dateStr);
  };

  const maxCap = slotData?.maxCapacity || 3;
  const booked = slotData?.bookedCount || 0;
  const remaining = slotData?.remainingSlots !== undefined ? slotData.remainingSlots : Math.max(0, maxCap - booked);
  const status = slotData?.status || (remaining === 0 ? 'Fully Booked' : remaining === 1 ? 'Limited' : 'Available');
  const isAvailable = remaining > 0;

  return (
    <div className="card-white" style={{ padding: '28px', marginBottom: '28px', borderRadius: '24px' }}>
      
      {/* Header */}
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
            }}>2</span>
            <span>Check Date & Capacity Availability</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
            Verified against database capacity for <strong style={{ color: '#7c3aed' }}>{selectedEvent}</strong>. Overbooking is strictly prevented.
          </p>
        </div>

        <button 
          onClick={() => checkSlot(selectedEvent, selectedDate)}
          className="btn-secondary"
          style={{
            padding: '7px 14px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Refresh slot availability from server"
        >
          <RefreshCw size={14} className={slotLoading ? 'animate-spin' : ''} />
          <span>Sync Status</span>
        </button>
      </div>

      {/* Suggested Quick Date Chips */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '10px' }}>
          Quick Select Upcoming Dates:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {upcomingDates.map((item) => {
            const isSelected = selectedDate === item.date;
            const slotInfo = calendarSlots[item.date];
            const slotStatus = slotInfo ? slotInfo.status : 'Available';

            return (
              <button
                key={item.date}
                onClick={() => handleQuickSelect(item.date)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: isSelected ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' : '#ffffff',
                  border: isSelected ? '2px solid #7c3aed' : '1.5px solid #e2e8f0',
                  boxShadow: isSelected ? '0 6px 16px rgba(124, 58, 237, 0.2)' : 'var(--shadow-xs)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: isSelected ? '#6d28d9' : '#0f172a' }}>
                    {item.label}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: slotStatus === 'Fully Booked' ? '#ef4444' : slotStatus === 'Limited' ? '#f59e0b' : '#10b981'
                    }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: slotStatus === 'Fully Booked' ? '#991b1b' : slotStatus === 'Limited' ? '#b45309' : '#047857' }}>
                      {slotStatus}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Picker Input & Real-Time Availability Side-by-Side with Equal Heights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px', alignItems: 'stretch' }}>
        
        {/* Custom Date Input Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div>
            <label style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CalendarIcon size={18} style={{ color: '#7c3aed' }} />
              <span>Choose Custom Celebration Date</span>
            </label>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
              Select any future calendar date to verify instant real-time venue and catering capacity.
            </p>
          </div>

          <div>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
              style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', background: '#f8fafc', padding: '14px 18px', borderRadius: '14px' }}
            />
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Target Celebration:</span>
              <strong style={{ color: '#7c3aed' }}>
                {(() => {
                  try {
                    return new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                  } catch (e) {
                    return selectedDate;
                  }
                })()}
              </strong>
            </div>
          </div>
        </div>

        {/* Real-time Availability Result Card */}
        <div style={{
          background: isAvailable ? (status === 'Limited' ? '#fffbeb' : '#f0fdf4') : '#fef2f2',
          border: `1.5px solid ${isAvailable ? (status === 'Limited' ? '#fde68a' : '#bbf7d0') : '#fecaca'}`,
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {status === 'Fully Booked' ? (
                  <XCircle size={22} style={{ color: '#ef4444' }} />
                ) : status === 'Limited' ? (
                  <AlertTriangle size={22} style={{ color: '#f59e0b' }} />
                ) : (
                  <CheckCircle2 size={22} style={{ color: '#10b981' }} />
                )}
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  color: status === 'Fully Booked' ? '#991b1b' : status === 'Limited' ? '#92400e' : '#14532d'
                }}>
                  {status === 'Fully Booked' ? 'Fully Booked' : status === 'Limited' ? 'Limited Capacity' : 'Slots Available'}
                </span>
              </div>

              <span style={{
                fontSize: '0.8rem',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '999px',
                background: '#ffffff',
                color: '#334155',
                boxShadow: 'var(--shadow-xs)'
              }}>
                {booked} / {maxCap} Booked
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div style={{
              height: '8px',
              width: '100%',
              background: 'rgba(0,0,0,0.06)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginTop: '6px'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (booked / maxCap) * 100)}%`,
                background: status === 'Fully Booked' ? '#ef4444' : status === 'Limited' ? '#f59e0b' : '#10b981',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.78rem', color: '#64748b' }}>
              <span>Daily Limit: {maxCap} simultaneous events</span>
              <strong style={{ color: isAvailable ? '#047857' : '#b91c1c' }}>
                {isAvailable ? `${remaining} Slot${remaining > 1 ? 's' : ''} Remaining` : '0 Slots left'}
              </strong>
            </div>
          </div>

          {/* Action guidance note */}
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: status === 'Fully Booked' ? '#b91c1c' : status === 'Limited' ? '#b45309' : '#15803d',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '8px'
          }}>
            {status === 'Fully Booked' ? (
              <span>⚠️ All capacity for this date is committed. Please pick an alternative date.</span>
            ) : status === 'Limited' ? (
              <span>⚡ High demand date! Only {remaining} spot remaining. Reserve now to secure it.</span>
            ) : (
              <span>✨ Date is open with full availability. You can choose packages below.</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
