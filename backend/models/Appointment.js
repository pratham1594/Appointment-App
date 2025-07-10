const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  time: String,
  description: String
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
