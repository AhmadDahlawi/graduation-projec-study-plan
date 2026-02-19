# Quick Start Guide 🚀

Get your Study Plan Program running in **5 minutes**!

## Prerequisites Check ✓

Before starting, verify you have:
```bash
python3 --version   # Should be 3.8+
node --version      # Should be 18+
npm --version       # Should be 9+
```

If any command fails, install the missing software first.

---

## Step 1: Extract Project

Extract the ZIP file to your preferred location:
```bash
unzip my-graduation-project.zip
cd my-graduation-project
```

---

## Step 2: Start Backend (Terminal 1)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate        # macOS/Linux
# OR
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

✅ **Success**: You should see `Uvicorn running on http://0.0.0.0:8000`

**Keep this terminal open!**

---

## Step 3: Start Frontend (Terminal 2)

Open a **new terminal** window:

```bash
# Navigate to frontend
cd my-graduation-project/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

✅ **Success**: You should see `Local: http://localhost:5173/`

**Keep this terminal open!**

---

## Step 4: Open Application

Open your browser and go to:
```
http://localhost:5173
```

🎉 **Done!** Your application is now running!

---

## Quick Test

### Test Backend API

Open a new terminal and run:
```bash
curl http://localhost:8000/
```

You should see:
```json
{"message":"Welcome to Study Plan API","status":"running"}
```

### Test API Docs

Visit in browser:
```
http://localhost:8000/docs
```

You should see interactive API documentation.

---

## Common Issues & Fixes

### ❌ "Port already in use"

**Backend (port 8000):**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Frontend (port 5173):**
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### ❌ "Module not found" (Backend)

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate

# Reinstall
pip install -r requirements.txt
```

### ❌ "Cannot find module" (Frontend)

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ❌ CORS errors in browser

1. Make sure backend is running on port 8000
2. Make sure frontend is running on port 5173
3. Restart both servers

---

## Stopping the Application

### Stop Backend
In Terminal 1, press: `Ctrl + C`

### Stop Frontend
In Terminal 2, press: `Ctrl + C`

### Deactivate Virtual Environment
```bash
deactivate
```

---

## Next Steps

1. ✅ Application is running
2. 📖 Read `README.md` for full documentation
3. 🔧 Read `API_GUIDE.md` to learn the API
4. 💻 Start developing!

---

## Useful URLs

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

---

## File Structure Overview

```
my-graduation-project/
├── backend/              ← Backend code here
│   ├── main.py          ← API endpoints
│   ├── models.py        ← Database models
│   └── ...
├── frontend/            ← Frontend code here
│   ├── src/
│   │   └── App.jsx     ← Main component
│   └── ...
└── README.md           ← Full documentation
```

---

## Development Workflow

### Making Changes

**Backend changes:**
1. Edit files in `backend/`
2. Stop server (Ctrl+C)
3. Restart: `python main.py`

**Frontend changes:**
1. Edit files in `frontend/src/`
2. Changes auto-reload (no restart needed!)

### Viewing Logs

**Backend logs:** Check Terminal 1
**Frontend logs:** Check Terminal 2
**Browser errors:** Press F12 → Console tab

---

## Getting Help

If you're stuck:
1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check `API_GUIDE.md` for API examples
3. Check browser console (F12) for errors
4. Check terminal output for error messages

---

**That's it! You're ready to go! 🎓**

Happy coding! 💻
