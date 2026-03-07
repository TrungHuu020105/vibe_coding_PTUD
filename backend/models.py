from sqlalchemy import Column, String, Integer, Float
from database import Base


class Student(Base):
    __tablename__ = "students"

    student_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    birth_year = Column(Integer, nullable=False)
    major = Column(String, nullable=False)
    gpa = Column(Float, nullable=False)
