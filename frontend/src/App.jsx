import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import ThemeToggle from './components/ThemeToggle';
import { API_URL } from './config';

function App() {
  const [students, setStudents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Remove toast manually on click
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch all students
  const fetchStudents = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Failed to retrieve students from server.');
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Could not connect to the backend server.', 'danger');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Add or Edit submit
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError('');

    const isEditMode = !!editingStudent;
    const url = isEditMode
      ? `${API_URL}/${editingStudent.studentId}`
      : API_URL;

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please check your data.');
      }

      showToast(
        isEditMode
          ? `Successfully updated student: ${data.name}`
          : `Successfully registered student: ${data.name}`,
        'success'
      );

      // Close modal and refresh roster
      setIsFormOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Server connection failed.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete operation
  const handleDeleteStudent = async (studentId) => {
    const student = students.find(s => s.studentId === studentId);
    if (!student) return;

    const confirmDelete = window.confirm(`Are you sure you want to remove the student "${student.name}" (ID: ${studentId}) from the system?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${studentId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete student.');
      }

      showToast(`Student record for "${student.name}" has been removed.`, 'info');
      fetchStudents();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Server communication error.', 'danger');
    }
  };

  // Open form in add mode
  const handleOpenAddForm = () => {
    setEditingStudent(null);
    setFormError('');
    setIsFormOpen(true);
  };

  // Open form in edit mode
  const handleOpenEditForm = (student) => {
    setEditingStudent(student);
    setFormError('');
    setIsFormOpen(true);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
    setFormError('');
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="header">
        <div className="header-title-area">
          <h1>Student Management</h1>
        </div>
        <div className="header-actions">
          {/* Dark / Light toggle */}
          <ThemeToggle />

          {/* Add Student Button */}
          <button className="btn btn-primary" onClick={handleOpenAddForm}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Student
          </button>
        </div>
      </header>

      {/* Content Area */}
      {isFetching ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          {/* Custom Spinner */}
          <svg className="spinner" width="40" height="40" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }}>
            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--primary-light)" strokeWidth="5" />
            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--primary)" strokeWidth="5" strokeDasharray="31.4, 31.4" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Connecting to database...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <StudentList
          students={students}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteStudent}
        />
      )}

      {/* Overlay Form Modal (for Add / Edit) */}
      {isFormOpen && (
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          error={formError}
          isLoading={formLoading}
        />
      )}

      {/* Toast Notifications System */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === 'danger' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
            <span style={{ color: 'var(--text-primary)' }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
