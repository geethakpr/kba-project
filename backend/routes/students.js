const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/students
// @desc    Get all students
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Sort by student ID alphabetically
    const students = await Student.find().sort({ studentId: 1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error retrieving students.' });
  }
});

// @route   GET /api/students/:studentId
// @desc    Get student by studentId
// @access  Public
router.get('/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId.toUpperCase() });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error retrieving student.' });
  }
});

// @route   POST /api/students
// @desc    Create a student
// @access  Public
router.post('/', async (req, res) => {
  const { studentId, name, department, year, email, cgpa } = req.body;

  try {
    // Basic verification of inputs
    if (!studentId || !name || !department || !year || !email || cgpa === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const uppercaseId = studentId.trim().toUpperCase();

    // Check if studentId already exists
    const idExists = await Student.findOne({ studentId: uppercaseId });
    if (idExists) {
      return res.status(400).json({ message: `Student ID "${uppercaseId}" is already registered.` });
    }

    // Check if email already exists
    const emailExists = await Student.findOne({ email: email.trim().toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: `Email "${email.trim().toLowerCase()}" is already in use.` });
    }

    const newStudent = new Student({
      studentId: uppercaseId,
      name,
      department,
      year,
      email,
      cgpa
    });

    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating student record.' });
  }
});

// @route   PUT /api/students/:studentId
// @desc    Update a student's details
// @access  Public
router.put('/:studentId', async (req, res) => {
  const { name, department, year, email, cgpa } = req.body;
  const targetId = req.params.studentId.toUpperCase();

  try {
    // Find the student to update
    const student = await Student.findOne({ studentId: targetId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // If email is being changed, make sure it doesn't conflict with another student
    if (email && email.trim().toLowerCase() !== student.email) {
      const emailExists = await Student.findOne({ 
        email: email.trim().toLowerCase(),
        studentId: { $ne: targetId } // Not equal to current student
      });
      if (emailExists) {
        return res.status(400).json({ message: `Email "${email.trim().toLowerCase()}" is already in use by another student.` });
      }
      student.email = email;
    }

    // Update fields
    if (name) student.name = name;
    if (department) student.department = department;
    if (year) student.year = year;
    if (cgpa !== undefined) student.cgpa = cgpa;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error updating student record.' });
  }
});

// @route   DELETE /api/students/:studentId
// @desc    Delete a student
// @access  Public
router.delete('/:studentId', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.studentId.toUpperCase() });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json({ message: 'Student record deleted successfully.', studentId: req.params.studentId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error deleting student.' });
  }
});

module.exports = router;
