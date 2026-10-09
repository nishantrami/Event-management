import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerAuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const { customerLogin, customerRegister } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await customerLogin(formData.email, formData.password);
        if (res.success) {
          setSuccessMsg('Logged in successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 600);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const res = await customerRegister(formData);
        if (res.success) {
          setSuccessMsg('Account registered successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 600);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ padding: '32px', position: 'relative' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? '#7c3aed' : '#64748b',
              boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Customer Login
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: '700',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? '#7c3aed' : '#64748b',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
            {mode === 'login' ? 'Welcome Back to Eventora' : 'Register Customer Account'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            {mode === 'login' 
              ? 'Access your booking history and confirm your event reservation.' 
              : 'Sign up to lock in your event date and track arrangements.'}
          </p>
        </div>

        {/* Error / Success alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#b91c1c',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#047857',
            marginBottom: '16px'
          }}>
            <CheckCircle size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '0.95rem' }}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In to Proceed' : 'Create My Account')}
          </button>
        </form>



      </div>
    </div>
  );
}
