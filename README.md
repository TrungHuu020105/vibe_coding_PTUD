# Student Management - Academic Ledger

## Thông tin cá nhân

- **Họ tên:** Lê Trung Hữu
- **Lớp:** Phát triển ứng dụng - HK2 2025-2026

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | FastAPI (Python) |
| Frontend | React JS (Vite) |
| Database | SQLite (SQLAlchemy ORM) |

## Tools

- **VS Code** — Code editor
- **GitHub Copilot** — AI pair programming

## Log (Quá trình thực hiện)

### Phần 1 — Xây dựng MVP

1. **Khởi tạo Backend (FastAPI + SQLite)**
   - Tạo `database.py` — cấu hình SQLAlchemy engine, session, Base
   - Tạo `models.py` — model `Student` (student_id, name, birth_year, major, gpa)
   - Tạo `schemas.py` — Pydantic schemas (StudentCreate, StudentUpdate, StudentResponse)
   - Tạo `main.py` — CRUD API endpoints (GET, POST, PUT, DELETE /students)

2. **Khởi tạo Frontend (React + Vite)**
   - Tạo project React với Vite
   - Tạo `api.js` — các hàm gọi API (getStudents, createStudent, updateStudent, deleteStudent)
   - Tạo các pages: StudentList, AddStudent, EditStudent

3. **Redesign giao diện theo mockup**
   - Chuyển từ multi-page (React Router) sang single-page layout
   - Header gradient tối với badge "STUDENT MANAGEMENT", tiêu đề "Academic Ledger"
   - Stats row: Total Students, Average GPA, Honors (≥ 3.5), Top Major
   - Layout 2 cột: Form Add/Edit bên trái, Student List bên phải
   - GPA badge có màu (xanh/cam/đỏ), nút Edit/Delete styled
   - Responsive design cho mobile
