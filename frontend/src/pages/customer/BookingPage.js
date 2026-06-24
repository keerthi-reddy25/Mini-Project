import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { servicesAPI, appointmentsAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [service, setService] = useState(null);
  const [date, setDate]       = useState('');
  const [slots, setSlots]     = useState([]);
  const [selected, setSelected] = useState('');
  const [notes, setNotes]     = useState('');
  const [loading, setLoading] = useState(false);
  const [booked,  setBooked]  = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    servicesAPI.getById(id).then(r => setService(r.data.data)).catch(() => navigate('/customer/services'));
  }, [id, navigate]);

  const fetchSlots = (d) => {
    if (!d) return;
    appointmentsAPI.getSlots(id, d).then(r => {
      setSlots(r.data.data || []);
      setSelected('');
    }).catch(() => toast.error('Could not fetch slots.'));
  };

  const handleDate = e => { setDate(e.target.value); fetchSlots(e.target.value); };

  const submit = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a time slot.'); return; }
    setLoading(true);
    try {
      const res = await appointmentsAPI.book({ serviceId: Number(id), appointmentDate: date, timeSlot: selected, notes });
      setConfirmation(res.data.data);
      setBooked(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally { setLoading(false); }
  };

  const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  if (!service) return <Layout title="Book Appointment"><div className="loading-screen"><div className="spinner"/></div></Layout>;

  if (booked && confirmation) return (
    <Layout title="Booking Confirmed">
      <div className="card" style={{ maxWidth: 520, margin: '2rem auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ marginBottom: '.5rem' }}>Appointment Booked!</h2>
        <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem' }}>
          Your booking is <strong>pending approval</strong> from our team.
        </p>
        <div className="confirmation-box" style={{ textAlign: 'left' }}>
          <h3>Booking Details</h3>
          <p><strong>Service:</strong> {confirmation.serviceName}</p>
          <p><strong>Date:</strong> {confirmation.appointmentDate}</p>
          <p><strong>Time:</strong> {confirmation.timeSlot}</p>
          <p><strong>Status:</strong> Pending</p>
          {notes && <p><strong>Notes:</strong> {notes}</p>}
        </div>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }}
          onClick={() => navigate('/customer/appointments')}>
          View My Appointments
        </button>
      </div>
    </Layout>
  );

  return (
    <Layout title="Book Appointment">
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-title">Selected Service</div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{service.name}</h3>
          <div className="service-meta" style={{ marginTop: '.5rem' }}>
            <span>⏱ {service.duration} min</span>
            <span>💰 ₹{Number(service.price).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Choose Date &amp; Time</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Appointment Date</label>
              <input className="form-control" type="date" value={date}
                min={minDateStr} onChange={handleDate} required />
            </div>

            {date && (
              <div className="form-group">
                <label className="form-label">Available Time Slots</label>
                {slots.length === 0 ? (
                  <p style={{ color: 'var(--danger)', fontSize: '.88rem' }}>
                    No slots available for this date.
                  </p>
                ) : (
                  <div className="slots-grid">
                    {slots.map(slot => (
                      <button key={slot} type="button"
                        className={`slot-btn${selected === slot ? ' selected' : ''}`}
                        onClick={() => setSelected(slot)}>
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea className="form-control" rows={3} value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requests or information…" />
            </div>

            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="button" className="btn btn-outline"
                onClick={() => navigate('/customer/services')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading || !selected}>
                {loading ? 'Booking…' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
