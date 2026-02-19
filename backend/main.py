import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas, database
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Plan API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Study Plan API", "status": "running"}

# --- Course Endpoints ---

@app.post("/courses", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.code == course.code).first()
    if db_course:
        raise HTTPException(status_code=400, detail="Course code already exists")
    
    course_data = course.dict(exclude={'prerequisite_codes'})
    db_course = models.Course(**course_data)
    
    if course.prerequisite_codes:
        prereqs = db.query(models.Course).filter(models.Course.code.in_(course.prerequisite_codes)).all()
        db_course.prerequisites = prereqs
        
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    res = schemas.CourseResponse.from_orm(db_course)
    res.prerequisite_codes = [p.code for p in db_course.prerequisites]
    return res

@app.get("/courses", response_model=List[schemas.CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    result = []
    for course in courses:
        res = schemas.CourseResponse.from_orm(course)
        res.prerequisite_codes = [p.code for p in course.prerequisites]
        result.append(res)
    return result

@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"message": "Deleted"}

# --- Plan Endpoints ---

@app.post("/plans", response_model=schemas.PlanResponse)
def create_plan(plan: schemas.PlanCreate, db: Session = Depends(get_db)):
    db_plan = models.Plan(name=plan.name, maxCreditsPerSemester=plan.maxCreditsPerSemester)
    if plan.course_ids:
        db_plan.courses = db.query(models.Course).filter(models.Course.id.in_(plan.course_ids)).all()
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    res = schemas.PlanResponse.from_orm(db_plan)
    res.totalCredits = sum(c.credits for c in db_plan.courses)
    for i, c in enumerate(db_plan.courses):
        res.courses[i].prerequisite_codes = [p.code for p in c.prerequisites]
    return res

@app.get("/plans", response_model=List[schemas.PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    plans = db.query(models.Plan).all()
    result = []
    for plan in plans:
        res = schemas.PlanResponse.from_orm(plan)
        res.totalCredits = sum(c.credits for c in plan.courses)
        for i, c in enumerate(plan.courses):
            res.courses[i].prerequisite_codes = [p.code for p in c.prerequisites]
        result.append(res)
    return result

@app.delete("/plans/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    db_plan = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(db_plan)
    db.commit()
    return {"message": "Deleted"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
