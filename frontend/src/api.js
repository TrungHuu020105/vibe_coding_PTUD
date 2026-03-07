const API_URL = 'http://localhost:8000';

export async function getStudents() {
  const res = await fetch(`${API_URL}/students`);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function getStudent(studentId) {
  const res = await fetch(`${API_URL}/students/${encodeURIComponent(studentId)}`);
  if (!res.ok) throw new Error('Student not found');
  return res.json();
}

export async function createStudent(student) {
  const res = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create student');
  }
  return res.json();
}

export async function updateStudent(studentId, student) {
  const res = await fetch(`${API_URL}/students/${encodeURIComponent(studentId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to update student');
  }
  return res.json();
}

export async function deleteStudent(studentId) {
  const res = await fetch(`${API_URL}/students/${encodeURIComponent(studentId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete student');
}
