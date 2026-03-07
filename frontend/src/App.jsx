import { useState, useEffect, useCallback } from 'react'
import {
  getStudents, createStudent, updateStudent, deleteStudent,
  getClasses, createClass, updateClass, deleteClass,
  getStats, exportCSV,
} from './api'

function App() {
  const [tab, setTab] = useState('students')

  // ===== STUDENTS STATE =====
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [classes, setClasses] = useState([])
  const [stats, setStats] = useState({ total_students: 0, average_gpa: 0, students_by_major: {} })
  const [form, setForm] = useState({
    student_id: '', name: '', birth_year: '', major: '', gpa: '', class_id: '',
  })

  // ===== CLASS STATE =====
  const [classError, setClassError] = useState('')
  const [editingClassId, setEditingClassId] = useState(null)
  const [classForm, setClassForm] = useState({ class_id: '', class_name: '', advisor: '' })

  // ===== FETCH =====
  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents(search)
      setStudents(data)
    } catch (err) { console.error(err) }
  }, [search])

  const fetchClasses = async () => {
    try { setClasses(await getClasses()) } catch (err) { console.error(err) }
  }

  const fetchStats = async () => {
    try { setStats(await getStats()) } catch (err) { console.error(err) }
  }

  const fetchAll = () => { fetchStudents(); fetchClasses(); fetchStats() }

  useEffect(() => { fetchClasses(); fetchStats() }, [])
  useEffect(() => { fetchStudents() }, [fetchStudents])

  // ===== STUDENT HANDLERS =====
  const resetForm = () => {
    setForm({ student_id: '', name: '', birth_year: '', major: '', gpa: '', class_id: '' })
    setEditingId(null)
    setError('')
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        birth_year: parseInt(form.birth_year),
        gpa: parseFloat(form.gpa),
        class_id: form.class_id || null,
      }
      if (editingId) {
        const { student_id, ...rest } = payload
        await updateStudent(editingId, rest)
      } else {
        await createStudent(payload)
      }
      resetForm()
      fetchAll()
    } catch (err) { setError(err.message) }
  }

  const handleEdit = (s) => {
    setEditingId(s.student_id)
    setForm({
      student_id: s.student_id,
      name: s.name,
      birth_year: String(s.birth_year),
      major: s.major,
      gpa: String(s.gpa),
      class_id: s.class_id || '',
    })
    setTab('students')
  }

  const handleDelete = async (studentId) => {
    if (!window.confirm('Delete this student?')) return
    try { await deleteStudent(studentId); if (editingId === studentId) resetForm(); fetchAll() }
    catch { alert('Failed to delete student') }
  }

  // ===== CLASS HANDLERS =====
  const resetClassForm = () => {
    setClassForm({ class_id: '', class_name: '', advisor: '' })
    setEditingClassId(null)
    setClassError('')
  }

  const handleClassChange = (e) => setClassForm({ ...classForm, [e.target.name]: e.target.value })

  const handleClassSubmit = async (e) => {
    e.preventDefault()
    setClassError('')
    try {
      if (editingClassId) {
        const { class_id, ...rest } = classForm
        await updateClass(editingClassId, rest)
      } else {
        await createClass(classForm)
      }
      resetClassForm()
      fetchClasses()
    } catch (err) { setClassError(err.message) }
  }

  const handleClassEdit = (c) => {
    setEditingClassId(c.class_id)
    setClassForm({ class_id: c.class_id, class_name: c.class_name, advisor: c.advisor })
  }

  const handleClassDelete = async (classId) => {
    if (!window.confirm('Delete this class?')) return
    try { await deleteClass(classId); if (editingClassId === classId) resetClassForm(); fetchClasses() }
    catch (err) { alert(err.message) }
  }

  // ===== STATS =====
  const majorEntries = Object.entries(stats.students_by_major).sort((a, b) => b[1] - a[1])
  const honorsCount = students.filter(s => s.gpa >= 3.5).length

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
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchAll}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              Refresh
            </button>
            <button className="export-btn" onClick={exportCSV}>
              📥 Export CSV
            </button>
          </div>
        </div>
        <div className="header-decoration"></div>
      </header>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">TOTAL STUDENTS <span className="stat-icon">👁</span></div>
          <div className="stat-value">{stats.total_students}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AVERAGE GPA <span className="stat-icon">📈</span></div>
          <div className="stat-value">{stats.average_gpa}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">HONORS (≥ 3.5) <span className="stat-icon">✨</span></div>
          <div className="stat-value">{honorsCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">BY MAJOR <span className="stat-icon">🏫</span></div>
          <div className="stat-major-list">
            {majorEntries.length === 0 ? <span className="stat-value">—</span> : majorEntries.map(([m, c]) => (
              <div key={m} className="stat-major-item"><span>{m}</span><span className="stat-major-count">{c}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'students' ? 'tab-active' : ''}`} onClick={() => setTab('students')}>
          👨‍🎓 Students
        </button>
        <button className={`tab-btn ${tab === 'classes' ? 'tab-active' : ''}`} onClick={() => setTab('classes')}>
          🏫 Classes
        </button>
      </div>

      {/* ====== STUDENTS TAB ====== */}
      {tab === 'students' && (
        <div className="main-content">
          <div className="form-panel">
            <h2>{editingId ? `Edit Student: ${editingId}` : 'Add Student'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student ID</label>
                <div className="input-wrapper">
                  <span className="input-icon">🎫</span>
                  <input name="student_id" value={form.student_id} onChange={handleChange} placeholder="e.g. STU-1001" required disabled={!!editingId} />
                </div>
              </div>
              <div className="form-group">
                <label>Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Aisha Khan" required />
                </div>
              </div>
              <div className="form-group">
                <label>Birth Year</label>
                <div className="input-wrapper">
                  <span className="input-icon">📅</span>
                  <input name="birth_year" type="number" value={form.birth_year} onChange={handleChange} placeholder="e.g. 2004" required />
                </div>
              </div>
              <div className="form-group">
                <label>Major</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏛</span>
                  <input name="major" value={form.major} onChange={handleChange} placeholder="e.g. Computer Science" required />
                </div>
              </div>
              <div className="form-group">
                <label>GPA (0.0 - 4.0)</label>
                <div className="input-wrapper">
                  <span className="input-icon">Σ</span>
                  <input name="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={handleChange} placeholder="e.g. 3.45" required />
                </div>
              </div>
              <div className="form-group">
                <label>Class</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏫</span>
                  <select name="class_id" value={form.class_id} onChange={handleChange}>
                    <option value="">— No class —</option>
                    {classes.map(c => <option key={c.class_id} value={c.class_id}>{c.class_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">{editingId ? 'Update Student' : 'Add Student'}</button>
                {editingId && <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="table-panel">
            <div className="table-header">
              <h2>Student List</h2>
              <div className="search-wrapper">
                <span className="input-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            {students.length === 0 ? (
              <div className="empty-message">{search ? 'No students match your search.' : 'No students found. Add one!'}</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>STUDENT ID</th>
                    <th>NAME</th>
                    <th>BIRTH YEAR</th>
                    <th>MAJOR</th>
                    <th>CLASS</th>
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
                      <td>{s.class_name || '—'}</td>
                      <td>
                        <span className={`gpa-badge ${s.gpa >= 3.5 ? 'gpa-high' : s.gpa >= 2.5 ? 'gpa-mid' : 'gpa-low'}`}>
                          {s.gpa}
                        </span>
                      </td>
                      <td className="cell-actions">
                        <button className="btn-edit" onClick={() => handleEdit(s)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(s.student_id)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ====== CLASSES TAB ====== */}
      {tab === 'classes' && (
        <div className="main-content">
          <div className="form-panel">
            <h2>{editingClassId ? `Edit Class: ${editingClassId}` : 'Add Class'}</h2>
            {classError && <div className="error">{classError}</div>}
            <form onSubmit={handleClassSubmit}>
              <div className="form-group">
                <label>Class ID</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input name="class_id" value={classForm.class_id} onChange={handleClassChange} placeholder="e.g. C01" required disabled={!!editingClassId} />
                </div>
              </div>
              <div className="form-group">
                <label>Class Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏫</span>
                  <input name="class_name" value={classForm.class_name} onChange={handleClassChange} placeholder="e.g. Khoa học máy tính 1" required />
                </div>
              </div>
              <div className="form-group">
                <label>Advisor</label>
                <div className="input-wrapper">
                  <span className="input-icon">👨‍🏫</span>
                  <input name="advisor" value={classForm.advisor} onChange={handleClassChange} placeholder="e.g. Nguyen Van A" required />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">{editingClassId ? 'Update Class' : 'Add Class'}</button>
                {editingClassId && <button type="button" className="btn-cancel" onClick={resetClassForm}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="table-panel">
            <h2>Class List</h2>
            {classes.length === 0 ? (
              <div className="empty-message">No classes found. Add one!</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>CLASS ID</th>
                    <th>CLASS NAME</th>
                    <th>ADVISOR</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.class_id}>
                      <td className="cell-id">{c.class_id}</td>
                      <td>{c.class_name}</td>
                      <td>{c.advisor}</td>
                      <td className="cell-actions">
                        <button className="btn-edit" onClick={() => handleClassEdit(c)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => handleClassDelete(c.class_id)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
