import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState('admin@eventpro.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid static admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin@eventpro.com');
    setPassword('Admin@123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#a5b4fc',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(49, 46, 129, 0.3)'
          }}>
            <ShieldCheck size={28} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
            Eventora Admin Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Executive management console with static credentials
          </p>
        </div>

        {/* Demo credentials hint pill */}
        <div style={{
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '20px',
          fontSize: '0.82rem',
          color: '#475569'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <KeyRound size={14} style={{ color: '#7c3aed' }} />
              Static Project Credentials:
            </strong>
            <button
              type="button"
              onClick={handleFillCredentials}
              style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7c3aed' }}
            >
              Auto-Fill
            </button>
          </div>
          <div>Email: <code style={{ color: '#7c3aed', fontWeight: '700' }}>admin@eventpro.com</code></div>
          <div>Password: <code style={{ color: '#7c3aed', fontWeight: '700' }}>Admin@123</code></div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#b91c1c', marginBottom: '16px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eventpro.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin@123"
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: '#1e1b4b',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(30, 27, 75, 0.3)',
              cursor: 'pointer'
            }}
          >
            <span>{loading ? 'Verifying...' : 'Login to Admin Panel'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: '#64748b' }}>
            ← Return to Eventora Customer Website
          </Link>
        </div>

      </div>
    </div>
  );
}
