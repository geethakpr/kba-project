import React, { useState, useEffect } from 'react';

const StudentForm = ({ student, onSubmit, onClose, error, isLoading }) => {
  const isEditMode = !!student;
  
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    department: '',
    year: '1st Year',
    email: '',
    cgpa: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // If in edit mode, pre-populate the form
  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId || '',
        name: student.name || '',
        department: student.department || '',
        year: student.year || '1st Year',
        email: student.email || '',
        cgpa: student.cgpa !== undefined ? student.cgpa : ''
      });
    } else {
      setFormData({
        studentId: '',
        name: '',
        department: '',
        year: '1st Year',
        email: '',
        cgpa: ''
      });
    }
    setFormErrors({});
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!isEditMode && !formData.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    const cgpaVal = parseFloat(formData.cgpa);
    if (formData.cgpa === '' || isNaN(cgpaVal)) {
      errors.cgpa = 'CGPA is required';
    } else if (cgpaVal < 0 || cgpaVal > 10) {
      errors.cgpa = 'CGPA must be between 0.0 and 10.0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Student Details' : 'Add New Student'}</h2>
          <button className="btn-table-action" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Student ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="studentId">Student ID</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                className="form-control"
                placeholder="e.g. STU1001"
                value={formData.studentId}
                onChange={handleChange}
                disabled={isEditMode || isLoading}
                style={formErrors.studentId ? { borderColor: 'var(--danger)' } : {}}
              />
              {formErrors.studentId && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.studentId}</span>}
              {isEditMode && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>Student ID cannot be changed.</span>}
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                style={formErrors.name ? { borderColor: 'var(--danger)' } : {}}
              />
              {formErrors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.name}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                className="form-control"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
                disabled={isLoading}
                style={formErrors.department ? { borderColor: 'var(--danger)' } : {}}
              />
              {formErrors.department && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.department}</span>}
            </div>

            {/* Year & CGPA Grid */}
            <div className="form-grid">
              {/* Year */}
              <div className="form-group">
                <label className="form-label" htmlFor="year">Academic Year</label>
                <select
                  id="year"
                  name="year"
                  className="form-control"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* CGPA */}
              <div className="form-group">
                <label className="form-label" htmlFor="cgpa">CGPA (0.0 - 10.0)</label>
                <input
                  type="number"
                  id="cgpa"
                  name="cgpa"
                  className="form-control"
                  placeholder="e.g. 9.15"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={handleChange}
                  disabled={isLoading}
                  style={formErrors.cgpa ? { borderColor: 'var(--danger)' } : {}}
                />
                {formErrors.cgpa && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.cgpa}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="e.g. johndoe@university.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                style={formErrors.email ? { borderColor: 'var(--danger)' } : {}}
              />
              {formErrors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.email}</span>}
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
