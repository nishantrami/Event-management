import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Calendar, 
  CalendarDays,
  Plus, 
  Minus,
  CheckCircle, 
  CheckCircle2,
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  Trash2,
  Edit3,
  Sliders,
  Download,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  X,
  FileSpreadsheet,
  Check,
  CalendarCheck
} from 'lucide-react';
import { api } from '../../services/api';

const EVENT_TYPES = [
  'Wedding',
  'Birthday Party',
  'Engagement',
  'Anniversary',
  'Corporate Events',
  'Religious Events',
  'Baby Shower',
  'Graduation',
  'Reception',
  'Other Special Events'
];

export default function AdminSlotsPage() {
  // Main data state
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Navigation tabs: 'table' | 'calendar' | 'bulk'
  const [activeTab, setActiveTab] = useState('table');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [datePreset, setDatePreset] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Single Slot Configure / Edit Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    eventType: 'Wedding',
    date: new Date().toISOString().split('T')[0],
    maxCapacity: 3,
    isBlocked: false,
    notes: ''
  });

  // Slot Bookings Inspector Modal State
  const [selectedSlotForBookings, setSelectedSlotForBookings] = useState(null);
  const [slotBookings, setSlotBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Bulk Slot Configurator State
  const [bulkData, setBulkData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0];
    })(),
    selectedCategories: ['Wedding', 'Birthday Party', 'Engagement'],
    maxCapacity: 3,
    isBlocked: false,
    notes: 'Seasonal capacity adjustment'
  });
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // Calendar View State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarEventCategory, setCalendarEventCategory] = useState('Wedding');

  // Flash Notifications (toast / banner)
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch slots & statistics from server
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch slots
      const queryParams = {
        eventType: eventTypeFilter !== 'All' ? eventTypeFilter : '',
        status: statusFilter !== 'All' ? statusFilter : '',
        search: searchTerm
      };

      if (datePreset === 'upcoming7') {
        const today = new Date().toISOString().split('T')[0];
        const next7 = new Date();
        next7.setDate(next7.getDate() + 7);
        queryParams.startDate = today;
        queryParams.endDate = next7.toISOString().split('T')[0];
      } else if (datePreset === 'upcoming30') {
        const today = new Date().toISOString().split('T')[0];
        const next30 = new Date();
        next30.setDate(next30.getDate() + 30);
        queryParams.startDate = today;
        queryParams.endDate = next30.toISOString().split('T')[0];
      } else if (datePreset === 'thisMonth') {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        queryParams.startDate = `${yyyy}-${mm}-01`;
        queryParams.endDate = `${yyyy}-${mm}-31`;
      }

      const [slotsRes, statsRes] = await Promise.all([
        api.getAllSlots(queryParams),
        api.getSlotStats ? api.getSlotStats().catch(() => null) : null
      ]);

      if (slotsRes.success && slotsRes.slots) {
        setSlots(slotsRes.slots);
      }

      if (statsRes && statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      } else {
        // Fallback compute stats from slots
        computeLocalStats(slotsRes.slots || []);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      showToast(err.message || 'Failed to sync slot data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const computeLocalStats = (slotList) => {
    const totalSlots = slotList.length;
    const availableSlots = slotList.filter(s => s.status === 'Available' && !s.isBlocked).length;
    const limitedSlots = slotList.filter(s => s.status === 'Limited' && !s.isBlocked).length;
    const fullyBookedSlots = slotList.filter(s => s.status === 'Fully Booked').length;
    const blockedSlots = slotList.filter(s => s.isBlocked || s.status === 'Blocked').length;
    const totalBooked = slotList.reduce((sum, s) => sum + (s.bookedCount || 0), 0);
    const totalCapacity = slotList.reduce((sum, s) => sum + (s.maxCapacity || 0), 0);

    setStats({
      totalSlots,
      availableSlots,
      limitedSlots,
      fullyBookedSlots,
      blockedSlots,
      totalBooked,
      totalCapacity
    });
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, eventTypeFilter, searchTerm, datePreset]);

  // Handle Quick Capacity Increment / Decrement
  const handleCapacityQuickAdjust = async (slot, delta) => {
    const newCap = slot.maxCapacity + delta;
    if (newCap < 1) {
      showToast('Capacity cannot be reduced below 1 slot', 'error');
      return;
    }
    if (newCap < slot.bookedCount) {
      showToast(`Cannot reduce capacity to ${newCap}. There are already ${slot.bookedCount} active confirmed bookings on this date!`, 'error');
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.setSlotCapacity({
        eventType: slot.eventType,
        date: slot.date,
        maxCapacity: newCap,
        isBlocked: slot.isBlocked,
        notes: slot.notes || ''
      });

      if (res.success) {
        showToast(`Capacity adjusted to ${newCap} for ${slot.eventType} on ${slot.date}`);
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update capacity', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Quick Toggle Block / Unblock
  const handleToggleBlock = async (slot) => {
    const willBlock = !slot.isBlocked;
    try {
      setActionLoading(true);
      const res = await api.setSlotCapacity({
        eventType: slot.eventType,
        date: slot.date,
        maxCapacity: slot.maxCapacity,
        isBlocked: willBlock,
        notes: willBlock ? (slot.notes || 'Emergency Admin Blackout') : ''
      });

      if (res.success) {
        showToast(
          willBlock
            ? `⛔ Date ${slot.date} (${slot.eventType}) is now BLOCKED from bookings.`
            : `✅ Date ${slot.date} (${slot.eventType}) has been UNBLOCKED.`
        );
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle block status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Configure Modal
  const openCreateModal = () => {
    setModalFormData({
      eventType: 'Wedding',
      date: new Date().toISOString().split('T')[0],
      maxCapacity: 3,
      isBlocked: false,
      notes: ''
    });
    setIsConfigModalOpen(true);
  };

  const openEditModal = (slot) => {
    setModalFormData({
      id: slot._id,
      eventType: slot.eventType,
      date: slot.date,
      maxCapacity: slot.maxCapacity,
      isBlocked: Boolean(slot.isBlocked),
      notes: slot.notes || ''
    });
    setIsConfigModalOpen(true);
  };

  // Save Modal Form
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.setSlotCapacity({
        eventType: modalFormData.eventType,
        date: modalFormData.date,
        maxCapacity: Number(modalFormData.maxCapacity),
        isBlocked: modalFormData.isBlocked,
        notes: modalFormData.notes
      });

      if (res.success) {
        showToast(`Slot configuration saved for ${modalFormData.eventType} on ${modalFormData.date}`);
        setIsConfigModalOpen(false);
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save slot', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete / Reset Slot Override
  const handleDeleteSlot = async (slot) => {
    const msg = slot.bookedCount > 0
      ? `This slot on ${slot.date} has ${slot.bookedCount} active booking(s). Resetting will restore standard capacity (3) and unblock it. Proceed?`
      : `Are you sure you want to remove custom rule for ${slot.eventType} on ${slot.date}? It will revert to system defaults.`;

    if (!window.confirm(msg)) return;

    try {
      setActionLoading(true);
      const res = await api.deleteSlot(slot._id);
      if (res.success) {
        showToast(res.message || 'Slot configuration removed');
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete slot configuration', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Inspect Bookings for a Slot
  const handleInspectBookings = async (slot) => {
    setSelectedSlotForBookings(slot);
    setBookingsLoading(true);
    try {
      const res = await api.getSlotBookings(slot._id);
      if (res.success) {
        setSlotBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load slot bookings:', err);
      // Fallback: search all bookings for this event and date
      try {
        const bRes = await api.getAllBookings({
          eventType: slot.eventType,
          date: slot.date
        });
        if (bRes.success) {
          setSlotBookings(bRes.bookings || []);
        }
      } catch (e) {
        setSlotBookings([]);
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  // Bulk Apply Rules
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (bulkData.selectedCategories.length === 0) {
      showToast('Please select at least one event category', 'error');
      return;
    }

    if (new Date(bulkData.startDate) > new Date(bulkData.endDate)) {
      showToast('Start date cannot be after end date', 'error');
      return;
    }

    setBulkSubmitting(true);
    try {
      const res = await api.bulkSetSlotCapacity({
        startDate: bulkData.startDate,
        endDate: bulkData.endDate,
        eventTypes: bulkData.selectedCategories,
        maxCapacity: Number(bulkData.maxCapacity),
        isBlocked: bulkData.isBlocked,
        notes: bulkData.notes
      });

      if (res.success) {
        showToast(res.message || 'Bulk slot capacity rule applied successfully!');
        loadData();
        setActiveTab('table');
      }
    } catch (err) {
      showToast(err.message || 'Failed to apply bulk slot rules', 'error');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // Export slots as CSV
  const exportCSV = () => {
    if (slots.length === 0) {
      showToast('No slot records to export', 'error');
      return;
    }

    const headers = ['Event Category', 'Date', 'Max Capacity', 'Booked Count', 'Remaining Slots', 'Status', 'Is Blocked', 'Admin Notes'];
    const rows = sortedSlots.map(s => {
      const remaining = Math.max(0, s.maxCapacity - s.bookedCount);
      return [
        `"${s.eventType}"`,
        `"${s.date}"`,
        s.maxCapacity,
        s.bookedCount,
        remaining,
        `"${s.status}"`,
        s.isBlocked ? 'YES' : 'NO',
        `"${(s.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Eventora_Slot_Capacity_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Slot capacity schedule successfully exported to CSV!');
  };

  // Sorted & Filtered Slots
  const sortedSlots = useMemo(() => {
    return [...slots].sort((a, b) => {
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
      if (sortBy === 'booked-desc') return b.bookedCount - a.bookedCount;
      if (sortBy === 'capacity-desc') return b.maxCapacity - a.maxCapacity;
      return 0;
    });
  }, [slots, sortBy]);

  // Paginated slots
  const totalPages = Math.ceil(sortedSlots.length / itemsPerPage) || 1;
  const paginatedSlots = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedSlots.slice(start, start + itemsPerPage);
  }, [sortedSlots, currentPage, itemsPerPage]);

  // Calendar generation helpers
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth(); // 0-indexed
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ...
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Convert Sunday=0 to Monday=0 indexing for European/standard business layout
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days = [];
    // Padding before 1st of month
    for (let i = 0; i < offset; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;

      // Find slot configuration for selected category on this date
      const slot = slots.find(s => s.date === dateStr && (calendarEventCategory === 'All' ? true : s.eventType === calendarEventCategory));
      
      days.push({
        empty: false,
        dayNumber: d,
        dateStr,
        slot,
        key: dateStr
      });
    }

    return days;
  }, [calendarDate, slots, calendarEventCategory]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', color: '#0f172a' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '14px 22px',
          borderRadius: '16px',
          background: toast.type === 'error' ? '#fef2f2' : '#ecfdf5',
          border: `1.5px solid ${toast.type === 'error' ? '#fecaca' : '#a7f3d0'}`,
          color: toast.type === 'error' ? '#991b1b' : '#065f46',
          fontWeight: '700',
          fontSize: '0.9rem',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease'
        }}>
          {toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', background: '#ede9fe', color: '#7c3aed', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>High-Precision Overbooking Guard</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Slot & Capacity Management
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '4px', maxWidth: '640px' }}>
            Enforce real-time concurrent event limits, prevent double-bookings, configure emergency blackout dates, and adjust seasonal capacities across all celebration venues.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} />
            <span>Configure Slot</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sliders size={16} style={{ color: '#7c3aed' }} />
            <span>Bulk Rule Configurator</span>
          </button>

          <button
            onClick={exportCSV}
            className="btn-secondary"
            style={{ padding: '10px 14px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Download CSV report"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadData}
            className="btn-secondary"
            style={{ padding: '10px 14px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Reload from MongoDB"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI ANALYTICS CARDS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '18px',
        marginBottom: '30px'
      }}>
        {/* Total Configured Dates */}
        <div className="card-white" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Tracked Slots</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a' }}>
            {stats?.totalSlots ?? slots.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Active database records
          </div>
        </div>

        {/* Available Dates */}
        <div className="card-white" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Open / Available</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#047857' }}>
            {stats?.availableSlots ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span className="pulse-dot available" />
            <span>Accepting bookings</span>
          </div>
        </div>

        {/* Limited / Near Capacity */}
        <div className="card-white" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Limited (1 Spot Left)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#b45309' }}>
            {stats?.limitedSlots ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
            <span className="pulse-dot limited" />
            <span>High demand surge</span>
          </div>
        </div>

        {/* Fully Booked */}
        <div className="card-white" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Fully Booked</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#b91c1c' }}>
            {stats?.fullyBookedSlots ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '2px' }}>
            Locked (100% full)
          </div>
        </div>

        {/* Blocked / Blackouts */}
        <div className="card-white" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Blocked / Blackout</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#334155' }}>
            {stats?.blockedSlots ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Admin restricted dates
          </div>
        </div>

        {/* Total Bookings Scheduled */}
        <div className="card-white" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>Total Booked</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1d4ed8' }}>
            {stats?.totalBooked ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '2px' }}>
            Total event reservations
          </div>
        </div>
      </div>

      {/* VIEW SELECTOR TABS & NAVIGATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '6px',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: '800',
              background: activeTab === 'table' ? '#7c3aed' : 'transparent',
              color: activeTab === 'table' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'table' ? '0 4px 14px rgba(124, 58, 237, 0.3)' : 'none'
            }}
          >
            <Layers size={17} />
            <span>Table & Capacity Meter</span>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 7px',
              borderRadius: '999px',
              background: activeTab === 'table' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
              color: activeTab === 'table' ? '#ffffff' : '#475569'
            }}>
              {sortedSlots.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: '800',
              background: activeTab === 'calendar' ? '#7c3aed' : 'transparent',
              color: activeTab === 'calendar' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'calendar' ? '0 4px 14px rgba(124, 58, 237, 0.3)' : 'none'
            }}
          >
            <CalendarDays size={17} />
            <span>Interactive Month Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: '800',
              background: activeTab === 'bulk' ? '#7c3aed' : 'transparent',
              color: activeTab === 'bulk' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'bulk' ? '0 4px 14px rgba(124, 58, 237, 0.3)' : 'none'
            }}
          >
            <Sliders size={17} />
            <span>Seasonal & Bulk Config</span>
          </button>
        </div>

        {/* Current status summary pill */}
        <div style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>Real-time DB synchronization active</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TABLE & CAPACITY METER VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'table' && (
        <div>
          {/* SEARCH & FILTERS BAR */}
          <div className="card-white" style={{ padding: '18px 22px', marginBottom: '22px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Left side filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: '1 1 540px' }}>
              {/* Search input */}
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search date (YYYY-MM), category, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
                />
              </div>

              {/* Event Category Filter */}
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '9px 12px', fontSize: '0.86rem' }}
              >
                <option value="All">All Event Categories</option>
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '9px 12px', fontSize: '0.86rem' }}
              >
                <option value="All">All Live Statuses</option>
                <option value="Available">Available (🟢)</option>
                <option value="Limited">Limited - 1 Left (🟡)</option>
                <option value="Fully Booked">Fully Booked (🔴)</option>
                <option value="Blocked">Blocked / Blackout (⛔)</option>
              </select>

              {/* Date Presets */}
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '9px 12px', fontSize: '0.86rem' }}
              >
                <option value="all">All Dates</option>
                <option value="upcoming7">Upcoming 7 Days</option>
                <option value="upcoming30">Upcoming 30 Days</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>

            {/* Right side sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="date-asc">Date (Earliest First)</option>
                <option value="date-desc">Date (Latest First)</option>
                <option value="booked-desc">Most Booked Count</option>
                <option value="capacity-desc">Highest Capacity</option>
              </select>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="card-white" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
            {loading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <div className="pulse-dot available" style={{ width: '14px', height: '14px', marginBottom: '14px' }} />
                <p style={{ fontWeight: '700' }}>Synchronizing slots from database...</p>
              </div>
            ) : sortedSlots.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Calendar size={44} style={{ color: '#cbd5e1', margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>No slot configurations match your filter</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px', maxWidth: '460px', margin: '4px auto 18px auto' }}>
                  Try changing your filter settings or create a new slot capacity rule to establish custom limits.
                </p>
                <button
                  onClick={openCreateModal}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <Plus size={15} />
                  <span>Configure New Slot</span>
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    <tr>
                      <th style={{ padding: '16px 20px' }}>Event Category</th>
                      <th style={{ padding: '16px 20px' }}>Target Date</th>
                      <th style={{ padding: '16px 20px' }}>Capacity Meter</th>
                      <th style={{ padding: '16px 20px' }}>Slots Left</th>
                      <th style={{ padding: '16px 20px' }}>Live Status</th>
                      <th style={{ padding: '16px 20px' }}>Notes / Reason</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions & Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSlots.map((s) => {
                      const isBlocked = Boolean(s.isBlocked);
                      const remaining = isBlocked ? 0 : Math.max(0, s.maxCapacity - s.bookedCount);
                      const isFull = s.bookedCount >= s.maxCapacity;
                      const percentage = Math.min(100, Math.round((s.bookedCount / s.maxCapacity) * 100));

                      // Friendly relative date format
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isToday = s.date === todayStr;

                      return (
                        <tr
                          key={s._id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: isBlocked ? '#fafafa' : isToday ? '#faf5ff' : 'transparent',
                            transition: 'background 0.15s'
                          }}
                        >
                          {/* Event Category */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.92rem' }}>
                              {s.eventType}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              ID: {s._id.substring(s._id.length - 6)}
                            </span>
                          </td>

                          {/* Target Date */}
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={15} style={{ color: '#7c3aed' }} />
                              <span style={{ fontWeight: '700', color: '#1e293b' }}>{s.date}</span>
                              {isToday && (
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '1px 6px', borderRadius: '6px', background: '#ede9fe', color: '#7c3aed' }}>
                                  TODAY
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                              {(() => {
                                try {
                                  return new Date(s.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
                                } catch (e) {
                                  return s.date;
                                }
                              })()}
                            </div>
                          </td>

                          {/* Capacity Meter */}
                          <td style={{ padding: '16px 20px', minWidth: '190px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                                {s.bookedCount} / {s.maxCapacity} Booked
                              </span>
                              <span style={{ fontSize: '0.76rem', fontWeight: '700', color: isBlocked ? '#64748b' : isFull ? '#ef4444' : '#10b981' }}>
                                {isBlocked ? 'Blocked' : `${percentage}%`}
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                              <div style={{
                                width: isBlocked ? '100%' : `${percentage}%`,
                                height: '100%',
                                background: isBlocked
                                  ? 'repeating-linear-gradient(45deg, #64748b, #64748b 6px, #475569 6px, #475569 12px)'
                                  : isFull
                                  ? '#ef4444'
                                  : s.status === 'Limited'
                                  ? '#f59e0b'
                                  : '#10b981',
                                borderRadius: '999px',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </td>

                          {/* Remaining Slots */}
                          <td style={{ padding: '16px 20px' }}>
                            {isBlocked ? (
                              <span style={{ fontWeight: '800', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Lock size={13} />
                                <span>Closed</span>
                              </span>
                            ) : (
                              <span style={{
                                fontWeight: '800',
                                color: remaining > 0 ? (remaining === 1 ? '#d97706' : '#059669') : '#dc2626'
                              }}>
                                {remaining} Spot{remaining !== 1 ? 's' : ''} Left
                              </span>
                            )}
                          </td>

                          {/* Live Status Pill */}
                          <td style={{ padding: '16px 20px' }}>
                            {isBlocked ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                borderRadius: '999px',
                                fontSize: '0.76rem',
                                fontWeight: '800',
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #cbd5e1'
                              }}>
                                <Lock size={12} />
                                <span>Blackout / Closed</span>
                              </span>
                            ) : s.status === 'Fully Booked' ? (
                              <span className="badge-booked">
                                <span className="pulse-dot booked" />
                                <span>Fully Booked</span>
                              </span>
                            ) : s.status === 'Limited' ? (
                              <span className="badge-limited">
                                <span className="pulse-dot limited" />
                                <span>Limited (1 Left)</span>
                              </span>
                            ) : (
                              <span className="badge-available">
                                <span className="pulse-dot available" />
                                <span>Available</span>
                              </span>
                            )}
                          </td>

                          {/* Notes / Reason */}
                          <td style={{ padding: '16px 20px', maxWidth: '220px' }}>
                            <div style={{ fontSize: '0.82rem', color: s.notes ? '#334155' : '#94a3b8', fontStyle: s.notes ? 'normal' : 'italic' }}>
                              {s.notes || 'Standard slot capacity'}
                            </div>
                          </td>

                          {/* Actions & Controls */}
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              
                              {/* Quick Capacity Stepper */}
                              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#ffffff' }}>
                                <button
                                  onClick={() => handleCapacityQuickAdjust(s, -1)}
                                  disabled={actionLoading || s.maxCapacity <= 1 || s.maxCapacity <= s.bookedCount}
                                  style={{ padding: '5px 8px', color: '#475569', background: '#f8fafc', borderRight: '1px solid #e2e8f0', cursor: 'pointer' }}
                                  title="Decrease maximum capacity by 1"
                                >
                                  <Minus size={13} />
                                </button>
                                <span style={{ padding: '0 8px', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>
                                  {s.maxCapacity}
                                </span>
                                <button
                                  onClick={() => handleCapacityQuickAdjust(s, 1)}
                                  disabled={actionLoading || s.maxCapacity >= 50}
                                  style={{ padding: '5px 8px', color: '#7c3aed', background: '#f8fafc', borderLeft: '1px solid #e2e8f0', cursor: 'pointer' }}
                                  title="Increase maximum capacity by 1"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>

                              {/* Toggle Block Button */}
                              <button
                                onClick={() => handleToggleBlock(s)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  border: isBlocked ? '1px solid #cbd5e1' : '1px solid #fecaca',
                                  background: isBlocked ? '#ffffff' : '#fef2f2',
                                  color: isBlocked ? '#334155' : '#b91c1c',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title={isBlocked ? 'Click to unblock date' : 'Emergency blackout: block bookings on this date'}
                              >
                                {isBlocked ? <Unlock size={13} /> : <Lock size={13} />}
                                <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                              </button>

                              {/* Inspect Bookings Button */}
                              <button
                                onClick={() => handleInspectBookings(s)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#334155',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="View active customer reservations for this date"
                              >
                                <Users size={13} style={{ color: '#7c3aed' }} />
                                <span>{s.bookedCount} Bookings</span>
                              </button>

                              {/* Edit Modal Button */}
                              <button
                                onClick={() => openEditModal(s)}
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  background: '#ffffff',
                                  color: '#475569'
                                }}
                                title="Edit slot settings & notes"
                              >
                                <Edit3 size={14} />
                              </button>

                              {/* Delete / Reset Button */}
                              <button
                                onClick={() => handleDeleteSlot(s)}
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: '8px',
                                  border: '1px solid #fee2e2',
                                  background: '#fff5f5',
                                  color: '#ef4444'
                                }}
                                title="Reset to standard defaults or delete rule"
                              >
                                <Trash2 size={14} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {sortedSlots.length > itemsPerPage && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Showing <strong style={{ color: '#0f172a' }}>{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong style={{ color: '#0f172a' }}>{Math.min(currentPage * itemsPerPage, sortedSlots.length)}</strong> of <strong style={{ color: '#0f172a' }}>{sortedSlots.length}</strong> configured slot dates
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed', padding: '0 8px' }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE MONTH CALENDAR GRID VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div>
          {/* Calendar Controls Bar */}
          <div className="card-white" style={{ padding: '18px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Month & Year Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  const d = new Date(calendarDate);
                  d.setMonth(d.getMonth() - 1);
                  setCalendarDate(d);
                }}
                className="btn-secondary"
                style={{ padding: '8px 12px' }}
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>

              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', minWidth: '220px', textAlign: 'center' }}>
                {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>

              <button
                onClick={() => {
                  const d = new Date(calendarDate);
                  d.setMonth(d.getMonth() + 1);
                  setCalendarDate(d);
                }}
                className="btn-secondary"
                style={{ padding: '8px 12px' }}
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>

              <button
                onClick={() => setCalendarDate(new Date())}
                style={{ padding: '8px 14px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', border: '1px solid #ddd6fe', fontSize: '0.82rem', fontWeight: '800' }}
              >
                Today
              </button>
            </div>

            {/* Category Filter for Calendar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                View Category Availability:
              </span>
              <select
                value={calendarEventCategory}
                onChange={(e) => setCalendarEventCategory(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '8px 14px', fontWeight: '700' }}
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', fontWeight: '700' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span>Limited</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span>Full</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#475569' }} />
                <span>Blocked</span>
              </div>
            </div>

          </div>

          {/* 7-COL CALENDAR GRID CARD */}
          <div className="card-white" style={{ padding: '24px', borderRadius: '22px' }}>
            
            {/* Week Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '14px', textAlign: 'center' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ fontSize: '0.82rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
              {calendarDays.map((item, idx) => {
                if (item.empty) {
                  return (
                    <div
                      key={item.key}
                      style={{
                        minHeight: '115px',
                        borderRadius: '14px',
                        background: '#f8fafc',
                        border: '1px dashed #e2e8f0',
                        opacity: 0.4
                      }}
                    />
                  );
                }

                const s = item.slot;
                const isBlocked = s ? Boolean(s.isBlocked) : false;
                const booked = s ? s.bookedCount : 0;
                const maxCap = s ? s.maxCapacity : 3;
                const remaining = isBlocked ? 0 : Math.max(0, maxCap - booked);
                const isFull = booked >= maxCap;
                const status = isBlocked ? 'Blocked' : s ? s.status : (remaining === 0 ? 'Fully Booked' : remaining === 1 ? 'Limited' : 'Available');

                const isToday = item.dateStr === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      if (s) {
                        openEditModal(s);
                      } else {
                        setModalFormData({
                          eventType: calendarEventCategory,
                          date: item.dateStr,
                          maxCapacity: 3,
                          isBlocked: false,
                          notes: ''
                        });
                        setIsConfigModalOpen(true);
                      }
                    }}
                    style={{
                      minHeight: '120px',
                      borderRadius: '16px',
                      padding: '12px',
                      background: isBlocked
                        ? '#fafafa'
                        : isToday
                        ? '#faf5ff'
                        : '#ffffff',
                      border: isToday
                        ? '2px solid #7c3aed'
                        : isBlocked
                        ? '1.5px solid #cbd5e1'
                        : '1.5px solid #e2e8f0',
                      boxShadow: 'var(--shadow-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      e.currentTarget.style.borderColor = '#a78bfa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                      e.currentTarget.style.borderColor = isToday ? '#7c3aed' : isBlocked ? '#cbd5e1' : '#e2e8f0';
                    }}
                  >
                    {/* Top: Day Number & Status Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: '900',
                        color: isToday ? '#7c3aed' : '#0f172a',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isToday ? '#ede9fe' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.dayNumber}
                      </span>

                      {/* Small badge */}
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        background: isBlocked ? '#f1f5f9' : isFull ? '#fef2f2' : status === 'Limited' ? '#fffbeb' : '#ecfdf5',
                        color: isBlocked ? '#475569' : isFull ? '#b91c1c' : status === 'Limited' ? '#b45309' : '#047857'
                      }}>
                        {isBlocked ? 'Blocked' : status}
                      </span>
                    </div>

                    {/* Middle: Capacity Visual Bar */}
                    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>
                        <span>Capacity:</span>
                        <strong style={{ color: '#0f172a' }}>{booked} / {maxCap}</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: isBlocked ? '100%' : `${Math.min(100, (booked / maxCap) * 100)}%`,
                          height: '100%',
                          background: isBlocked ? '#64748b' : isFull ? '#ef4444' : status === 'Limited' ? '#f59e0b' : '#10b981'
                        }} />
                      </div>
                    </div>

                    {/* Bottom: Action hint */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                      <span style={{ color: isBlocked ? '#dc2626' : remaining > 0 ? '#059669' : '#dc2626', fontWeight: '800' }}>
                        {isBlocked ? '⛔ Closed' : `${remaining} left`}
                      </span>

                      <span style={{ color: '#7c3aed', fontWeight: '700' }}>
                        Edit ↗
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SEASONAL & BULK CAPACITY CONFIGURATOR */}
      {/* ========================================================================= */}
      {activeTab === 'bulk' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 460px) 1fr', gap: '28px', alignItems: 'start' }} className="admin-slot-grid">
          
          {/* Form Card */}
          <div className="card-white" style={{ padding: '30px', borderRadius: '22px' }}>
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: '#ede9fe', color: '#7c3aed', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px' }}>
                <Sliders size={14} />
                <span>Multi-Day Batch Control</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a' }}>
                Bulk Seasonal Capacity Rule
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Quickly scale capacity for peak festival wedding months or establish seasonal blackout dates across multiple categories at once.
              </p>
            </div>

            <form onSubmit={handleBulkSubmit}>
              
              {/* Date Range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '800' }}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={bulkData.startDate}
                    onChange={(e) => setBulkData({ ...bulkData, startDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '800' }}>End Date</label>
                  <input
                    type="date"
                    required
                    value={bulkData.endDate}
                    onChange={(e) => setBulkData({ ...bulkData, endDate: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Quick Range Presets */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const s = new Date();
                    const e = new Date();
                    e.setDate(e.getDate() + 7);
                    setBulkData({
                      ...bulkData,
                      startDate: s.toISOString().split('T')[0],
                      endDate: e.toISOString().split('T')[0]
                    });
                  }}
                  style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}
                >
                  Next 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const s = new Date();
                    const e = new Date();
                    e.setDate(e.getDate() + 30);
                    setBulkData({
                      ...bulkData,
                      startDate: s.toISOString().split('T')[0],
                      endDate: e.toISOString().split('T')[0]
                    });
                  }}
                  style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}
                >
                  Next 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const s = new Date();
                    s.setMonth(s.getMonth() + 1, 1);
                    const e = new Date(s.getFullYear(), s.getMonth() + 1, 0);
                    setBulkData({
                      ...bulkData,
                      startDate: s.toISOString().split('T')[0],
                      endDate: e.toISOString().split('T')[0]
                    });
                  }}
                  style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}
                >
                  Entire Next Month
                </button>
              </div>

              {/* Event Categories Selection */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: '800', marginBottom: 0 }}>Target Categories</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (bulkData.selectedCategories.length === EVENT_TYPES.length) {
                        setBulkData({ ...bulkData, selectedCategories: [] });
                      } else {
                        setBulkData({ ...bulkData, selectedCategories: [...EVENT_TYPES] });
                      }
                    }}
                    style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed' }}
                  >
                    {bulkData.selectedCategories.length === EVENT_TYPES.length ? 'Unselect All' : 'Select All Categories'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '160px', overflowY: 'auto', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                  {EVENT_TYPES.map(cat => {
                    const isChecked = bulkData.selectedCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          fontWeight: isChecked ? '700' : '500',
                          color: isChecked ? '#7c3aed' : '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkData({ ...bulkData, selectedCategories: [...bulkData.selectedCategories, cat] });
                            } else {
                              setBulkData({ ...bulkData, selectedCategories: bulkData.selectedCategories.filter(c => c !== cat) });
                            }
                          }}
                        />
                        <span>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Capacity Input & Presets */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '800' }}>
                  Target Maximum Capacity per Day: <strong style={{ color: '#7c3aed', fontSize: '1.05rem' }}>{bulkData.maxCapacity} Bookings</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={bulkData.maxCapacity}
                  onChange={(e) => setBulkData({ ...bulkData, maxCapacity: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#7c3aed', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 5, 8, 10].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBulkData({ ...bulkData, maxCapacity: val })}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: bulkData.maxCapacity === val ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                        background: bulkData.maxCapacity === val ? '#ede9fe' : '#ffffff',
                        color: bulkData.maxCapacity === val ? '#7c3aed' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: '800'
                      }}
                    >
                      {val} slots
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Blockout Toggle */}
              <div style={{ background: bulkData.isBlocked ? '#fef2f2' : '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: bulkData.isBlocked ? '1.5px solid #fecaca' : '1px solid #e2e8f0', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.88rem', color: bulkData.isBlocked ? '#b91c1c' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={15} style={{ color: bulkData.isBlocked ? '#ef4444' : '#64748b' }} />
                      <span>Emergency Blackout / Block Range</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Completely closes selected dates from customer booking engine
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={bulkData.isBlocked}
                    onChange={(e) => setBulkData({ ...bulkData, isBlocked: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
                  />
                </label>
              </div>

              {/* Admin Notes */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: '800' }}>Admin Notes / Rule Label</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding peak season boost, or Hall deep clean"
                  value={bulkData.notes}
                  onChange={(e) => setBulkData({ ...bulkData, notes: e.target.value })}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={bulkSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                {bulkSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Applying Bulk Rules to Database...</span>
                  </span>
                ) : (
                  <span>Apply Bulk Capacity Configuration</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Preview Card */}
          <div className="card-white" style={{ padding: '30px', borderRadius: '22px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} style={{ color: '#7c3aed' }} />
              <span>Bulk Execution Impact Summary</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ padding: '14px 18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Target Calendar Window:</span>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem', marginTop: '2px' }}>
                  {bulkData.startDate} <span style={{ color: '#7c3aed' }}>➔</span> {bulkData.endDate}
                </div>
              </div>

              <div style={{ padding: '14px 18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Targeted Event Categories ({bulkData.selectedCategories.length}):</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {bulkData.selectedCategories.map(c => (
                    <span key={c} style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: '#ede9fe', color: '#7c3aed' }}>
                      {c}
                    </span>
                  ))}
                  {bulkData.selectedCategories.length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '700' }}>
                      No categories selected yet!
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '14px 18px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Capacity & Blackout Directive:</span>
                <div style={{ fontWeight: '800', color: bulkData.isBlocked ? '#b91c1c' : '#059669', fontSize: '0.95rem', marginTop: '2px' }}>
                  {bulkData.isBlocked ? '⛔ Completely Block / Lock all bookings' : `🟢 Set max concurrent capacity to ${bulkData.maxCapacity} bookings/day`}
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px' }}>
              <ShieldAlert size={22} style={{ color: '#d97706', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: '1.5' }}>
                <strong>Overbooking Safety Guarantee:</strong> If active bookings already exist on any selected date that exceed your new target capacity, the system preserves existing customer reservations and recalculates the status to Fully Booked to guarantee zero data loss.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SINGLE SLOT CONFIGURE / EDIT MODAL */}
      {/* ========================================================================= */}
      {isConfigModalOpen && (
        <div className="modal-overlay" onClick={() => setIsConfigModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '32px', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '22px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Slot Capacity Directive
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a' }}>
                  {modalFormData.id ? 'Modify Slot Capacity' : 'Configure New Date Slot'}
                </h3>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                style={{ padding: '6px', borderRadius: '8px', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '800' }}>Event Category</label>
                <select
                  value={modalFormData.eventType}
                  onChange={(e) => setModalFormData({ ...modalFormData, eventType: e.target.value })}
                  className="form-input"
                  style={{ fontWeight: '700' }}
                >
                  {EVENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '800' }}>Celebration Date</label>
                <input
                  type="date"
                  required
                  value={modalFormData.date}
                  onChange={(e) => setModalFormData({ ...modalFormData, date: e.target.value })}
                  className="form-input"
                  style={{ fontWeight: '800' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontWeight: '800', marginBottom: 0 }}>
                    Maximum Booking Capacity
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#7c3aed' }}>
                    {modalFormData.maxCapacity} Simultaneous Bookings
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={modalFormData.maxCapacity}
                  onChange={(e) => setModalFormData({ ...modalFormData, maxCapacity: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#7c3aed', margin: '12px 0 6px 0' }}
                />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 5, 8, 10].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setModalFormData({ ...modalFormData, maxCapacity: val })}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: modalFormData.maxCapacity === val ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                        background: modalFormData.maxCapacity === val ? '#ede9fe' : '#ffffff',
                        color: modalFormData.maxCapacity === val ? '#7c3aed' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: '800'
                      }}
                    >
                      {val} slots
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Blockout Toggle */}
              <div style={{
                background: modalFormData.isBlocked ? '#fef2f2' : '#f8fafc',
                padding: '14px 16px',
                borderRadius: '14px',
                border: modalFormData.isBlocked ? '1.5px solid #fecaca' : '1px solid #e2e8f0',
                marginBottom: '18px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.88rem', color: modalFormData.isBlocked ? '#b91c1c' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={15} style={{ color: modalFormData.isBlocked ? '#ef4444' : '#64748b' }} />
                      <span>Lock & Blackout Date</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Disables customer checkout for this specific day
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={modalFormData.isBlocked}
                    onChange={(e) => setModalFormData({ ...modalFormData, isBlocked: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
                  />
                </label>
              </div>

              {/* Notes */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: '800' }}>Admin Notes (Internal Reason)</label>
                <input
                  type="text"
                  placeholder="e.g. VIP reservation inquiry, Venue maintenance..."
                  value={modalFormData.notes}
                  onChange={(e) => setModalFormData({ ...modalFormData, notes: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn-primary"
                  style={{ padding: '10px 22px' }}
                >
                  {actionLoading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SLOT BOOKINGS INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {selectedSlotForBookings && (
        <div className="modal-overlay" onClick={() => setSelectedSlotForBookings(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', padding: '32px', borderRadius: '24px' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Slot Capacity Inspection
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>
                  {selectedSlotForBookings.eventType} on {selectedSlotForBookings.date}
                </h3>
              </div>
              <button onClick={() => setSelectedSlotForBookings(null)} style={{ padding: '6px', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Quick Capacity Status Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '14px 18px', borderRadius: '16px', marginBottom: '22px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Enforced Capacity:</span>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem', marginTop: '2px' }}>
                  {selectedSlotForBookings.bookedCount} / {selectedSlotForBookings.maxCapacity} Booked
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Slot Status:</span>
                <div style={{ marginTop: '2px' }}>
                  {selectedSlotForBookings.isBlocked ? (
                    <span style={{ padding: '4px 10px', borderRadius: '999px', background: '#f1f5f9', color: '#475569', fontSize: '0.78rem', fontWeight: '800' }}>
                      ⛔ Blocked
                    </span>
                  ) : (
                    <span className={`badge-${selectedSlotForBookings.status === 'Fully Booked' ? 'booked' : selectedSlotForBookings.status === 'Limited' ? 'limited' : 'available'}`}>
                      {selectedSlotForBookings.status}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Remaining:</span>
                <div style={{ fontWeight: '800', color: '#059669', fontSize: '1.05rem', marginTop: '2px' }}>
                  {Math.max(0, selectedSlotForBookings.maxCapacity - selectedSlotForBookings.bookedCount)} Left
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} style={{ color: '#7c3aed' }} />
                <span>Active Customer Bookings for this Slot ({slotBookings.length})</span>
              </h4>

              {bookingsLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  Loading reservations...
                </div>
              ) : slotBookings.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                  <CalendarCheck size={32} style={{ color: '#94a3b8', margin: '0 auto 8px auto' }} />
                  <p style={{ fontWeight: '700', color: '#334155' }}>No customer bookings recorded on this date yet.</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    This slot has full remaining capacity for incoming customer inquiries.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                  {slotBookings.map((b) => (
                    <div
                      key={b._id}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '14px',
                        background: '#ffffff',
                        border: '1.5px solid #f1f5f9',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#7c3aed', fontSize: '0.88rem' }}>{b.bookingId}</strong>
                          <span style={{ fontWeight: '800', color: '#0f172a' }}>{b.customer?.name}</span>
                          <span className={`status-pill ${b.status}`}>{b.status}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                          Package: <strong>{b.package?.name}</strong> • Guests: {b.guestCount} • Phone: {b.customer?.phone}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a' }}>
                          ₹{b.totalAmount?.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '800' }}>
                          {b.paymentStatus || 'Verified'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedSlotForBookings(null)}
                className="btn-primary"
                style={{ padding: '8px 22px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES FOR RESPONSIVENESS & ANIMATIONS */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 900px) {
          .admin-slot-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
