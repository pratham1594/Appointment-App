const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  const appointment = new Appointment(req.body);
  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  const userId = req.params.userId;
  const appointments = await Appointment.find({ userId });
  res.json(appointments);
};

exports.updateAppointment = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteAppointment = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
