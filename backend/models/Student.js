const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: {
      values: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      message: 'Year must be 1st, 2nd, 3rd, or 4th Year'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  cgpa: {
    type: Number,
    required: [true, 'CGPA is required'],
    min: [0, 'CGPA cannot be less than 0.0'],
    max: [10, 'CGPA cannot be greater than 10.0']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);
