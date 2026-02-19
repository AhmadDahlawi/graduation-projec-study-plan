# Study Plan Program - Graduation Project

A comprehensive web application for managing academic study plans and courses, built with React.js frontend and FastAPI backend.

## Project Structure

```
/my-graduation-project
├── /backend            # FastAPI & SQLAlchemy logic
│   ├── main.py         # Entry point for API (includes CORS for localhost:5173)
│   ├── models.py       # SQLAlchemy database tables
│   ├── schemas.py      # Pydantic data validation
│   ├── database.py     # Connection setup (using SQLite)
│   └── requirements.txt
├── /frontend           # React.js application
│   ├── /src
│   │   ├── App.jsx     # Main application component
│   │   ├── main.jsx    # Application entry point
│   │   └── /components # UI components
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Features

### Backend (FastAPI + SQLAlchemy)

- **RESTful API** with full CRUD operations
- **SQLite Database** for data persistence
- **CORS Configuration** for frontend communication
- **Data Validation** using Pydantic schemas
- **Relationship Management** for prerequisites and plans

### Frontend (React.js + Vite)

- **Bilingual Support** (Arabic/English)
- **Course Management** with detailed information
- **Study Plan Creation** and management
- **Search and Filter** functionality
- **Excel Import/Export** capabilities
- **Responsive UI** with TailwindCSS

## Database Schema

### Tables

1. **courses** - Stores course information
   - Basic info: code, name (AR/EN), credits, semester
   - Details: type, mode, hours (lecture/lab/training)
   - Additional: description, objectives, instructor, etc.

2. **plans** - Stores study plans
   - Plan name and metadata
   - Max credits per semester
   - Associated courses

3. **course_prerequisites** - Many-to-many relationship for prerequisites
4. **plan_courses** - Many-to-many relationship for plan courses

## API Endpoints

### Course Endpoints

- `GET /courses` - Get all courses (with optional filters)
- `GET /courses/{id}` - Get specific course
- `POST /courses` - Create new course
- `PUT /courses/{id}` - Update course
- `DELETE /courses/{id}` - Delete course
- `GET /courses/search/?q={query}` - Search courses

### Plan Endpoints

- `GET /plans` - Get all plans
- `GET /plans/{id}` - Get specific plan
- `POST /plans` - Create new plan
- `PUT /plans/{id}` - Update plan
- `DELETE /plans/{id}` - Delete plan
- `GET /plans/search/?q={query}` - Search plans

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python3 main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

## Usage

### Running Both Servers

1. **Terminal 1** - Start Backend:
```bash
cd backend
python3 main.py
```

2. **Terminal 2** - Start Frontend:
```bash
cd frontend
npm run dev
```

3. Open browser and navigate to `http://localhost:5173`

### API Documentation

Once the backend is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **Alternative docs**: `http://localhost:8000/redoc`

## Data Models

### Course Model

```json
{
  "id": 1,
  "semester": "1",
  "name_ar": "مقدمة في البرمجة",
  "name_en": "Introduction to Programming",
  "code": "CS101",
  "credits": 3,
  "type": "Required",
  "mode": "In-Person",
  "lecture_hours": 2,
  "lab_hours": 1,
  "training_hours": 0,
  "department": "Computer Science",
  "prerequisite_codes": [],
  "description": "...",
  "objectives": "...",
  "assessment": "...",
  "instructor": "...",
  "materials": "...",
  "grading": "...",
  "schedule": "...",
  "office_hours": "...",
  "notes": "..."
}
```

### Plan Model

```json
{
  "id": 1,
  "name": "Computer Science Bachelor's Plan",
  "max_credits_per_semester": 18,
  "courses": [...],
  "total_credits": 120,
  "semesters": 8
}
```

## Validation Rules

1. **Course Code** - Must be unique
2. **Course Name** - Must be unique (both Arabic and English)
3. **Credits** - Must be greater than 0
4. **Plan Name** - Must be unique
5. **Prerequisites** - Must reference existing courses

## Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **SQLite** - Lightweight database

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **Radix UI** - Accessible components
- **Lucide React** - Icon library

## Development Notes

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

To add more origins, edit `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "your-new-origin"],
    ...
)
```

### Database Location

The SQLite database file `study_plan.db` will be created in the `backend` directory when you first run the server.

### Adding New Fields

To add new fields to models:
1. Update `models.py` (SQLAlchemy model)
2. Update `schemas.py` (Pydantic schema)
3. Update `main.py` (API endpoints if needed)
4. Delete `study_plan.db` to recreate with new schema

## Future Enhancements

- [ ] User authentication and authorization
- [ ] PostgreSQL/MySQL support for production
- [ ] Advanced prerequisite validation
- [ ] Course scheduling conflict detection
- [ ] GPA calculation
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Mobile app version

## License

This is a graduation project for educational purposes.

## Contact

For questions or support, please contact the project maintainer.
