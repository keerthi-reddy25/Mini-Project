import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import StatusBadge from '../../components/common/StatusBadge';
import { appointmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    appointmentsAPI.getMy().then(r => setAppointments(r.data.data || [])).catch(() => {});
  }, []);

  const counts = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'PENDING').length,
    approved:  appointments.filter(a => a.status === 'APPROVED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  const recent = [...appointments].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);

  return (
    <Layout title="Dashboard">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>Welcome back, {user?.name}! 👋</h2>
        <p style={{ color:'var(--neutral-600)', marginTop:'.25rem' }}>
          Here's a summary of your appointments.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-label">Total Booked</div><div className="stat-value">{counts.total}</div></div>
        <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-label">Pending</div><div className="stat-value" style={{color:'var(--warning)'}}>{counts.pending}</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-label">Approved</div><div className="stat-value" style={{color:'var(--success)'}}>{counts.approved}</div></div>
        <div className="stat-card"><div className="stat-icon">❌</div><div className="stat-label">Cancelled</div><div className="stat-value" style={{color:'var(--danger)'}}>{counts.cancelled}</div></div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            <Link to="/customer/services" className="btn btn-primary">📋 Book an Appointment</Link>
            <Link to="/customer/appointments" className="btn btn-outline">🗓 View All Appointments</Link>
            <Link to="/customer/profile" className="btn btn-outline">👤 Update Profile</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Recent Appointments</div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No appointments yet. <Link to="/customer/services" style={{color:'var(--primary)'}}>Book one now!</Link></p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {recent.map(a => (
                <div key={a.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'.75rem', background:'var(--neutral-50)', borderRadius:'8px' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'.88rem' }}>{a.serviceName}</div>
                    <div style={{ fontSize:'.78rem', color:'var(--neutral-600)' }}>{a.appointmentDate} · {a.timeSlot}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
