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

### Phần 2 — Thay đổi nghiệp vụ & mở rộng chức năng

1. **Thêm bảng Class (Lớp học)**
   - Tạo model `Class` (class_id, class_name, advisor)
   - CRUD API cho classes: GET, POST, PUT, DELETE /classes
   - Không cho phép xóa lớp đang có sinh viên

2. **Liên kết Student ↔ Class**
   - Thêm `class_id` (foreign key) vào bảng Student
   - Student form có dropdown chọn lớp
   - Hiển thị tên lớp trong bảng danh sách

3. **Tìm kiếm sinh viên**
   - API: `GET /students?search=...` — tìm theo tên (case-insensitive)
   - Frontend: ô search real-time trong bảng Student List

4. **Thống kê**
   - API: `GET /stats` — tổng SV, GPA trung bình, số SV theo ngành
   - Stats cards hiển thị: Total Students, Average GPA, Honors (≥ 3.5), Students by Major

5. **Xuất CSV**
   - API: `GET /students/export/csv` — trả file CSV
   - Nút "Export CSV" trên header, tự động download file

6. **Tab navigation**
   - Tab "Students" và "Classes" để quản lý riêng biệt
   - Mỗi tab có form thêm/sửa bên trái, bảng danh sách bên phải
