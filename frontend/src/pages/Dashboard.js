import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      navigate('/login');
      return;
    }

    const fetchAppointments = async () => {
      const res = await fetch('/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAppointments(data);
    };

    fetchAppointments();

    const userData = JSON.parse(localStorage.getItem('user')) || { name: 'User' };
    setUserName(userData.name || 'User');
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      setAppointments(appointments.filter(a => a._id !== id));
      alert('Appointment cancelled ❌');
    } else {
      alert('Failed to cancel appointment');
    }
  };

  const handleRescheduleSubmit = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/appointments/${rescheduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ date: newDate, time: newTime })
    });

    if (res.ok) {
      alert('Appointment rescheduled 📅');
      setRescheduleId(null);
      window.location.reload();
    } else {
      const data = await res.json();
      alert(`${data.message} ❌`);
    }
  };

  const handleBookNew = () => {
    navigate('/book');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {userName}!</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>

        <h2>Upcoming Appointments:</h2>
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <ul>
            {appointments.map(apt => (
              <li key={apt._id}>
                <strong>{apt.date}</strong> at <strong>{apt.time}</strong> — {apt.description}<br />
                <button onClick={() => { setRescheduleId(apt._id); setNewDate(apt.date); setNewTime(apt.time); }} className="action-button">Reschedule Appointment</button>
                <button onClick={() => handleDelete(apt._id)} className="delete-button">Cancel Appointment</button>
              </li>
            ))}
          </ul>
        )}

        <button onClick={handleBookNew} className="book-new-button">
          Book New Appointment 📅 
        </button>

        {rescheduleId && (
          <div className="reschedule-modal">
            <h3>Reschedule Appointment</h3>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required />
            <select value={newTime} onChange={(e) => setNewTime(e.target.value)} required>
              <option value="">-- Select Time --</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select><br /><br />
            <button onClick={handleRescheduleSubmit}>Confirm</button>
            <button onClick={() => setRescheduleId(null)} className="cancel-button">❌ Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;