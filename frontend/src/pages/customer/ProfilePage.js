import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { usersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [form, setForm]     = useState({ name:'', phone:'', address:'' });
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    usersAPI.getProfile().then(r => {
      const d = r.data.data;
      setEmail(d.email);
      setForm({ name: d.name || '', phone: d.phone || '', address: d.address || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  if (loading) return <Layout title="Profile"><div className="loading-screen" style={{ minHeight:'40vh' }}><div className="spinner"/></div></Layout>;

  return (
    <Layout title="My Profile">
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div className="card">
          <div className="card-title">Update Profile</div>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', padding:'1rem', background:'var(--neutral-50)', borderRadius:'10px' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1.4rem', fontWeight:800 }}>
              {form.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:700 }}>{form.name}</div>
              <div style={{ fontSize:'.85rem', color:'var(--neutral-600)' }}>{email}</div>
            </div>
          </div>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email (read-only)</label>
              <input className="form-control" value={email} disabled style={{ background:'var(--neutral-100)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (10 digits)</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handle} maxLength={10} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-control" name="address" rows={3} value={form.address} onChange={handle} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
