import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { appointmentsAPI } from '../../services/api';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={color ? { color } : {}}>{value ?? '–'}</div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    appointmentsAPI.getStats().then(r => setStats(r.data.data)).catch(() => {});
    appointmentsAPI.getAll({}).then(r => setRecent((r.data.data || []).slice(0, 8))).catch(() => {});
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <h2 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:'1.5rem' }}>Overview</h2>

      <div className="stats-grid">
        <StatCard icon="👥" label="Total Users"        value={stats?.totalUsers} />
        <StatCard icon="🛠" label="Services"           value={stats?.totalServices} />
        <StatCard icon="📅" label="Total Appointments" value={stats?.totalAppointments} />
        <StatCard icon="📆" label="Today's Bookings"   value={stats?.todayAppointments} color="var(--primary)" />
        <StatCard icon="⏳" label="Pending"            value={stats?.pendingAppointments} color="var(--warning)" />
        <StatCard icon="✅" label="Approved"           value={stats?.approvedAppointments} color="var(--success)" />
        <StatCard icon="❌" label="Rejected"           value={stats?.rejectedAppointments} color="var(--danger)" />
        <StatCard icon="🚫" label="Cancelled"          value={stats?.cancelledAppointments} color="var(--neutral-600)" />
      </div>

      <div className="card">
        <div className="card-title">Latest Appointments</div>
        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding:'2rem' }}>
            <p>No appointments yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.userName}</strong><br/><span style={{fontSize:'.78rem',color:'var(--neutral-600)'}}>{a.userEmail}</span></td>
                    <td>{a.serviceName}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.timeSlot}</td>
                    <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
