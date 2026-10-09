import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Layers, 
  UtensilsCrossed, 
  Users, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, isAdminLoggedIn, adminLogout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Route protection
  if (!isAdminLoggedIn) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Executive Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings Management', path: '/admin/bookings', icon: CalendarDays },
    { label: 'Slot Capacity Guard', path: '/admin/slots', icon: Layers },
    { label: 'Services & Marketplace', path: '/admin/services', icon: UtensilsCrossed },
    { label: 'Registered Customers', path: '/admin/customers', icon: Users }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
      
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
          className="show-mobile-only"
        />
      )}

      {/* ADMIN SIDEBAR (SLIDBAR) */}
      <aside 
        style={{
          width: '270px',
          background: '#090d16',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px 18px',
          flexShrink: 0,
          borderRight: '1px solid #1e293b',
          zIndex: 100,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto'
        }}
        className={mobileSidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-desktop'}
      >
        <div>
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.45)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Sparkles size={22} style={{ color: '#fef08a' }} />
              </div>
              <div>
                <span style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff' }}>
                  EVENT<span style={{ color: '#a78bfa' }}>ORA</span>
                </span>
                <div style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#fbbf24', marginTop: '-2px' }}>
                  Management Console
                </div>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              style={{ color: '#94a3b8', padding: '4px' }}
              className="show-mobile-only"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Section Label */}
          <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginTop: '28px', marginBottom: '12px', paddingLeft: '8px' }}>
            Operations & Data
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '800' : '600',
                    background: isActive ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    boxShadow: isActive ? '0 6px 18px rgba(124, 58, 237, 0.35)' : 'none',
                    border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} style={{ color: isActive ? '#fef08a' : '#a78bfa' }} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={15} style={{ opacity: 0.8 }} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: 'rgba(255,255,255,0.04)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <ExternalLink size={16} style={{ color: '#a78bfa' }} />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 14px',
              borderRadius: '12px',
              color: '#f87171',
              fontSize: '0.88rem',
              fontWeight: '700',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
          >
            <LogOut size={16} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
        <header 
          className="admin-header"
          style={{
            height: '74px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{ padding: '8px', borderRadius: '10px', border: '1.5px solid #e2e8f0', color: '#0f172a', background: '#f8fafc', cursor: 'pointer' }}
              className="show-mobile-only"
              aria-label="Open navigation sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
                Management Portal
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: '999px'
            }}>
              <ShieldCheck size={16} style={{ color: '#7c3aed' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }} className="hidden-mobile">
                {admin?.email || 'admin@eventpro.com'}
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', background: '#ede9fe', color: '#7c3aed' }}>
                SUPERADMIN
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-main" style={{ padding: '36px', flexGrow: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-desktop {
            display: none !important;
          }
          .admin-sidebar-open {
            display: flex !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 270px !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          }
        }
        @media (max-width: 768px) {
          .admin-header {
            padding: 0 16px !important;
            height: 64px !important;
          }
          .admin-main {
            padding: 20px 16px !important;
          }
        }
      `}</style>

    </div>
  );
}
