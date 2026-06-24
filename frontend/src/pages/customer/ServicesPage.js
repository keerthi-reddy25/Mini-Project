import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { servicesAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  const fetchServices = (q = '') => {
    setLoading(true);
    servicesAPI.getAll(q).then(r => {
      setServices(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const q = e.target.value.trim();
    if (q.length === 0 || q.length >= 2) fetchServices(q);
  };

  return (
    <Layout title="Available Services">
      <div className="page-header">
        <h2>Browse Services</h2>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Search services…"
            value={search} onChange={handleSearch} />
        </div>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ minHeight: '40vh' }}><div className="spinner" /></div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <p>No services found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map(s => (
            <div key={s.id} className="service-card">
              <h3>{s.name}</h3>
              <p className="desc">{s.description || 'No description provided.'}</p>
              <div className="service-meta">
                <span>⏱ {s.duration} min</span>
                <span>💰 ₹{Number(s.price).toLocaleString('en-IN')}</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}
                onClick={() => navigate(`/customer/book/${s.id}`)}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
