import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../App.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Book<span>Smart</span></h1>
          <p>Your appointment, simplified.</p>
        </div>
        <h2 className="auth-title">Sign in to your account</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-control" type="email" name="email"
              value={form.email} onChange={handle} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password"
              value={form.password} onChange={handle} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" type="submit"
            style={{ width: '100%', marginTop: '.5rem', padding: '.7rem' }}
            disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <hr className="auth-divider" />
        <div style={{ fontSize: '.75rem', color: '#94a3b8', textAlign: 'center' }}>
          Admin demo: admin@bookapp.com / Admin@123
        </div>
      </div>
    </div>
  );
}
