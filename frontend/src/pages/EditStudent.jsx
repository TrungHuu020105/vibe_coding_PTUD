import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStudent, updateStudent } from '../api'

function EditStudent() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    birth_year: '',
    major: '',
    gpa: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStudent(studentId)
        setForm({
          name: data.name,
          birth_year: String(data.birth_year),
          major: data.major,
          gpa: String(data.gpa),
        })
      } catch {
        setError('Student not found')
      }
    }
    load()
  }, [studentId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updateStudent(studentId, {
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
      <h2>Edit Student: {studentId}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-submit">Update Student</button>
      </form>
    </div>
  )
}

export default EditStudent
