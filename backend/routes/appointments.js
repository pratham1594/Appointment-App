const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST /api/appointments
router.post('/', authMiddleware, async (req, res) => {
  const { date, time, description } = req.body;

  try {
    // Prevent double booking
    const existing = await Appointment.findOne({ date, time });
    if (existing) {
      return res.status(400).json({ message: 'Time slot already booked!' });
    }

    const appointment = new Appointment({
      userId: req.user.id,
      date,
      time,
      description
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked!' });
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// GET /api/appointments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// DELETE appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// PUT reschedule
router.put('/:id', authMiddleware, async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { date: req.body.date, time: req.body.time },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
