import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight,
  Phone,
  Mail,
  Layers,
  UtensilsCrossed,
  Gem,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { customer, isCustomerLoggedIn, customerLogout, isAdminLoggedIn } = useAuth();
  const { selectedPackage, selectedServices, selectedPreOrders, calculations } = useBooking();

  const totalSelections = (selectedPackage ? 1 : 0) + selectedServices.length + selectedPreOrders.length;

  // Auto-close drawers & dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener for desktop user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    customerLogout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Compass, sub: 'Showcase & Overview' },
    { label: 'Events', path: '/events', icon: Gem, sub: '10 Signature Formats' },
    { label: 'Plan & Book', path: '/book', icon: Sparkles, sub: '5-Step Event Builder', highlight: true },
    { label: 'Services', path: '/services', icon: UtensilsCrossed, sub: 'Decor, Mandap & Catering' },
    { label: 'Packages', path: '/packages', icon: Layers, sub: 'Transparent Tiered Pricing' }
  ];

  return (
    <>
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid #e2e8f0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{ 
          maxWidth: '1560px', 
          margin: '0 auto', 
          padding: '0 20px', 
          height: '74px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '10px' 
        }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flexShrink: 0
            }}>
              <Sparkles size={20} style={{ color: '#fef08a' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '1.38rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#0f172a' }}>
                  EVENT<span style={{ color: '#7c3aed' }}>ORA</span>
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', display: 'inline-block' }}></span>
              </div>
              <div className="hide-on-xs" style={{ fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.3px', color: '#d97706', marginTop: '-3px' }}>
                Luxury Celebrations
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (>1040px) */}
          <nav className="nav-desktop-links" style={{ alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  style={{ 
                    fontSize: '0.92rem', 
                    fontWeight: active ? '800' : '600', 
                    color: active ? '#7c3aed' : '#334155',
                    padding: '0 16px',
                    height: '40px',
                    borderRadius: '12px',
                    background: active ? '#ede9fe' : 'transparent',
                    border: active ? '1.5px solid #ddd6fe' : '1.5px solid transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {isCustomerLoggedIn && (
              <Link 
                to="/my-bookings" 
                style={{ 
                  fontSize: '0.92rem', 
                  fontWeight: isActive('/my-bookings') ? '800' : '600', 
                  color: isActive('/my-bookings') ? '#7c3aed' : '#334155',
                  padding: '0 16px',
                  height: '40px',
                  borderRadius: '12px',
                  background: isActive('/my-bookings') ? '#ede9fe' : 'transparent',
                  border: isActive('/my-bookings') ? '1.5px solid #ddd6fe' : '1.5px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box'
                }}
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            
            {/* Active Booking Cart Pill */}
            <Link 
              to="/cart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '0 12px',
                height: '40px',
                borderRadius: '9999px',
                background: totalSelections > 0 ? '#f5f3ff' : '#ffffff',
                border: totalSelections > 0 ? '1.5px solid #c4b5fd' : '1.5px solid #e2e8f0',
                color: totalSelections > 0 ? '#6d28d9' : '#475569',
                fontWeight: '700',
                fontSize: '0.86rem',
                boxShadow: totalSelections > 0 ? '0 4px 14px rgba(124, 58, 237, 0.15)' : 'var(--shadow-xs)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="View Event Booking Summary & Cart"
            >
              <ShoppingBag size={17} style={{ color: '#7c3aed', flexShrink: 0 }} />
              <span className="nav-cart-text" style={{ fontWeight: '800', color: '#6d28d9' }}>Cart</span>
              <span className="nav-cart-text" style={{ fontWeight: '800', color: '#0f172a' }}>
                ₹{calculations.grandTotal.toLocaleString('en-IN')}
              </span>
              {totalSelections > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  minWidth: '22px',
                  height: '22px',
                  padding: '0 6px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {totalSelections}
                </span>
              )}
            </Link>

            {/* Admin Link (Desktop / Tablet >860px only; mobile accesses via drawer) */}
            <div className="nav-admin-desktop">
              {isAdminLoggedIn ? (
                <Link
                  to="/admin/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '40px',
                    padding: '0 13px',
                    borderRadius: '9999px',
                    background: '#0f172a',
                    color: '#e0e7ff',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={16} style={{ color: '#a5b4fc' }} />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '40px',
                    padding: '0 13px',
                    borderRadius: '9999px',
                    color: '#475569',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  title="Admin Portal Login"
                >
                  <ShieldCheck size={15} style={{ color: '#7c3aed' }} />
                  <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Customer Authentication */}
            {isCustomerLoggedIn ? (
              <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '40px',
                    padding: '0 10px 0 4px',
                    borderRadius: '9999px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    boxShadow: 'var(--shadow-xs)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  title="User Profile & Account"
                  aria-label="User Account Menu"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)',
                    color: '#6d28d9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.88rem',
                    flexShrink: 0
                  }}>
                    {customer?.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="nav-user-name" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>
                    {customer?.name?.split(' ')[0] || 'Customer'}
                  </span>
                  <ChevronDown size={14} style={{ color: '#64748b' }} />
                </button>

                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '240px',
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '8px',
                    zIndex: 120
                  }}>
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{customer?.name}</p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer?.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        fontSize: '0.88rem',
                        color: '#334155',
                        borderRadius: '12px',
                        fontWeight: '600',
                        marginTop: '4px'
                      }}
                    >
                      <Calendar size={16} style={{ color: '#7c3aed' }} />
                      <span>My Bookings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        fontSize: '0.88rem',
                        color: '#ef4444',
                        borderRadius: '12px',
                        fontWeight: '600',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary" 
                style={{ 
                  height: '40px', 
                  padding: '0 14px', 
                  fontSize: '0.86rem', 
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <User size={15} />
                <span className="nav-signin-text">Sign In</span>
              </Link>
            )}

            {/* Mobile & Tablet Hamburger Button Toggle (<=1040px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-toggle"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                color: '#334155',
                background: mobileMenuOpen ? '#ede9fe' : '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={20} style={{ color: '#7c3aed' }} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* LUXURY MOBILE & TABLET SLIDE-OUT DRAWER (Rendered outside header to prevent backdrop-filter containing block constraint) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="mobile-drawer-panel" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  <Sparkles size={18} style={{ color: '#fef08a' }} />
                </div>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>
                    EVENT<span style={{ color: '#7c3aed' }}>ORA</span>
                  </span>
                  <div style={{ fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase', color: '#d97706' }}>
                    Luxury Celebrations
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close navigation drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Customer Account Box */}
              {isCustomerLoggedIn ? (
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)',
                  border: '1px solid #ddd6fe',
                  borderRadius: '16px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.05rem',
                      boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)',
                      flexShrink: 0
                    }}>
                      {customer?.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {customer?.name}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {customer?.email}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Link
                      to="/my-bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#7c3aed',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Calendar size={14} />
                      <span>My Bookings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary"
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <User size={16} />
                    <span>Customer Sign In</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      textAlign: 'center'
                    }}
                  >
                    Create New Account
                  </Link>
                </div>
              )}

              {/* Cart Quick Action Card */}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: '#faf5ff',
                  border: '1.5px solid #d8b4fe',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#7c3aed',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0f172a' }}>
                      Event Cart ({totalSelections})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b21a8' }}>
                      Total: ₹{calculations.grandTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: '#7c3aed' }} />
              </Link>

              {/* Navigation Links */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '8px' }}>
                  Navigation
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          background: active ? '#ede9fe' : 'transparent',
                          border: active ? '1px solid #ddd6fe' : '1px solid transparent',
                          color: active ? '#7c3aed' : '#1e293b',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Icon size={18} style={{ color: active ? '#7c3aed' : '#64748b' }} />
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: active ? '800' : '700' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {item.sub}
                            </div>
                          </div>
                        </div>
                        {item.highlight ? (
                          <span style={{ fontSize: '0.68rem', fontWeight: '800', background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                            BUILDER
                          </span>
                        ) : (
                          <ChevronRight size={16} style={{ color: active ? '#7c3aed' : '#94a3b8' }} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Admin Portal Entry */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <Link
                  to={isAdminLoggedIn ? '/admin/dashboard' : '/admin/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: '#090d16',
                    color: '#f8fafc',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} style={{ color: '#fbbf24' }} />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
                        Admin Portal
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        Executive Management Console
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: '#fbbf24' }} />
                </Link>
              </div>

              {/* Concierge Support Footer in Drawer */}
              <div style={{ marginTop: 'auto', background: '#f8fafc', borderRadius: '14px', padding: '14px', fontSize: '0.8rem', color: '#64748b' }}>
                <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  Luxury Concierge Support
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <Phone size={13} style={{ color: '#7c3aed' }} />
                  <a href="tel:+919876543210" style={{ color: 'inherit', fontWeight: '600' }}>+91 98765 43210</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} style={{ color: '#7c3aed' }} />
                  <a href="mailto:concierge@eventora.luxury" style={{ color: 'inherit' }}>concierge@eventora.luxury</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
