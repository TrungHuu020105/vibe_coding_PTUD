from pydantic import BaseModel, Field


class StudentBase(BaseModel):
    student_id: str
    name: str
    birth_year: int
    major: str
    gpa: float = Field(ge=0, le=4)


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: str | None = None
    birth_year: int | None = None
    major: str | None = None
    gpa: float | None = Field(default=None, ge=0, le=4)


class StudentResponse(StudentBase):
    class Config:
        from_attributes = True
