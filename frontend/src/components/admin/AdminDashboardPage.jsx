import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee,
  Layers,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { api } from '../../services/api';

const COLORS = ['#7c3aed', '#d97706', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminDashboardStats();
        if (res.success) {
          setStats(res.stats);
          setCharts(res.charts);
          setRecentBookings(res.recentBookings || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
        <div className="pulse-dot available" style={{ width: '14px', height: '14px', marginBottom: '12px' }} />
        <p style={{ fontWeight: '600' }}>Loading executive dashboard metrics from MongoDB...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'Verified confirmed bookings',
      icon: IndianRupee,
      color: '#7c3aed',
      bg: '#ede9fe'
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      sub: `${stats?.todaysBookings || 0} today`,
      icon: CalendarDays,
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    {
      title: 'Registered Customers',
      value: stats?.totalCustomers || 0,
      sub: 'Stored in MongoDB',
      icon: Users,
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      sub: 'Scheduled celebrations',
      icon: Clock,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      title: 'Available Slots',
      value: stats?.availableSlots || 0,
      sub: 'Open calendar dates',
      icon: CheckCircle,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      title: 'Fully Booked Dates',
      value: stats?.fullyBookedSlots || 0,
      sub: 'Capacity locked (3/3 max)',
      icon: XCircle,
      color: '#ef4444',
      bg: '#fef2f2'
    }
  ];

  const hasMonthlyCharts = charts?.monthly && charts.monthly.length > 0;
  const hasCategoryCharts = charts?.categoryDistribution && charts.categoryDistribution.length > 0;
  const hasPackageCharts = charts?.packagePopularity && charts.packagePopularity.length > 0;

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
          Executive Overview & Analytics
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
          Live metrics from MongoDB collections and capacity enforcement engine
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="card-white"
              style={{
                padding: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderRadius: '20px'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: kpi.bg,
                color: kpi.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>
                  {kpi.title}
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>
                  {kpi.value}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {kpi.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        
        {/* Monthly Revenue Trends */}
        <div className="card-white" style={{ padding: '26px', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Monthly Event Bookings & Revenue
          </h3>
          <div style={{ height: '280px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasMonthlyCharts ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                <CalendarDays size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>No monthly booking revenue data recorded in database yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Category Distribution */}
        <div className="card-white" style={{ padding: '26px', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Event Category Distribution
          </h3>
          <div style={{ height: '280px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasCategoryCharts ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                <Layers size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>No category distribution data recorded in database yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Package Popularity and Recent Bookings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px'
      }} className="admin-bottom-grid">
        
        {/* Package Popularity */}
        <div className="card-white" style={{ padding: '26px', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Package Popularity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {hasPackageCharts ? (
              charts.packagePopularity.map((pkg, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', color: '#0f172a' }}>{pkg.name} Package</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>{pkg.value} Bookings</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Total Revenue: ₹{(pkg.revenue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 0', fontSize: '0.88rem' }}>
                No package bookings recorded in database yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="card-white" style={{ padding: '26px', borderRadius: '22px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Recent Customer Bookings
          </h3>
          <div style={{ overflowX: 'auto' }}>
            {recentBookings.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800' }}>
                    <th style={{ padding: '10px 12px' }}>ID</th>
                    <th style={{ padding: '10px 12px' }}>Customer</th>
                    <th style={{ padding: '10px 12px' }}>Event & Date</th>
                    <th style={{ padding: '10px 12px' }}>Amount</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', fontWeight: '800', color: '#7c3aed' }}>{b.bookingId}</td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{b.customer?.name}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '700' }}>{b.eventType}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.eventDate}</div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '800' }}>₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-pill ${b.status}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '36px 0', fontSize: '0.9rem' }}>
                <Calendar size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>No customer bookings recorded in MongoDB yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .admin-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
