const API_URL = 'http://localhost:8000';

// ===== STUDENTS =====

export async function getStudents(search = '') {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_URL}/students${params}`);
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

// ===== CLASSES =====

export async function getClasses() {
  const res = await fetch(`${API_URL}/classes`);
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}

export async function createClass(cls) {
  const res = await fetch(`${API_URL}/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cls),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create class');
  }
  return res.json();
}

export async function updateClass(classId, cls) {
  const res = await fetch(`${API_URL}/classes/${encodeURIComponent(classId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cls),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to update class');
  }
  return res.json();
}

export async function deleteClass(classId) {
  const res = await fetch(`${API_URL}/classes/${encodeURIComponent(classId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to delete class');
  }
}

// ===== STATS =====

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// ===== EXPORT =====

export async function exportCSV() {
  const res = await fetch(`${API_URL}/students/export/csv`);
  if (!res.ok) throw new Error('Failed to export CSV');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'students.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}
