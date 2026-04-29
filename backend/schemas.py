from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime
import re

# Course Schemas
class CourseBase(BaseModel):
    semester: str
    name_ar: str = Field(..., alias="nameAr")
    name_en: str = Field(..., alias="nameEn")
    code: str
    credits: int = Field(gt=0)
    type: str  # Required or Elective
    mode: str  # In-Person, Online, Hybrid
    lecture_hours: int = Field(default=0, ge=0, alias="lectureHours")
    lab_hours: int = Field(default=0, ge=0, alias="labHours")
    training_hours: int = Field(default=0, ge=0, alias="trainingHours")
    department: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    assessment: Optional[str] = None
    instructor: Optional[str] = None
    materials: Optional[str] = None
    grading: Optional[str] = None
    schedule: Optional[str] = None
    office_hours: Optional[str] = Field(default=None, alias="officeHours")
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    @field_validator('semester')
    @classmethod
    def validate_semester(cls, v):
        try:
            sem = int(v)
            if sem < 1 or sem > 12:
                raise ValueError('Semester must be between 1 and 12')
        except ValueError:
            raise ValueError('Semester must be a valid number')
        return v

    @field_validator('name_ar')
    @classmethod
    def validate_name_ar(cls, v):
        if not v or not v.strip():
            raise ValueError('Arabic course name cannot be empty')
        if not re.search(r'[\u0600-\u06FF]', v):
            raise ValueError('Arabic course name must contain Arabic characters')
        return v.strip()

    @field_validator('name_en')
    @classmethod
    def validate_name_en(cls, v):
        if not v or not v.strip():
            raise ValueError('English course name cannot be empty')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('English course name must contain English characters')
        return v.strip()

    @field_validator('code')
    @classmethod
    def validate_code(cls, v):
        if not v or not v.strip():
            raise ValueError('Course code cannot be empty')
        if not re.match(r'^[A-Z0-9]{2,10}$', v.upper()):
            raise ValueError('Course code must be 2-10 alphanumeric characters')
        return v.upper().strip()

    @field_validator('credits')
    @classmethod
    def validate_credits(cls, v):
        if v <= 0:
            raise ValueError('Credits must be greater than 0')
        if v > 6:
            raise ValueError('Credits cannot exceed 6')
        return v

    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        if v not in ['Required', 'Elective']:
            raise ValueError('Type must be either Required or Elective')
        return v

    @field_validator('mode')
    @classmethod
    def validate_mode(cls, v):
        if v not in ['In-Person', 'Online', 'Hybrid']:
            raise ValueError('Mode must be In-Person, Online, or Hybrid')
        return v

class CourseCreate(CourseBase):
    prerequisite_codes: List[str] = Field(default=[], alias="prerequisiteCodes")

class CourseUpdate(BaseModel):
    semester: Optional[str] = None
    name_ar: Optional[str] = Field(default=None, alias="nameAr")
    name_en: Optional[str] = Field(default=None, alias="nameEn")
    code: Optional[str] = None
    credits: Optional[int] = Field(default=None, gt=0)
    type: Optional[str] = None
    mode: Optional[str] = None
    lecture_hours: Optional[int] = Field(default=None, ge=0, alias="lectureHours")
    lab_hours: Optional[int] = Field(default=None, ge=0, alias="labHours")
    training_hours: Optional[int] = Field(default=None, ge=0, alias="trainingHours")
    department: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[str] = None
    assessment: Optional[str] = None
    instructor: Optional[str] = None
    materials: Optional[str] = None
    grading: Optional[str] = None
    schedule: Optional[str] = None
    office_hours: Optional[str] = Field(default=None, alias="officeHours")
    notes: Optional[str] = None
    prerequisite_codes: Optional[List[str]] = Field(default=None, alias="prerequisiteCodes")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class CourseResponse(CourseBase):
    id: int
    prerequisite_codes: List[str] = Field(default=[], alias="prerequisiteCodes")
    created_at: datetime
    updated_at: datetime

# Plan Schemas
class PlanBase(BaseModel):
    name: str
    max_credits_per_semester: int = Field(default=18, gt=0, alias="maxCreditsPerSemester")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Plan name cannot be empty')
        if len(v.strip()) > 100:
            raise ValueError('Plan name cannot exceed 100 characters')
        return v.strip()

    @field_validator('max_credits_per_semester')
    @classmethod
    def validate_max_credits(cls, v):
        if v <= 0:
            raise ValueError('Max credits must be greater than 0')
        if v > 30:
            raise ValueError('Max credits cannot exceed 30')
        return v

class PlanCreate(PlanBase):
    course_ids: List[int] = Field(default=[], alias="courseIds")

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    max_credits_per_semester: Optional[int] = Field(default=None, gt=0, alias="maxCreditsPerSemester")
    course_ids: Optional[List[int]] = Field(default=None, alias="courseIds")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class PlanResponse(PlanBase):
    id: int
    courses: List[CourseResponse] = []
    total_credits: int = Field(default=0, alias="totalCredits")
    created_at: datetime
    updated_at: datetime


# User/Auth Schemas
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not v or not v.strip():
            raise ValueError('Username cannot be empty')
        if len(v.strip()) < 3:
            raise ValueError('Username must be at least 3 characters')
        if len(v.strip()) > 50:
            raise ValueError('Username cannot exceed 50 characters')
        if not re.match(r'^[a-zA-Z0-9_-]+$', v.strip()):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.strip()

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not v or not v.strip():
            raise ValueError('Password cannot be empty')
        if len(v.strip()) < 5:
            raise ValueError('Password must be at least 5 characters')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
