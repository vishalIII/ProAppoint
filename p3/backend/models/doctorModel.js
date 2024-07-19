const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  experience: {
    type: String,
    required: true
  },
  feePerConsultation: {
    type: Number,
    required: true
  },
  timings: {
    type: [
      {
        fromTime: { type: String, required: true, default: '11:00 AM' },
        toTime: { type: String, required: true, default: '6:00 PM' }
      }
    ],
    required: true,
    default: [{ fromTime: '11:00 AM', toTime: '6:00 PM' }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
