import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents, deleteStudent } from '../api'

function StudentList() {
  const [students, setStudents] = useState([])
  const navigate = useNavigate()

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    try {
      await deleteStudent(studentId)
      fetchStudents()
    } catch (err) {
      alert('Failed to delete student')
    }
  }

  if (students.length === 0) {
    return <div className="empty-message">No students found. Add one!</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Major</th>
          <th>GPA</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.student_id}>
            <td>{s.student_id}</td>
            <td>{s.name}</td>
            <td>{s.major}</td>
            <td>{s.gpa}</td>
            <td>
              <button className="btn btn-edit" onClick={() => navigate(`/edit/${s.student_id}`)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(s.student_id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StudentList
