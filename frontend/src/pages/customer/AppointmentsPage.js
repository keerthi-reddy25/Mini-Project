import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    appointmentsAPI.getMy().then(r => {
      setAppointments(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentsAPI.cancel(id);
      toast.success('Appointment cancelled.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel.');
    }
  };

  const statuses = ['ALL','PENDING','APPROVED','REJECTED','CANCELLED'];
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <Layout title="My Appointments">
      <div className="page-header">
        <h2>My Appointments</h2>
      </div>

      <div className="filters">
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter===s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen" style={{ minHeight: '40vh' }}><div className="spinner"/></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No appointments found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(a => (
            <div key={a.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.75rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '.3rem' }}>{a.serviceName}</h3>
                  <div style={{ fontSize: '.85rem', color: 'var(--neutral-600)' }}>
                    📅 {a.appointmentDate} &nbsp;·&nbsp; 🕐 {a.timeSlot} &nbsp;·&nbsp; 💰 ₹{Number(a.servicePrice).toLocaleString('en-IN')}
                  </div>
                  {a.notes && <div style={{ fontSize: '.82rem', marginTop: '.4rem', color: 'var(--neutral-600)' }}>📝 {a.notes}</div>}
                  {a.adminRemarks && (
                    <div style={{ fontSize: '.82rem', marginTop: '.4rem', background: 'var(--neutral-50)', padding: '.5rem .75rem', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                      <strong>Admin:</strong> {a.adminRemarks}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem' }}>
                  <StatusBadge status={a.status} />
                  {(a.status === 'PENDING' || a.status === 'APPROVED') && (
                    <button className="btn btn-sm btn-danger" onClick={() => cancel(a.id)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
