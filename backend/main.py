from fastapi import FastAPI, Depends, HTTPException, Query, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta
import models, schemas, database
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, decode_access_token
from excel_utils import create_excel_template, validate_excel_file, validate_plan_data, export_plan_to_excel
from fastapi.responses import Response
import io
import pandas as pd

# 1. Create database tables
models.Base.metadata.create_all(bind=engine)

# 2. Create default Admin user
def create_admin():
    db = database.SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.username == "Admin").first()
        if not admin:
            admin = models.User(
                username="Admin",
                email="admin@university.edu",
                hashed_password=hash_password("12345"),
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("✓ SUCCESS: Default Admin user created (Admin / 12345)")
        else:
            print("✓ INFO: Admin user already exists")
    except Exception as e:
        print(f"ERROR creating admin: {e}")
    finally:
        db.close()

create_admin()

app = FastAPI(title="Study Plan API")

# 3. CONFIGURE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "online", "message": "Backend is working!"}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = models.User(username=user.username, email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login")
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "username": user.username, "email": user.email}}

@app.get("/auth/me")
def get_me(token: str, db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload: raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter(models.User.username == payload.get("sub")).first()
    if not user: raise HTTPException(status_code=401, detail="User not found")
    return {"id": user.id, "username": user.username, "email": user.email}

# --- COURSE & PLAN ENDPOINTS ---

@app.get("/courses", response_model=List[schemas.CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    for c in courses: c.prerequisite_codes = [p.code for p in c.prerequisites]
    return courses

@app.get("/courses/{course_id}", response_model=schemas.CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c: raise HTTPException(status_code=404, detail="Course not found")
    c.prerequisite_codes = [p.code for p in c.prerequisites]
    return c

@app.post("/courses", response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_c = models.Course(**course.model_dump(exclude={'prerequisite_codes'}))
    if course.prerequisite_codes:
        db_c.prerequisites = db.query(models.Course).filter(models.Course.code.in_(course.prerequisite_codes)).all()
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    db_c.prerequisite_codes = [p.code for p in db_c.prerequisites]
    return db_c

@app.put("/courses/{course_id}", response_model=schemas.CourseResponse)
def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_c: raise HTTPException(status_code=404, detail="Course not found")
    for k, v in course.model_dump(exclude={'prerequisite_codes'}).items(): setattr(db_c, k, v)
    if course.prerequisite_codes is not None:
        db_c.prerequisites = db.query(models.Course).filter(models.Course.code.in_(course.prerequisite_codes)).all()
    db.commit()
    db.refresh(db_c)
    db_c.prerequisite_codes = [p.code for p in db_c.prerequisites]
    return db_c

@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    c = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not c: raise HTTPException(status_code=404, detail="Course not found")
    db.delete(c)
    db.commit()
    return {"message": "Deleted"}

@app.get("/courses/search/", response_model=List[schemas.CourseResponse])
def search_courses(q: str, db: Session = Depends(get_db)):
    courses = db.query(models.Course).filter((models.Course.name_ar.contains(q)) | (models.Course.name_en.contains(q)) | (models.Course.code.contains(q))).all()
    for c in courses: c.prerequisite_codes = [p.code for p in c.prerequisites]
    return courses

@app.get("/plans", response_model=List[schemas.PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    plans = db.query(models.Plan).all()
    res = []
    for p in plans:
        pr = schemas.PlanResponse.model_validate(p)
        pr.total_credits = sum(c.credits for c in p.courses)
        for i, c in enumerate(p.courses): pr.courses[i].prerequisite_codes = [x.code for x in c.prerequisites]
        res.append(pr)
    return res

@app.get("/plans/{plan_id}", response_model=schemas.PlanResponse)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not p: raise HTTPException(status_code=404, detail="Plan not found")
    res = schemas.PlanResponse.model_validate(p)
    res.total_credits = sum(c.credits for c in p.courses)
    for i, c in enumerate(p.courses): res.courses[i].prerequisite_codes = [x.code for x in c.prerequisites]
    return res

@app.post("/plans", response_model=schemas.PlanResponse)
def create_plan(plan: schemas.PlanCreate, db: Session = Depends(get_db)):
    db_p = models.Plan(name=plan.name, max_credits_per_semester=plan.max_credits_per_semester)
    if plan.course_ids: db_p.courses = db.query(models.Course).filter(models.Course.id.in_(plan.course_ids)).all()
    db.add(db_p)
    db.commit()
    db.refresh(db_p)
    res = schemas.PlanResponse.model_validate(db_p)
    res.total_credits = sum(c.credits for c in db_p.courses)
    for i, c in enumerate(db_p.courses): res.courses[i].prerequisite_codes = [x.code for x in c.prerequisites]
    return res

@app.put("/plans/{plan_id}", response_model=schemas.PlanResponse)
def update_plan(plan_id: int, plan: schemas.PlanCreate, db: Session = Depends(get_db)):
    db_p = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not db_p: raise HTTPException(status_code=404, detail="Plan not found")
    db_p.name, db_p.max_credits_per_semester = plan.name, plan.max_credits_per_semester
    if plan.course_ids is not None: db_p.courses = db.query(models.Course).filter(models.Course.id.in_(plan.course_ids)).all()
    db.commit()
    db.refresh(db_p)
    res = schemas.PlanResponse.model_validate(db_p)
    res.total_credits = sum(c.credits for c in db_p.courses)
    for i, c in enumerate(db_p.courses): res.courses[i].prerequisite_codes = [x.code for x in c.prerequisites]
    return res

@app.delete("/plans/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not p: raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(p)
    db.commit()
    return {"message": "Deleted"}

# --- EXCEL ENDPOINTS ---

@app.get("/plans/excel/template")
def download_template():
    try:
        content = create_excel_template()
        return Response(
            content=content,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=study_plan_template.xlsx"}
        )
    except Exception as e:
        print(f"Template error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating template: {str(e)}")

@app.post("/plans/excel/import")
async def import_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        is_valid, result = validate_excel_file(io.BytesIO(contents))
        if not is_valid: raise HTTPException(status_code=400, detail=result)
        df = result
        errs = validate_plan_data(df)
        if errs: raise HTTPException(status_code=400, detail="\n".join(errs))
        
        p_name = str(df['Plan Name'].iloc[0]).strip()
        max_c = int(df['Max Credits Per Semester'].iloc[0])
        
        # Check if plan already exists
        if db.query(models.Plan).filter(models.Plan.name.ilike(p_name)).first():
            raise HTTPException(status_code=400, detail=f"Plan '{p_name}' already exists")
            
        db_p = models.Plan(name=p_name, max_credits_per_semester=max_c)
        db.add(db_p); db.flush()
        
        plan_courses = []
        for _, row in df.iterrows():
            code = str(row['Course Code']).strip().upper()
            
            # Check if course already exists in general courses list
            db_c = db.query(models.Course).filter(models.Course.code == code).first()
            
            if db_c:
                # Update existing course details
                db_c.semester = str(int(row['Semester']))
                db_c.name_ar = str(row['Course Name (Arabic)'])
                db_c.name_en = str(row['Course Name (English)'])
                db_c.credits = int(row['Credit Hours'])
                db_c.type = str(row['Course Type'])
                db_c.mode = str(row['Study Mode'])
                db_c.lecture_hours = int(row['Lecture Hours']) if not pd.isna(row['Lecture Hours']) else 0
                db_c.lab_hours = int(row['Lab Hours']) if not pd.isna(row['Lab Hours']) else 0
                db_c.training_hours = int(row['Training Hours']) if not pd.isna(row['Training Hours']) else 0
                db_c.department = str(row['Department']) if not pd.isna(row['Department']) else None
            else:
                # Create new course
                db_c = models.Course(
                    semester=str(int(row['Semester'])),
                    name_ar=str(row['Course Name (Arabic)']),
                    name_en=str(row['Course Name (English)']),
                    code=code,
                    credits=int(row['Credit Hours']),
                    type=str(row['Course Type']),
                    mode=str(row['Study Mode']),
                    lecture_hours=int(row['Lecture Hours']) if not pd.isna(row['Lecture Hours']) else 0,
                    lab_hours=int(row['Lab Hours']) if not pd.isna(row['Lab Hours']) else 0,
                    training_hours=int(row['Training Hours']) if not pd.isna(row['Training Hours']) else 0,
                    department=str(row['Department']) if not pd.isna(row['Department']) else None
                )
                db.add(db_c)
            
            db.flush()
            plan_courses.append(db_c)
        
        db_p.courses = plan_courses
        db.commit(); db.refresh(db_p)
        
        res = schemas.PlanResponse.model_validate(db_p)
        res.total_credits = sum(c.credits for c in db_p.courses)
        for i, c in enumerate(db_p.courses):
            res.courses[i].prerequisite_codes = [x.code for x in c.prerequisites]
            
        return {"message": "Success", "plan": res}
    except Exception as e:
        db.rollback()
        print(f"Import error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/plans/{plan_id}/excel/export")
def export_excel(plan_id: int, db: Session = Depends(get_db)):
    try:
        p = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
        if not p: raise HTTPException(status_code=404, detail="Plan not found")
        
        p_data = {'name': p.name, 'max_credits_per_semester': p.max_credits_per_semester}
        c_data = []
        for c in p.courses:
            c_data.append({
                'semester': c.semester,
                'name_ar': c.name_ar,
                'name_en': c.name_en,
                'code': c.code,
                'credits': c.credits,
                'type': c.type,
                'mode': c.mode,
                'lecture_hours': c.lecture_hours,
                'lab_hours': c.lab_hours,
                'training_hours': c.training_hours,
                'department': c.department,
                'prerequisite_codes': [x.code for x in c.prerequisites]
            })
            
        content = export_plan_to_excel(p_data, c_data)
        return Response(
            content=content,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={p.name}_plan.xlsx"}
        )
    except Exception as e:
        print(f"Export error: {e}")
        raise HTTPException(status_code=500, detail=f"Error exporting plan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
