# Setup Guide - Study Plan Program

This guide will walk you through setting up the Study Plan Program on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm or pnpm** - Comes with Node.js
- **Git** (optional) - For version control

## Quick Start

### Step 1: Download the Project

If you received the project as a ZIP file, extract it to your desired location.

```bash
cd /path/to/my-graduation-project
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create a virtual environment (recommended):**

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Verify installation:**
```bash
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

5. **Test the API:**

Open a new terminal and run:
```bash
curl http://localhost:8000/
```

You should see:
```json
{"message":"Welcome to Study Plan API","status":"running"}
```

6. **Stop the server** (Ctrl+C in the terminal)

### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
```bash
cd /path/to/my-graduation-project/frontend
```

2. **Install Node.js dependencies:**

**Using npm:**
```bash
npm install
```

**Using pnpm (faster):**
```bash
pnpm install
```

3. **Start the development server:**

**Using npm:**
```bash
npm run dev
```

**Using pnpm:**
```bash
pnpm dev
```

You should see:
```
VITE v6.3.5  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

4. **Open your browser** and navigate to `http://localhost:5173`

## Running the Application

### Method 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev  # or: pnpm dev
```

### Method 2: Using Screen/Tmux (Linux/macOS)

**Using screen:**
```bash
# Start backend
screen -S backend
cd backend && source venv/bin/activate && python main.py
# Press Ctrl+A then D to detach

# Start frontend
screen -S frontend
cd frontend && npm run dev
# Press Ctrl+A then D to detach

# To reattach:
screen -r backend
screen -r frontend
```

## Verifying the Setup

### 1. Check Backend

Open browser and visit:
- API Root: http://localhost:8000/
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### 2. Check Frontend

Open browser and visit:
- Application: http://localhost:5173/

### 3. Test CORS

In the browser console (F12), run:
```javascript
fetch('http://localhost:8000/courses')
  .then(res => res.json())
  .then(data => console.log(data))
```

You should see the courses data without CORS errors.

## Troubleshooting

### Backend Issues

**Problem: `ModuleNotFoundError: No module named 'fastapi'`**

Solution:
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: `Address already in use`**

Solution:
```bash
# Find and kill the process using port 8000
# On Linux/macOS:
lsof -ti:8000 | xargs kill -9

# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Problem: Database errors**

Solution:
```bash
# Delete the database file and restart
cd backend
rm study_plan.db
python main.py
```

### Frontend Issues

**Problem: `Cannot find module` errors**

Solution:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: `Port 5173 is already in use`**

Solution:
```bash
# Kill the process or use a different port
# On Linux/macOS:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change the port in vite.config.js:
# server: { port: 5174 }
```

**Problem: CORS errors**

Solution:
1. Make sure backend is running on port 8000
2. Make sure frontend is running on port 5173
3. Check `main.py` CORS configuration:
```python
allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]
```

### General Issues

**Problem: Python not found**

Solution:
- Install Python from https://python.org
- Make sure Python is added to PATH
- Try `python3` instead of `python`

**Problem: Node.js not found**

Solution:
- Install Node.js from https://nodejs.org
- Restart your terminal after installation
- Verify with: `node --version`

## Database Management

### Viewing the Database

**Using SQLite Browser:**
1. Download [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `backend/study_plan.db`

**Using Command Line:**
```bash
cd backend
sqlite3 study_plan.db

# SQLite commands:
.tables                    # List all tables
.schema courses           # Show table structure
SELECT * FROM courses;    # Query data
.quit                     # Exit
```

### Resetting the Database

To start fresh:
```bash
cd backend
rm study_plan.db
python main.py  # This will recreate the database
```

### Backing Up the Database

```bash
cd backend
cp study_plan.db study_plan_backup_$(date +%Y%m%d).db
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Vite automatically reloads when you edit files
- **Backend**: Restart the server after code changes

For backend auto-reload, use:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

Create a `.env` file in the backend directory for configuration:
```env
DATABASE_URL=sqlite:///./study_plan.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Code Formatting

**Python (Backend):**
```bash
pip install black
black main.py models.py schemas.py database.py
```

**JavaScript (Frontend):**
```bash
npm install --save-dev prettier
npx prettier --write "src/**/*.{js,jsx}"
```

## Production Deployment

### Backend

1. **Use PostgreSQL instead of SQLite**
2. **Set up environment variables**
3. **Use Gunicorn with Uvicorn workers:**
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend

1. **Build for production:**
```bash
npm run build
```

2. **Serve the `dist` folder** using:
- Nginx
- Apache
- Vercel
- Netlify

## Next Steps

1. **Read the API Guide** - See `API_GUIDE.md` for API usage examples
2. **Explore the Code** - Understand the project structure
3. **Add Features** - Extend the application with new functionality
4. **Test** - Write tests for your code

## Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check the browser console (F12) for frontend errors
4. Check terminal output for backend errors
5. Consult the README.md for additional information

## Useful Commands Reference

### Backend
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Run with auto-reload
uvicorn main:app --reload

# Deactivate virtual environment
deactivate
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database
```bash
# Open database
sqlite3 backend/study_plan.db

# Backup database
cp backend/study_plan.db backup.db

# Reset database
rm backend/study_plan.db
```

Good luck with your graduation project! 🎓
