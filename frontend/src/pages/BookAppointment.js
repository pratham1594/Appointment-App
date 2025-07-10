import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookAppointment.css';

const BookAppointment = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();

  const allSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!date) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/appointments?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const booked = data.map(apt => apt.time);
      const available = allSlots.filter(slot => !booked.includes(slot));
      setAvailableSlots(available);
    };
    fetchBookedSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!date || !time || !description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date, time, description })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Appointment booked successfully! ✅');
        navigate('/dashboard');
      } else {
        alert(`${data.message || 'Booking failed ❌'}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong. Please try again ❌');
    }
  };

  return (
  <div className="book-wrapper">
    <div className="book-container">
      <h2>📅 Book New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <select
          value={time}
          onChange={(e) => {
            const selected = e.target.value;
            setTime(selected);
            if (!availableSlots.includes(selected)) {
              alert(`The selected slot ❌(${selected}) is already booked.`);
              setTime('');
            }
          }}
          required
        >
          <option value="">-- Select Time --</option>
          {allSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot} {availableSlots.includes(slot) ? '' : '(Booked)'}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Appointment description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" className="book-btn">Book</button>
      </form>
    </div>
  </div>
);

};

export default BookAppointment;
