import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import { usersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    usersAPI.getAll(search).then(r => {
      setUsers(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (user) => {
    if (!window.confirm(`${user.active ? 'Deactivate' : 'Activate'} "${user.name}"?`)) return;
    try {
      await usersAPI.toggle(user.id);
      toast.success(`User ${user.active ? 'deactivated' : 'activated'}.`);
      load();
    } catch {
      toast.error('Action failed.');
    }
  };

  return (
    <Layout title="Manage Users">
      <div className="page-header">
        <h2>Customers</h2>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input className="form-control" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '280px' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '30vh' }}><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><p>No users found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'var(--primary)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '.85rem', flexShrink: 0
                        }}>
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize: '.88rem' }}>{u.email}</td>
                    <td style={{ fontSize: '.88rem', color: 'var(--neutral-600)' }}>{u.phone || '—'}</td>
                    <td style={{ fontSize: '.82rem', color: 'var(--neutral-600)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${u.active ? 'active' : 'inactive'}`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggle(u)}>
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
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
