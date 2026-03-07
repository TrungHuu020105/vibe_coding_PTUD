import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStudent } from '../api'

function AddStudent() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    student_id: '',
    name: '',
    birth_year: '',
    major: '',
    gpa: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createStudent({
        ...form,
        birth_year: parseInt(form.birth_year),
        gpa: parseFloat(form.gpa),
      })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="form-container">
      <h2>Add Student</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student ID</label>
          <input name="student_id" value={form.student_id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Birth Year</label>
          <input name="birth_year" type="number" value={form.birth_year} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Major</label>
          <input name="major" value={form.major} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>GPA</label>
          <input name="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-submit">Add Student</button>
      </form>
    </div>
  )
}

export default AddStudent
