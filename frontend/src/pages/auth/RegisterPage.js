import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    try {
      await register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data?.data && typeof data.data === 'object') setErrors(data.data);
      else toast.error(data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const field = (name, label, type='text', placeholder='') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className={`form-control${errors[name] ? ' error' : ''}`}
        type={type} name={name} value={form[name]}
        onChange={handle} placeholder={placeholder} />
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Book<span>Smart</span></h1>
          <p>Create your account in seconds.</p>
        </div>
        <h2 className="auth-title">Create an account</h2>
        <form onSubmit={submit}>
          {field('name',     'Full Name',   'text',     'Jane Doe')}
          {field('email',    'Email',       'email',    'you@example.com')}
          {field('password', 'Password',   'password',  'Min 6 characters')}
          {field('phone',    'Phone (10 digits)', 'tel', '9876543210')}
          {field('address',  'Address (optional)')}
          <button className="btn btn-primary" type="submit"
            style={{ width: '100%', marginTop: '.5rem', padding: '.7rem' }}
            disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
