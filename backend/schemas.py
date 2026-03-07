from pydantic import BaseModel, Field


# ===== Class schemas =====
class ClassBase(BaseModel):
    class_id: str
    class_name: str
    advisor: str


class ClassCreate(ClassBase):
    pass


class ClassUpdate(BaseModel):
    class_name: str | None = None
    advisor: str | None = None


class ClassResponse(ClassBase):
    class Config:
        from_attributes = True


# ===== Student schemas =====
class StudentBase(BaseModel):
    student_id: str
    name: str
    birth_year: int
    major: str
    gpa: float = Field(ge=0, le=4)
    class_id: str | None = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: str | None = None
    birth_year: int | None = None
    major: str | None = None
    gpa: float | None = Field(default=None, ge=0, le=4)
    class_id: str | None = None


class StudentResponse(StudentBase):
    class_name: str | None = None

    class Config:
        from_attributes = True
