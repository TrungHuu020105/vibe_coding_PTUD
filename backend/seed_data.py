"""
Seed script — chạy để sinh dữ liệu mẫu vào database.
Usage: python seed_data.py
"""
from database import engine, SessionLocal, Base
from models import Class, Student

# Drop tất cả bảng cũ rồi tạo lại (reset schema)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

CLASSES = [
    {"class_id": "C01", "class_name": "Khoa học máy tính 1", "advisor": "Nguyen Van A"},
    {"class_id": "C02", "class_name": "Kỹ thuật phần mềm 1", "advisor": "Tran Thi B"},
    {"class_id": "C03", "class_name": "Trí tuệ nhân tạo 1", "advisor": "Le Van C"},
]

STUDENTS = [
    {"student_id": "SV001", "name": "Lê Trung Hữu",    "birth_year": 2004, "major": "Data Science",       "gpa": 3.33, "class_id": "C01"},
    {"student_id": "SV002", "name": "Nguyễn Văn An",    "birth_year": 2003, "major": "Computer Science",   "gpa": 3.65, "class_id": "C01"},
    {"student_id": "SV003", "name": "Trần Thị Bích",    "birth_year": 2004, "major": "Software Engineering","gpa": 3.80, "class_id": "C02"},
    {"student_id": "SV004", "name": "Phạm Minh Đức",    "birth_year": 2003, "major": "Computer Science",   "gpa": 2.95, "class_id": "C01"},
    {"student_id": "SV005", "name": "Hoàng Thị Mai",    "birth_year": 2005, "major": "Artificial Intelligence","gpa": 3.72, "class_id": "C03"},
    {"student_id": "SV006", "name": "Võ Thanh Tùng",    "birth_year": 2004, "major": "Data Science",       "gpa": 3.10, "class_id": "C02"},
    {"student_id": "SV007", "name": "Đặng Thùy Linh",   "birth_year": 2003, "major": "Software Engineering","gpa": 3.55, "class_id": "C02"},
    {"student_id": "SV008", "name": "Bùi Quốc Huy",     "birth_year": 2004, "major": "Artificial Intelligence","gpa": 2.40, "class_id": "C03"},
    {"student_id": "SV009", "name": "Lý Hoàng Nam",     "birth_year": 2005, "major": "Computer Science",   "gpa": 3.90, "class_id": "C01"},
    {"student_id": "SV010", "name": "Ngô Phương Uyên",  "birth_year": 2004, "major": "Data Science",       "gpa": 3.45, "class_id": "C03"},
]


def seed():
    db = SessionLocal()
    try:
        # Thêm classes
        for c in CLASSES:
            if not db.query(Class).filter(Class.class_id == c["class_id"]).first():
                db.add(Class(**c))
                print(f"  + Class: {c['class_id']} — {c['class_name']}")

        # Thêm students
        for s in STUDENTS:
            if not db.query(Student).filter(Student.student_id == s["student_id"]).first():
                db.add(Student(**s))
                print(f"  + Student: {s['student_id']} — {s['name']}")

        db.commit()
        print("\n✅ Seed hoàn tất!")
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Đang seed dữ liệu...\n")
    seed()
