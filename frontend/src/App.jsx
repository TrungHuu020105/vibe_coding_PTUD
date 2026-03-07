import { useState, useEffect } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent } from './api'

function App() {
  const [students, setStudents] = useState([])
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    student_id: '',
    name: '',
    birth_year: '',
    major: '',
    gpa: '',
  })

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const resetForm = () => {
    setForm({ student_id: '', name: '', birth_year: '', major: '', gpa: '' })
    setEditingId(null)
    setError('')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        birth_year: parseInt(form.birth_year),
        gpa: parseFloat(form.gpa),
      }
      if (editingId) {
        const { student_id, ...updatePayload } = payload
        await updateStudent(editingId, updatePayload)
      } else {
        await createStudent(payload)
      }
      resetForm()
      fetchStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (s) => {
    setEditingId(s.student_id)
    setForm({
      student_id: s.student_id,
      name: s.name,
      birth_year: String(s.birth_year),
      major: s.major,
      gpa: String(s.gpa),
    })
  }

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    try {
      await deleteStudent(studentId)
      if (editingId === studentId) resetForm()
      fetchStudents()
    } catch (err) {
      alert('Failed to delete student')
    }
  }

  // Stats
  const totalStudents = students.length
  const avgGpa = totalStudents > 0
    ? (students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents).toFixed(2)
    : '0.00'
  const honorsCount = students.filter(s => s.gpa >= 3.5).length
  const topMajor = totalStudents > 0
    ? Object.entries(students.reduce((acc, s) => { acc[s.major] = (acc[s.major] || 0) + 1; return acc }, {}))
        .sort((a, b) => b[1] - a[1])[0][0]
    : '—'

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-text">
            <span className="header-badge">🎓 STUDENT MANAGEMENT</span>
            <h1>Academic Ledger</h1>
            <p>Add, edit, and organize student records with a simple and clean workflow.</p>
          </div>
          <button className="refresh-btn" onClick={fetchStudents}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            Refresh List
          </button>
        </div>
        <div className="header-decoration"></div>
      </header>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">TOTAL STUDENTS <span className="stat-icon">👁</span></div>
          <div className="stat-value">{totalStudents}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AVERAGE GPA <span className="stat-icon">📈</span></div>
          <div className="stat-value">{avgGpa}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">HONORS (≥ 3.5) <span className="stat-icon">✨</span></div>
          <div className="stat-value">{honorsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TOP MAJOR <span className="stat-icon">🏫</span></div>
          <div className="stat-value stat-value-sm">{topMajor}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Add/Edit Form */}
        <div className="form-panel">
          <h2>{editingId ? `Edit Student: ${editingId}` : 'Add Student'}</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Student ID</label>
              <div className="input-wrapper">
                <span className="input-icon">🎫</span>
                <input
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  placeholder="e.g. STU-1001"
                  required
                  disabled={!!editingId}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Aisha Khan"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Birth Year</label>
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input
                  name="birth_year"
                  type="number"
                  value={form.birth_year}
                  onChange={handleChange}
                  placeholder="e.g. 2004"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Major</label>
              <div className="input-wrapper">
                <span className="input-icon">🏛</span>
                <input
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>GPA (0.0 - 4.0)</label>
              <div className="input-wrapper">
                <span className="input-icon">Σ</span>
                <input
                  name="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={form.gpa}
                  onChange={handleChange}
                  placeholder="e.g. 3.45"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
              {editingId && (
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Student List */}
        <div className="table-panel">
          <h2>Student List</h2>
          {students.length === 0 ? (
            <div className="empty-message">No students found. Add one!</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>NAME</th>
                  <th>BIRTH YEAR</th>
                  <th>MAJOR</th>
                  <th>GPA</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td className="cell-id">{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>{s.birth_year}</td>
                    <td>{s.major}</td>
                    <td>
                      <span className={`gpa-badge ${s.gpa >= 3.5 ? 'gpa-high' : s.gpa >= 2.5 ? 'gpa-mid' : 'gpa-low'}`}>
                        {s.gpa}
                      </span>
                    </td>
                    <td className="cell-actions">
                      <button className="btn-edit" onClick={() => handleEdit(s)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(s.student_id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
