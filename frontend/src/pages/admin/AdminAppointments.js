import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [status, setStatus]             = useState('');
  const [date,   setDate]               = useState('');
  const [search, setSearch]             = useState('');
  const [modal,  setModal]              = useState(null); // { appt, action }
  const [remarks, setRemarks]           = useState('');

  const load = useCallback(() => {
    setLoading(true);
    appointmentsAPI.getAll({ status, date, search }).then(r => {
      setAppointments(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [status, date, search]);

  useEffect(() => { load(); }, [load]);

  const openModal = (appt, action) => { setModal({ appt, action }); setRemarks(''); };
  const closeModal = () => { setModal(null); setRemarks(''); };

  const updateStatus = async () => {
    try {
      await appointmentsAPI.updateStatus(modal.appt.id, {
        status: modal.action, adminRemarks: remarks
      });
      toast.success(`Appointment ${modal.action.toLowerCase()}.`);
      closeModal(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <Layout title="Manage Appointments">
      <div className="page-header">
        <h2>All Appointments</h2>
      </div>

      <div className="filters" style={{ marginBottom: '1.25rem' }}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Search customer / service…"
            value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:'2.5rem' }} />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="form-control" style={{ width:'150px' }}>
          <option value="">All Statuses</option>
          {['PENDING','APPROVED','REJECTED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} style={{ width:'170px' }} />
        {(status||date||search) && <button className="btn btn-outline btn-sm" onClick={() => { setStatus(''); setDate(''); setSearch(''); }}>Clear</button>}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-screen" style={{ minHeight:'30vh' }}><div className="spinner"/></div>
        ) : appointments.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No appointments found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td style={{ color:'var(--neutral-400)', fontSize:'.8rem' }}>#{a.id}</td>
                    <td><strong>{a.userName}</strong><br/><span style={{fontSize:'.78rem',color:'var(--neutral-600)'}}>{a.userEmail}</span></td>
                    <td>{a.serviceName}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.timeSlot}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>
                      <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
                        {a.status === 'PENDING' && <>
                          <button className="btn btn-sm btn-success" onClick={() => openModal(a, 'APPROVED')}>Approve</button>
                          <button className="btn btn-sm btn-danger"  onClick={() => openModal(a, 'REJECTED')}>Reject</button>
                        </>}
                        {a.status === 'APPROVED' && (
                          <button className="btn btn-sm btn-danger" onClick={() => openModal(a, 'CANCELLED')}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modal.action === 'APPROVED' ? '✅ Approve' : modal.action === 'REJECTED' ? '❌ Reject' : '🚫 Cancel'} Appointment</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <p style={{ fontSize:'.88rem', color:'var(--neutral-600)', marginBottom:'1rem' }}>
              <strong>{modal.appt.userName}</strong> · {modal.appt.serviceName} · {modal.appt.appointmentDate} {modal.appt.timeSlot}
            </p>
            <div className="form-group">
              <label className="form-label">Admin Remarks (optional)</label>
              <textarea className="form-control" rows={3} value={remarks}
                onChange={e => setRemarks(e.target.value)} placeholder="Add a note for the customer…" />
            </div>
            <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className={`btn ${modal.action==='APPROVED'?'btn-success':'btn-danger'}`} onClick={updateStatus}>
                Confirm {modal.action.charAt(0)+modal.action.slice(1).toLowerCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
