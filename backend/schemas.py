from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Course Schemas
class CourseBase(BaseModel):
    semester: str
    nameAr: str
    nameEn: str
    code: str
    credits: int = Field(gt=0)
    type: str  # Required or Elective
    mode: str  # In-Person, Online, Hybrid
    lectureHours: int = Field(default=0, ge=0)
    labHours: int = Field(default=0, ge=0)
    trainingHours: int = Field(default=0, ge=0)
    department: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    assessment: Optional[str] = None
    instructor: Optional[str] = None
    materials: Optional[str] = None
    grading: Optional[str] = None
    schedule: Optional[str] = None
    officeHours: Optional[str] = None
    notes: Optional[str] = None

class CourseCreate(CourseBase):
    prerequisite_codes: List[str] = []

class CourseUpdate(BaseModel):
    semester: Optional[str] = None
    nameAr: Optional[str] = None
    nameEn: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = Field(default=None, gt=0)
    type: Optional[str] = None
    mode: Optional[str] = None
    lectureHours: Optional[int] = Field(default=None, ge=0)
    labHours: Optional[int] = Field(default=None, ge=0)
    trainingHours: Optional[int] = Field(default=None, ge=0)
    department: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    assessment: Optional[str] = None
    instructor: Optional[str] = None
    materials: Optional[str] = None
    grading: Optional[str] = None
    schedule: Optional[str] = None
    officeHours: Optional[str] = None
    notes: Optional[str] = None
    prerequisite_codes: Optional[List[str]] = None

class CourseResponse(CourseBase):
    id: int
    prerequisite_codes: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Plan Schemas
class PlanBase(BaseModel):
    name: str
    maxCreditsPerSemester: int = Field(default=18, gt=0)

class PlanCreate(PlanBase):
    course_ids: List[int] = []

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    maxCreditsPerSemester: Optional[int] = Field(default=None, gt=0)
    course_ids: Optional[List[int]] = None

class PlanResponse(PlanBase):
    id: int
    courses: List[CourseResponse] = []
    totalCredits: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
