import csv
import io
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, get_db, Base
from models import Student, Class
from schemas import (
    StudentCreate, StudentUpdate, StudentResponse,
    ClassCreate, ClassUpdate, ClassResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ CLASS ENDPOINTS ============

@app.get("/classes", response_model=list[ClassResponse])
def get_classes(db: Session = Depends(get_db)):
    return db.query(Class).all()


@app.post("/classes", response_model=ClassResponse, status_code=201)
def create_class(cls: ClassCreate, db: Session = Depends(get_db)):
    existing = db.query(Class).filter(Class.class_id == cls.class_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Class ID already exists")
    db_class = Class(**cls.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


@app.put("/classes/{class_id}", response_model=ClassResponse)
def update_class(class_id: str, cls: ClassUpdate, db: Session = Depends(get_db)):
    db_class = db.query(Class).filter(Class.class_id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    for key, value in cls.model_dump(exclude_unset=True).items():
        setattr(db_class, key, value)
    db.commit()
    db.refresh(db_class)
    return db_class


@app.delete("/classes/{class_id}", status_code=204)
def delete_class(class_id: str, db: Session = Depends(get_db)):
    db_class = db.query(Class).filter(Class.class_id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    if db.query(Student).filter(Student.class_id == class_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete class with students")
    db.delete(db_class)
    db.commit()
    return None


# ============ STUDENT ENDPOINTS ============

def _student_response(student: Student) -> dict:
    return {
        "student_id": student.student_id,
        "name": student.name,
        "birth_year": student.birth_year,
        "major": student.major,
        "gpa": student.gpa,
        "class_id": student.class_id,
        "class_name": student.class_rel.class_name if student.class_rel else None,
    }


@app.get("/students", response_model=list[StudentResponse])
def get_students(search: str = Query(default="", max_length=100), db: Session = Depends(get_db)):
    query = db.query(Student)
    if search:
        query = query.filter(Student.name.ilike(f"%{search}%"))
    students = query.all()
    return [_student_response(s) for s in students]


@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return _student_response(student)


@app.post("/students", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.student_id == student.student_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student ID already exists")
    if student.class_id:
        cls = db.query(Class).filter(Class.class_id == student.class_id).first()
        if not cls:
            raise HTTPException(status_code=400, detail="Class not found")
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return _student_response(db_student)


@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: str, student: StudentUpdate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    update_data = student.model_dump(exclude_unset=True)
    if "class_id" in update_data and update_data["class_id"]:
        cls = db.query(Class).filter(Class.class_id == update_data["class_id"]).first()
        if not cls:
            raise HTTPException(status_code=400, detail="Class not found")
    for key, value in update_data.items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return _student_response(db_student)


@app.delete("/students/{student_id}", status_code=204)
def delete_student(student_id: str, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.student_id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return None


# ============ STATS ENDPOINT ============

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Student.student_id)).scalar()
    avg_gpa = db.query(func.avg(Student.gpa)).scalar()
    major_counts = (
        db.query(Student.major, func.count(Student.student_id))
        .group_by(Student.major)
        .all()
    )
    return {
        "total_students": total,
        "average_gpa": round(avg_gpa, 2) if avg_gpa else 0,
        "students_by_major": {major: count for major, count in major_counts},
    }


# ============ EXPORT CSV ============

@app.get("/students/export/csv")
def export_csv(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student ID", "Name", "Birth Year", "Major", "GPA", "Class ID", "Class Name"])
    for s in students:
        writer.writerow([
            s.student_id, s.name, s.birth_year, s.major, s.gpa,
            s.class_id or "",
            s.class_rel.class_name if s.class_rel else "",
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"},
    )
