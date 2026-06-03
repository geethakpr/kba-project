import React, { useState, useMemo } from 'react';

const StudentList = ({ students, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortBy, setSortBy] = useState('studentId'); // studentId, name, cgpa_desc, cgpa_asc

  // Dynamically extract unique departments for the filter dropdown
  const departments = useMemo(() => {
    const depts = students.map(s => s.department.trim());
    // Filter empty values and return unique sorted array
    return ['ALL', ...new Set(depts.filter(Boolean))].sort();
  }, [students]);

  // Handle filtering and sorting
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Search query matching (studentId, name, email)
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(student => 
        (student.studentId && student.studentId.toLowerCase().includes(query)) ||
        (student.name && student.name.toLowerCase().includes(query)) ||
        (student.email && student.email.toLowerCase().includes(query))
      );
    }

    // Department filter
    if (selectedDept !== 'ALL') {
      result = result.filter(student => student.department === selectedDept);
    }

    // Year filter
    if (selectedYear !== 'ALL') {
      result = result.filter(student => student.year === selectedYear);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'studentId') {
        return a.studentId.localeCompare(b.studentId);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'cgpa_desc') {
        return Number(b.cgpa) - Number(a.cgpa);
      }
      if (sortBy === 'cgpa_asc') {
        return Number(a.cgpa) - Number(b.cgpa);
      }
      return 0;
    });

    return result;
  }, [students, searchTerm, selectedDept, selectedYear, sortBy]);

  // Color-coded CGPA badge class resolver
  const getCgpaClass = (cgpa) => {
    const val = Number(cgpa);
    if (val >= 9.0) return 'badge badge-cgpa cgpa-excellent';
    if (val >= 7.5) return 'badge badge-cgpa cgpa-good';
    if (val >= 6.0) return 'badge badge-cgpa cgpa-average';
    return 'badge badge-cgpa cgpa-low';
  };

  return (
    <div>
      {/* Search and Filters Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID, Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Department Filter */}
          <select
            className="select-filter"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            title="Filter by Department"
          >
            <option value="ALL">All Departments</option>
            {departments.filter(d => d !== 'ALL').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            className="select-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            title="Filter by Year"
          >
            <option value="ALL">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          {/* Sort controls */}
          <select
            className="select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort records"
          >
            <option value="studentId">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="cgpa_desc">CGPA (High → Low)</option>
            <option value="cgpa_asc">CGPA (Low → High)</option>
          </select>
        </div>
      </div>

      {/* Main Student List Display */}
      {processedStudents.length > 0 ? (
        <div className="student-list-container">
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>CGPA</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td style={{ fontWeight: '700', letterSpacing: '-0.01em' }}>
                      {student.studentId}
                    </td>
                    <td style={{ fontWeight: '500' }}>{student.name}</td>
                    <td>
                      <span className="badge badge-dept">{student.department}</span>
                    </td>
                    <td>
                      <span className="badge badge-year">{student.year}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{student.email}</td>
                    <td>
                      <span className={getCgpaClass(student.cgpa)}>
                        {Number(student.cgpa).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        {/* Edit Button */}
                        <button
                          className="btn-table-action edit"
                          onClick={() => onEdit(student)}
                          title={`Edit ${student.name}`}
                          aria-label="Edit Student"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
                          </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          className="btn-table-action delete"
                          onClick={() => onDelete(student.studentId)}
                          title={`Delete ${student.name}`}
                          aria-label="Delete Student"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State Illustration */
        <div className="student-list-container">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="17" y1="8" x2="22" y2="13" />
                <line x1="22" y1="8" x2="17" y2="13" />
              </svg>
            </div>
            <h3>No Students Found</h3>
            <p>
              {students.length === 0 
                ? "The database is empty. Click 'Add Student' above to register your first record."
                : "No students match your search terms or filter selection. Try adjusting your filters."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
