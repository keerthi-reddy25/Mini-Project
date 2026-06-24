import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import { servicesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const emptyForm = { name:'', description:'', duration:'', price:'' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [modal,  setModal]      = useState(null); // null | 'add' | service obj
  const [form,   setForm]       = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  const load = useCallback(() => {
    servicesAPI.getAllAdmin().then(r => setServices(r.data.data || [])).catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (s) => { setForm({ name:s.name, description:s.description||'', duration:s.duration, price:s.price }); setModal(s); };
  const close    = () => { setModal(null); setForm(emptyForm); };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, duration: Number(form.duration), price: Number(form.price) };
    try {
      if (modal === 'add') {
        await servicesAPI.create(payload);
        toast.success('Service created!');
      } else {
        await servicesAPI.update(modal.id, payload);
        toast.success('Service updated!');
      }
      close(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setSaving(false); }
  };

  const toggleDelete = async (s) => {
    if (!window.confirm(`${s.active ? 'Deactivate' : 'Activate'} "${s.name}"?`)) return;
    try {
      if (s.active) await servicesAPI.delete(s.id);
      toast.success(`Service ${s.active ? 'deactivated' : 'note: re-activation done via DB'}.`);
      load();
    } catch (err) {
      toast.error('Failed.');
    }
  };

  return (
    <Layout title="Manage Services">
      <div className="page-header">
        <h2>Services</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Service</button>
      </div>

      <div className="card" style={{ padding: 0, overflow:'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Description</th><th>Duration</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td style={{ maxWidth:220, fontSize:'.83rem', color:'var(--neutral-600)' }}>{s.description || '—'}</td>
                  <td>{s.duration} min</td>
                  <td>₹{Number(s.price).toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${s.active ? 'active' : 'inactive'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:'.4rem' }}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(s)}>Edit</button>
                      <button className={`btn btn-sm ${s.active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleDelete(s)}>{s.active ? 'Deactivate' : 'Activate'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add New Service' : 'Edit Service'}</h3>
              <button className="modal-close" onClick={close}>×</button>
            </div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" rows={2} value={form.description} onChange={handle} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration (min)</label>
                  <input className="form-control" name="duration" type="number" min="1" value={form.duration} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input className="form-control" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handle} required />
                </div>
              </div>
              <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
