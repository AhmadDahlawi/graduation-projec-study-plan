from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Association table for course prerequisites (many-to-many)
course_prerequisites = Table(
    'course_prerequisites',
    Base.metadata,
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True),
    Column('prerequisite_id', Integer, ForeignKey('courses.id'), primary_key=True)
)

# Association table for plan courses (many-to-many)
plan_courses = Table(
    'plan_courses',
    Base.metadata,
    Column('plan_id', Integer, ForeignKey('plans.id'), primary_key=True),
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True)
)


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    semester = Column(String, nullable=False)
    nameAr = Column(String, nullable=False)
    nameEn = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True, index=True)
    credits = Column(Integer, nullable=False)
    type = Column(String, nullable=False)  # Required or Elective
    mode = Column(String, nullable=False)  # In-Person, Online, Hybrid
    lectureHours = Column(Integer, default=0)
    labHours = Column(Integer, default=0)
    trainingHours = Column(Integer, default=0)
    department = Column(String, nullable=True)
    
    # Optional detailed fields
    description = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    assessment = Column(Text, nullable=True)
    instructor = Column(String, nullable=True)
    materials = Column(Text, nullable=True)
    grading = Column(Text, nullable=True)
    schedule = Column(String, nullable=True)
    officeHours = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    prerequisites = relationship(
        'Course',
        secondary=course_prerequisites,
        primaryjoin=id == course_prerequisites.c.course_id,
        secondaryjoin=id == course_prerequisites.c.prerequisite_id,
        backref='required_by'
    )
    
    plans = relationship('Plan', secondary=plan_courses, back_populates='courses')


class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    maxCreditsPerSemester = Column(Integer, default=18)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    courses = relationship('Course', secondary=plan_courses, back_populates='plans')
