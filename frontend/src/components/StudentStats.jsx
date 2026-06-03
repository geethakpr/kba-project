import React from 'react';

const StudentStats = ({ students }) => {
  const totalStudents = students.length;

  const averageCgpa = totalStudents > 0
    ? (students.reduce((sum, s) => sum + Number(s.cgpa), 0) / totalStudents).toFixed(2)
    : '0.00';

  const highestCgpa = totalStudents > 0
    ? Math.max(...students.map(s => Number(s.cgpa))).toFixed(2)
    : '0.00';

  const uniqueDepts = totalStudents > 0
    ? new Set(students.map(s => s.department.trim().toUpperCase())).size
    : 0;

  return (
    <div className="stats-grid">
      {/* Total Students Card */}
      <div className="stat-card">
        <div className="stat-title">Total Students</div>
        <div className="stat-value-container">
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
      </div>

      {/* Average CGPA Card */}
      <div className="stat-card">
        <div className="stat-title">Average CGPA</div>
        <div className="stat-value-container">
          <div className="stat-value">{averageCgpa}</div>
          <div className="stat-icon" style={{ color: 'var(--info)', backgroundColor: 'var(--info-light)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Highest CGPA Card */}
      <div className="stat-card">
        <div className="stat-title">Highest CGPA</div>
        <div className="stat-value-container">
          <div className="stat-value">{highestCgpa}</div>
          <div className="stat-icon" style={{ color: 'var(--success)', backgroundColor: 'var(--success-light)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Unique Departments Card */}
      <div className="stat-card">
        <div className="stat-title">Departments</div>
        <div className="stat-value-container">
          <div className="stat-value">{uniqueDepts}</div>
          <div className="stat-icon" style={{ color: 'var(--warning)', backgroundColor: 'var(--warning-light)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
