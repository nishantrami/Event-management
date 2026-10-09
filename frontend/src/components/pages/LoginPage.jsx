import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { customerLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await customerLogin(email, password);
      if (res.success) {
        navigate('/my-bookings');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '70px 16px',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ede9fe 100%)',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card-white" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '40px',
        boxShadow: 'var(--shadow-xl)',
        borderRadius: '28px'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '14px',
            boxShadow: '0 8px 20px -2px rgba(124, 58, 237, 0.35)'
          }}>
            <Sparkles size={24} style={{ color: '#fef08a' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Customer Sign In
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            Access your reserved dates and manage event plans
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#b91c1c', marginBottom: '20px', fontWeight: '600' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '26px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '26px', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#7c3aed', fontWeight: '800' }}>
            Create one here
          </Link>
        </div>

      </div>
    </div>
  );
}
