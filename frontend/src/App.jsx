import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { CheckCircle, AlertCircle, Trash2, Edit, X, Globe, Plus, Download, Upload, FileSpreadsheet, Eye, Save, Menu, BookOpen, Calendar, Search } from 'lucide-react'
import universityLogo from './assets/university-logo.png'
import './App.css'

// Translation object
const translations = {
  en: {
    title: "Study Plan Program",
    university: "UMM AL-QURA UNIVERSITY",
    downloadTemplate: "Download Template",
    importExcel: "Import Excel",
    exportExcel: "Export to Excel",
    maxCreditsLabel: "Max Credits Per Semester",
    addCourse: "Add Course",
    editCourse: "Edit Course",
    courseDetails: "Course Details",
    semester: "Semester",
    addSemester: "Add Semester",
    courseNameAr: "Course Name (Arabic)",
    courseNameEn: "Course Name (English)", 
    courseCode: "Course Code",
    creditHours: "Credit Hours",
    courseType: "Course Type",
    studyMode: "Study Mode",
    lectureHours: "Lecture Hours",
    labHours: "Lab Hours",
    trainingHours: "Training Hours",
    prerequisite: "Prerequisite",
    department: "Department",
    actions: "Actions",
    totalCredits: "Total Credit Hours",
    clearTable: "Clear Table",
    addCourseBtn: "Add Course",
    saveChanges: "Save Changes",
    cancelEdit: "Cancel Edit",
    success: "Success",
    error: "An error occurred",
    courseAdded: "Course added successfully",
    courseUpdated: "Course updated successfully",
    confirmClear: "Are you sure you want to clear the table?",
    clear: "Clear",
    cancel: "Cancel",
    ok: "OK",
    edit: "Edit",
    save: "Save",
    view: "View",
    required: "Required",
    elective: "Elective",
    inPerson: "In-Person",
    online: "Online",
    hybrid: "Hybrid",
    selectPrereq: "Select Prerequisite",
    none: "None",
    creditsExceeded: "Credit hours exceed the maximum limit for this semester",
    fieldRequired: "This field is required",
    invalidCredits: "Please enter valid credit hours",
    courseDescription: "Course Description",
    learningObjectives: "Learning Objectives",
    assessmentMethods: "Assessment Methods",
    instructor: "Instructor",
    courseMaterials: "Course Materials",
    gradingCriteria: "Grading Criteria",
    courseSchedule: "Course Schedule",
    officeHours: "Office Hours",
    courseNotes: "Additional Notes",
    templateDownloaded: "Template downloaded successfully",
    dataImported: "Data imported successfully",
    dataExported: "Data exported successfully",
    importError: "Error importing file. Please check the format.",
    selectFile: "Please select an Excel file to import",
    createPlan: "Create Plan",
    courses: "Courses",
    plans: "Plans",
    planName: "Plan Name",
    savePlan: "Save Plan",
    planSaved: "Plan saved successfully",
    enterPlanName: "Enter plan name",
    addFromExisting: "Add from Existing Courses",
    selectCourse: "Select Course",
    viewPlan: "View Plan",
    editPlan: "Edit Plan",
    planDetails: "Plan Details",
    addExistingCourse: "Add Existing Course",
    searchCourses: "Search courses...",
    searchPlans: "Search plans...",
    searchCoursesArabic: "Search in Arabic or English...",
    courseCodeExists: "Course code already exists",
    courseNameExists: "Course name already exists",
    planNameExists: "Plan name already exists",
    duplicateCourse: "Course already exists in the plan",
    invalidCourseCode: "Please enter a valid course code",
    prerequisiteNotFound: "Prerequisite validation failed",
    prerequisiteInSameTerm: "Prerequisites must be from previous terms",
    missingPrerequisites: "This course has missing prerequisites"
  },
  ar: {
    title: "برنامج الخطة الدراسية",
    university: "جامعة أم القرى",
    downloadTemplate: "تحميل النموذج",
    importExcel: "استيراد إكسل",
    exportExcel: "تصدير إلى إكسل",
    maxCreditsLabel: "الحد الأقصى للساعات المعتمدة للترم",
    addCourse: "إضافة مقرر",
    editCourse: "تعديل مقرر",
    courseDetails: "تفاصيل المقرر",
    semester: "الترم الدراسي",
    addSemester: "إضافة ترم",
    courseNameAr: "اسم المقرر بالعربي",
    courseNameEn: "اسم المقرر بالإنجليزي",
    courseCode: "رمز المقرر",
    creditHours: "الساعات المعتمدة",
    courseType: "نوع المقرر",
    studyMode: "نوع الدراسة",
    lectureHours: "ساعات نظري",
    labHours: "ساعات عملي",
    trainingHours: "ساعات تدريب",
    prerequisite: "المتطلب السابق",
    department: "القسم",
    actions: "الإجراءات",
    totalCredits: "إجمالي الساعات المعتمدة",
    clearTable: "مسح الجدول",
    addCourseBtn: "إضافة مقرر",
    saveChanges: "حفظ التغييرات",
    cancelEdit: "إلغاء التعديل",
    success: "نجح",
    error: "حدث خطأ",
    courseAdded: "تم إضافة المقرر بنجاح",
    courseUpdated: "تم تحديث المقرر بنجاح",
    confirmClear: "هل أنت متأكد من رغبتك في مسح الجدول؟",
    clear: "مسح",
    cancel: "إلغاء",
    ok: "موافق",
    edit: "تعديل",
    save: "حفظ",
    view: "عرض",
    required: "إجباري",
    elective: "اختياري",
    inPerson: "حضوري",
    online: "عن بعد",
    hybrid: "مدمج",
    selectPrereq: "اختر المتطلب السابق",
    none: "لا يوجد",
    creditsExceeded: "الساعات المعتمدة تتجاوز الحد الأقصى المسموح للترم",
    fieldRequired: "هذا الحقل مطلوب",
    invalidCredits: "يرجى إدخال ساعات معتمدة صحيحة",
    courseDescription: "وصف المقرر",
    learningObjectives: "أهداف التعلم",
    assessmentMethods: "طرق التقييم",
    instructor: "المدرس",
    courseMaterials: "مواد المقرر",
    gradingCriteria: "معايير التقدير",
    courseSchedule: "جدول المقرر",
    officeHours: "ساعات المكتب",
    courseNotes: "ملاحظات إضافية",
    templateDownloaded: "تم تحميل النموذج بنجاح",
    dataImported: "تم استيراد البيانات بنجاح",
    dataExported: "تم تصدير البيانات بنجاح",
    importError: "خطأ في استيراد الملف. يرجى التحقق من التنسيق.",
    selectFile: "يرجى اختيار ملف إكسل للاستيراد",
    createPlan: "إنشاء خطة",
    courses: "المقررات",
    plans: "الخطط",
    planName: "اسم الخطة",
    savePlan: "حفظ الخطة",
    planSaved: "تم حفظ الخطة بنجاح",
    enterPlanName: "أدخل اسم الخطة",
    addFromExisting: "إضافة من المقررات الموجودة",
    selectCourse: "اختر مقرر",
    viewPlan: "عرض الخطة",
    editPlan: "تعديل الخطة",
    planDetails: "تفاصيل الخطة",
    addExistingCourse: "إضافة مقرر موجود",
    searchCourses: "البحث في المقررات...",
    searchPlans: "البحث في الخطط...",
    searchCoursesArabic: "البحث بالعربية أو الإنجليزية...",
    courseCodeExists: "رمز المقرر موجود مسبقاً",
    courseNameExists: "اسم المقرر موجود مسبقاً",
    planNameExists: "اسم الخطة موجود مسبقاً",
    duplicateCourse: "المقرر موجود مسبقاً في الخطة",
    invalidCourseCode: "يرجى إدخال رمز مقرر صحيح",
    prerequisiteNotFound: "فشل في التحقق من المتطلبات السابقة",
    prerequisiteInSameTerm: "المتطلبات السابقة يجب أن تكون من ترم سابق",
    missingPrerequisites: "هذا المقرر له متطلبات سابقة مفقودة"
  }
}

function App() {
  const [language, setLanguage] = useState('en')
  const [courses, setCourses] = useState([])
  const [savedCourses, setSavedCourses] = useState([])
  const [savedPlans, setSavedPlans] = useState([])
  const [formData, setFormData] = useState({
    semester: "1",
    nameAr: '',
    nameEn: '',
    code: '',
    credits: '',
    type: 'Required',
    mode: 'In-Person',
    lectureHours: '',
    labHours: '',
    trainingHours: '',
    prerequisites: [],
    department: ''
  })
  const [editingCourse, setEditingCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCourseDetails, setShowCourseDetails] = useState(false)
  const [showPlanDetails, setShowPlanDetails] = useState(false)
  const [showAddExistingCourse, setShowAddExistingCourse] = useState(false)
  const [showPlanNameDialog, setShowPlanNameDialog] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showCreatePlanForm, setShowCreatePlanForm] = useState(false)
  const [editingDetails, setEditingDetails] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [maxCreditsPerSemester, setMaxCreditsPerSemester] = useState(18)
  const [availableSemesters, setAvailableSemesters] = useState([1, 2, 3, 4, 5, 6, 7, 8])
  const [planName, setPlanName] = useState('')
  const [currentPage, setCurrentPage] = useState('createPlan')
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [planSearchTerm, setPlanSearchTerm] = useState('')
  const [existingCourseSearchTerm, setExistingCourseSearchTerm] = useState('')

  // Form refs for uncontrolled inputs
  const semesterRef = useRef()
  const nameArRef = useRef()
  const nameEnRef = useRef()
  const codeRef = useRef()
  const creditsRef = useRef()
  const typeRef = useRef()
  const modeRef = useRef()
  const lectureHoursRef = useRef()
  const labHoursRef = useRef()
  const trainingHoursRef = useRef()
  const departmentRef = useRef()
  const prerequisitesRef = useRef([])

  const t = translations[language]
  const isRTL = language === 'ar'

  // API FETCH LOGIC (DO NOT CHANGE DESIGN)
  useEffect(() => {
    fetch('http://localhost:8000/courses').then(res => res.json()).then(data => setSavedCourses(data)).catch(err => console.error(err));
    fetch('http://localhost:8000/plans').then(res => res.json()).then(data => setSavedPlans(data)).catch(err => console.error(err));
  }, []);

    // Load saved data on component mount
  useEffect(() => {
    const savedCoursesData = localStorage.getItem('savedCourses')
    const savedPlansData = localStorage.getItem('savedPlans')
    
    if (savedCoursesData) {
      const parsedCourses = JSON.parse(savedCoursesData)
      setSavedCourses(parsedCourses)
    }
    
    if (savedPlansData) {
      const parsedPlans = JSON.parse(savedPlansData)
      setSavedPlans(parsedPlans)
    }
  }, [])

  // Navigation Menu Component
  const NavigationMenu = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white hover:bg-opacity-20"
        onClick={() => document.getElementById('nav-menu').classList.toggle('hidden')}
      >
        <Menu className="w-5 h-5" />
      </Button>
      <div id="nav-menu" className="hidden absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
        <div className="py-2">
          <button
            onClick={() => {
              setCurrentPage('createPlan')
              document.getElementById('nav-menu').classList.add('hidden')
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t.createPlan}
          </button>
          <button
            onClick={() => {
              setCurrentPage('courses')
              document.getElementById('nav-menu').classList.add('hidden')
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {t.courses}
          </button>
          <button
            onClick={() => {
              setCurrentPage('plans')
              document.getElementById('nav-menu').classList.add('hidden')
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t.plans}
          </button>
        </div>
      </div>
    </div>
  )

  // Search functions
  const filterCourses = (coursesList, searchTerm) => {
    if (!searchTerm) return coursesList
    const term = searchTerm.toLowerCase()
    return coursesList.filter(course => 
      course.nameAr.toLowerCase().includes(term) ||
      course.nameEn.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term) ||
      course.department.toLowerCase().includes(term)
    )
  }

  const filterPlans = (plansList, searchTerm) => {
    if (!searchTerm) return plansList
    const term = searchTerm.toLowerCase()
    return plansList.filter(plan => 
      plan.name.toLowerCase().includes(term)
    )
  }

  // Enhanced validation functions
  const validateUniqueCode = (code, excludeId = null) => {
    const existsInCurrent = courses.some(course => 
      course.code.toLowerCase() === code.toLowerCase() && (excludeId === null || course.id !== excludeId)
    )
    const existsInSaved = savedCourses.some(course => 
      course.code.toLowerCase() === code.toLowerCase() && (excludeId === null || course.id !== excludeId)
    )
    return !existsInCurrent && !existsInSaved
  }

  const validateUniqueName = (nameAr, nameEn, excludeId = null) => {
    const existsInCurrent = courses.some(course => 
      (course.nameAr.toLowerCase() === nameAr.toLowerCase() || 
       course.nameEn.toLowerCase() === nameEn.toLowerCase()) && 
      (excludeId === null || course.id !== excludeId)
    )
    const existsInSaved = savedCourses.some(course => 
      (course.nameAr.toLowerCase() === nameAr.toLowerCase() || 
       course.nameEn.toLowerCase() === nameEn.toLowerCase()) && 
      (excludeId === null || course.id !== excludeId)
    )
    return !existsInCurrent && !existsInSaved
  }

  const validateUniquePlanName = (name, excludeId = null) => {
    return !savedPlans.some(plan => 
      plan.name.toLowerCase() === name.toLowerCase() && plan.id !== excludeId
    )
  }

  // Get available prerequisites based on current semester (only previous terms)
  const getAvailablePrerequisites = (currentSemester) => {
    const currentSemesterNum = parseInt(currentSemester)
    return courses.filter(course => parseInt(course.semester) < currentSemesterNum)
  }

  // Get all saved courses for prerequisite selection (for course page)
  const getAllSavedCoursesForPrerequisites = () => {
    return savedCourses
  }

  // Validate prerequisites when adding existing course
  const validatePrerequisitesForExistingCourse = (course, targetSemester) => {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return { valid: true, missingPrereqs: [] }
    }

    const targetSemesterNum = parseInt(targetSemester)
    const missingPrereqs = []

    for (const prereqCode of course.prerequisites) {
      const prereqInPlan = courses.find(c => c.code === prereqCode)
      
      if (!prereqInPlan) {
        // Prerequisite not found in current plan
        const prereqCourse = savedCourses.find(c => c.code === prereqCode)
        missingPrereqs.push(prereqCourse ? prereqCourse : { code: prereqCode, nameEn: 'Unknown Course' })
      } else if (parseInt(prereqInPlan.semester) >= targetSemesterNum) {
        // Prerequisite is in same or later semester
        missingPrereqs.push(prereqInPlan)
      }
    }

    return {
      valid: missingPrereqs.length === 0,
      missingPrereqs
    }
  }

  // Plan management functions
  const savePlan = () => {
    if (courses.length === 0) {
      setErrorMessage('Cannot save empty plan')
      setShowErrorModal(true)
      return
    }

    if (!planName.trim()) {
      setShowPlanNameDialog(true)
      return
    }

    if (!validateUniquePlanName(planName)) {
      setErrorMessage(t.planNameExists)
      setShowErrorModal(true)
      return
    }

    const newPlan = {
      id: Date.now(),
      name: planName.trim(),
      courses: [...courses],
      totalCredits: getTotalCredits(),
      semesters: Math.max(...courses.map(c => parseInt(c.semester))),
      maxCreditsPerSemester,
      createdAt: new Date().toISOString()
    }

    // MANUS API CALL
    fetch('http://localhost:8000/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: planName.trim(),
        maxCreditsPerSemester: parseInt(maxCreditsPerSemester),
        course_ids: courses.map(c => c.id)
      })
    })
    .then(res => res.json())
    .then(savedPlan => {
      setSavedPlans(prev => [...prev, savedPlan]);
      setErrorMessage(t.planSaved);
      setShowSuccessModal(true);
      setPlanName('');
      setShowPlanNameDialog(false);
    })
    .catch(err => {
      setErrorMessage("Error saving plan");
      setShowErrorModal(true);
    });
    
    // Auto-redirect to main page after saving
    setTimeout(() => {
      setShowCreatePlanForm(false)
      setCurrentPage('createPlan')
      setCourses([])
    }, 1500)
  }

  const editPlan = (plan) => {
    setCourses([...plan.courses])
    setMaxCreditsPerSemester(plan.maxCreditsPerSemester)
    setCurrentPage('createPlan')
    setShowCreatePlanForm(true)
    setPlanName(plan.name)
  }

  // Add existing course to current plan
  const addExistingCourse = (course) => {
    const selectedSemester = semesterRef.current?.value || formData.semester;
    // Check if course already exists in plan
    if (courses.some(c => c.code === course.code)) {
      setErrorMessage(t.duplicateCourse)
      setShowErrorModal(true)
      return
    }

    // Validate prerequisites
    const validation = validatePrerequisitesForExistingCourse(course, selectedSemester)
    
    if (!validation.valid) {
      const missingPrereqsList = validation.missingPrereqs.map(prereq => 
        `${prereq.code} - ${language === 'ar' ? prereq.nameAr : prereq.nameEn}`
      ).join('\n')
      
      setErrorMessage(`${t.missingPrerequisites}:\n\n${missingPrereqsList}`)
      setShowErrorModal(true)
      return
    }

    // Check credit hours limit
    const semesterCourses = courses.filter(c => c.semester === formData.semester)
    const currentSemesterCredits = semesterCourses.reduce((sum, c) => sum + c.credits, 0)
    
    if (currentSemesterCredits + course.credits > maxCreditsPerSemester) {
      setErrorMessage(`${t.creditsExceeded}. ${t.semester} ${formData.semester}: ${currentSemesterCredits}/${maxCreditsPerSemester} ${t.creditHours}`)
      setShowErrorModal(true)
      return
    }

    const newCourse = {
      ...course,
      id: Date.now(),
      semester: formData.semester
    }

    setCourses(prev => [...prev, newCourse])
    setShowAddExistingCourse(false)
    setErrorMessage(t.courseAdded)
    setShowSuccessModal(true)
  }


  // Excel functionality
  const downloadTemplate = () => {
    const headers = [
      'Semester', 'Course Name (Arabic)', 'Course Name (English)', 'Course Code', 
      'Credit Hours', 'Course Type', 'Study Mode', 'Lecture Hours', 'Lab Hours', 
      'Training Hours', 'Prerequisites', 'Department'
    ]
    
    const csvContent = headers.join(',') + '\n' + 
      '1,"مثال المقرر","Example Course","EX101",3,"Required","In-Person",2,1,0,"","Computer Science"'
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study_plan_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    setErrorMessage(t.templateDownloaded)
    setShowSuccessModal(true)
  }

  const handleImportExcel = (event) => {
    const file = event.target.files[0]
    if (!file) {
      setErrorMessage(t.selectFile)
      setShowErrorModal(true)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        
        const importedCourses = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          if (values.length >= 12 && values[0].trim()) {
            const course = {
              id: Date.now() + i,
              semester: values[0].trim(),
              nameAr: values[1].replace(/"/g, '').trim(),
              nameEn: values[2].replace(/"/g, '').trim(),
              code: values[3].replace(/"/g, '').trim(),
              credits: parseInt(values[4]) || 0,
              type: values[5].replace(/"/g, '').trim() || 'Required',
              mode: values[6].replace(/"/g, '').trim() || 'In-Person',
              lectureHours: parseInt(values[7]) || 0,
              labHours: parseInt(values[8]) || 0,
              trainingHours: parseInt(values[9]) || 0,
              prerequisites: values[10].replace(/"/g, '').trim() ? [values[10].replace(/"/g, '').trim()] : [],
              department: values[11].replace(/"/g, '').trim(),
              description: 'Course description to be updated',
              objectives: 'Learning objectives to be defined',
              assessment: 'Assessment methods to be specified',
              instructor: 'Instructor to be assigned',
              materials: 'Course materials to be listed',
              grading: 'Grading criteria to be defined',
              schedule: 'Schedule to be determined',
              officeHours: 'Office hours to be announced',
              notes: 'Additional notes'
            }
            importedCourses.push(course)
          }
        }
        
        setCourses(prev => [...prev, ...importedCourses])
        setErrorMessage(t.dataImported)
        setShowSuccessModal(true)
      } catch (error) {
        setErrorMessage(t.importError)
        setShowErrorModal(true)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const exportToExcel = () => {
    const headers = [
      'Semester', 'Course Name (Arabic)', 'Course Name (English)', 'Course Code', 
      'Credit Hours', 'Course Type', 'Study Mode', 'Lecture Hours', 'Lab Hours', 
      'Training Hours', 'Prerequisites', 'Department'
    ]
    
    const csvContent = headers.join(',') + '\n' + 
      courses.map(course => [
        course.semester,
        `"${course.nameAr}"`,
        `"${course.nameEn}"`,
        course.code,
        course.credits,
        course.type,
        course.mode,
        course.lectureHours,
        course.labHours,
        course.trainingHours,
        `"${course.prerequisites.join(', ')}"`,
        `"${course.department}"`
      ].join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study_plan_export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    setErrorMessage(t.dataExported)
    setShowSuccessModal(true)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCourseDetailChange = (field, value) => {
    setSelectedCourse(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePrerequisiteChange = (index, value) => {
    const newPrerequisites = [...formData.prerequisites]
    if (value === 'none') {
      newPrerequisites.splice(index, 1)
    } else {
      newPrerequisites[index] = value
    }
    setFormData(prev => ({
      ...prev,
      prerequisites: newPrerequisites
    }))
  }

  const addPrerequisiteField = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }))
  }

  const addSemester = () => {
    const nextSemester = Math.max(...availableSemesters) + 1
    if (nextSemester <= 8) {
      setAvailableSemesters(prev => [...prev, nextSemester])
    }
  }

  // Enhanced validation function for refs
  const validateFormFromRefs = (formDataFromRefs) => {
    if (!formDataFromRefs.nameAr.trim()) {
      setErrorMessage(t.fieldRequired + ': ' + t.courseNameAr)
      return false
    }
    if (!formDataFromRefs.nameEn.trim()) {
      setErrorMessage(t.fieldRequired + ': ' + t.courseNameEn)
      return false
    }
    if (!formDataFromRefs.code.trim()) {
      setErrorMessage(t.fieldRequired + ': ' + t.courseCode)
      return false
    }
    if (!formDataFromRefs.credits || formDataFromRefs.credits <= 0) {
      setErrorMessage(t.invalidCredits)
      return false
    }

    // Check for duplicate course code
    if (!validateUniqueCode(formDataFromRefs.code, editingCourse?.id)) {
      setErrorMessage(t.courseCodeExists)
      return false
    }

    // Check for duplicate course names
    if (!validateUniqueName(formDataFromRefs.nameAr, formDataFromRefs.nameEn, editingCourse?.id)) {
      setErrorMessage(t.courseNameExists)
      return false
    }

    // Check credit hours limit per semester
    const semesterCourses = courses.filter(course => 
      course.semester === formDataFromRefs.semester && 
      (editingCourse ? course.id !== editingCourse.id : true)
    )
    const currentSemesterCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0)
    
    if (currentSemesterCredits + parseInt(formDataFromRefs.credits) > maxCreditsPerSemester) {
      setErrorMessage(`${t.creditsExceeded}. ${t.semester} ${formDataFromRefs.semester}: ${currentSemesterCredits}/${maxCreditsPerSemester} ${t.creditHours}`)
      return false
    }

    return true
  }

  // Reset form refs
  const resetFormRefs = () => {
    if (semesterRef.current) semesterRef.current.value = "1"
    if (nameArRef.current) nameArRef.current.value = ''
    if (nameEnRef.current) nameEnRef.current.value = ''
    if (codeRef.current) codeRef.current.value = ''
    if (creditsRef.current) creditsRef.current.value = ''
    if (typeRef.current) typeRef.current.value = 'Required'
    if (modeRef.current) modeRef.current.value = 'In-Person'
    if (lectureHoursRef.current) lectureHoursRef.current.value = ''
    if (labHoursRef.current) labHoursRef.current.value = ''
    if (trainingHoursRef.current) trainingHoursRef.current.value = ''
    if (departmentRef.current) departmentRef.current.value = ''
    prerequisitesRef.current = []
  }

  // Enhanced validation function
  const validateForm = (isCoursePage = false) => {
    if (!formData.nameAr.trim()) {
      setErrorMessage(t.fieldRequired + ': ' + t.courseNameAr)
      return false
    }
    if (!formData.nameEn.trim()) {
      setErrorMessage(t.fieldRequired + ': ' + t.courseNameEn)
      return false
    }
    if (!formData.code.trim()) {
      setErrorMessage(t.fieldRequired + ': ' + t.courseCode)
      return false
    }
    if (!formData.credits || formData.credits <= 0) {
      setErrorMessage(t.invalidCredits)
      return false
    }

    // Check for duplicate course code
    if (!validateUniqueCode(formData.code, editingCourse?.id)) {
      setErrorMessage(t.courseCodeExists)
      return false
    }

    // Check for duplicate course names
    if (!validateUniqueName(formData.nameAr, formData.nameEn, editingCourse?.id)) {
      setErrorMessage(t.courseNameExists)
      return false
    }

    // Check credit hours limit per semester (only for create plan page)
    if (!isCoursePage) {
      const semesterCourses = courses.filter(course => 
        course.semester === formData.semester && 
        (editingCourse ? course.id !== editingCourse.id : true)
      )
      const currentSemesterCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0)
      
      if (currentSemesterCredits + parseInt(formData.credits) > maxCreditsPerSemester) {
        setErrorMessage(`${t.creditsExceeded}. ${t.semester} ${formData.semester}: ${currentSemesterCredits}/${maxCreditsPerSemester} ${t.creditHours}`)
        return false
      }
    }

    return true
  }

  const handleAddCourse = () => {
    // Collect data from refs instead of state
    const formDataFromRefs = {
      semester: semesterRef.current?.value || "1",
      nameAr: nameArRef.current?.value || '',
      nameEn: nameEnRef.current?.value || '',
      code: codeRef.current?.value || '',
      credits: creditsRef.current?.value || '',
      type: typeRef.current?.value || 'Required',
      mode: modeRef.current?.value || 'In-Person',
      lectureHours: lectureHoursRef.current?.value || '',
      labHours: labHoursRef.current?.value || '',
      trainingHours: trainingHoursRef.current?.value || '',
      department: departmentRef.current?.value || '',
      prerequisites: prerequisitesRef.current || []
    }

    // Validate using the collected data
    if (!validateFormFromRefs(formDataFromRefs)) {
      setShowErrorModal(true)
      return
    }

    const newCourse = {
      id: Date.now(),
      semester: formDataFromRefs.semester,
      nameAr: formDataFromRefs.nameAr,
      nameEn: formDataFromRefs.nameEn,
      code: formDataFromRefs.code,
      credits: parseInt(formDataFromRefs.credits),
      type: formDataFromRefs.type,
      mode: formDataFromRefs.mode,
      lectureHours: parseInt(formDataFromRefs.lectureHours) || 0,
      labHours: parseInt(formDataFromRefs.labHours) || 0,
      trainingHours: parseInt(formDataFromRefs.trainingHours) || 0,
      prerequisites: formDataFromRefs.prerequisites.filter(p => p && p !== 'none'),
      department: formDataFromRefs.department,
      description: 'Course description to be updated',
      objectives: 'Learning objectives to be defined',
      assessment: 'Assessment methods to be specified',
      instructor: 'Instructor to be assigned',
      materials: 'Course materials to be listed',
      grading: 'Grading criteria to be defined',
      schedule: 'Schedule to be determined',
      officeHours: 'Office hours to be announced',
      notes: 'Additional notes'
    }

    setCourses(prev => [...prev, newCourse])
    resetFormRefs()
    setShowSuccessModal(true)
  }

  // Add course to saved courses (for courses page)
  const addCourseToSaved = () => {
    if (!validateForm(true)) {
      setShowErrorModal(true)
      return
    }

    const newCourse = {
      id: Date.now(),
      semester: "1", // Default semester for saved courses
      nameAr: formData.nameAr,
      nameEn: formData.nameEn,
      code: formData.code,
      credits: parseInt(formData.credits),
      type: formData.type,
      mode: formData.mode,
      lectureHours: parseInt(formData.lectureHours) || 0,
      labHours: parseInt(formData.labHours) || 0,
      trainingHours: parseInt(formData.trainingHours) || 0,
      prerequisites: formData.prerequisites.filter(p => p && p !== 'none'),
      department: formData.department,
      description: 'Course description to be updated',
      objectives: 'Learning objectives to be defined',
      assessment: 'Assessment methods to be specified',
      instructor: 'Instructor to be assigned',
      materials: 'Course materials to be listed',
      grading: 'Grading criteria to be defined',
      schedule: 'Schedule to be determined',
      officeHours: 'Office hours to be announced',
      notes: 'Additional notes'
    }

    // MANUS API CALL (PRESERVE ORIGINAL LOGIC)
    fetch('http://localhost:8000/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCourse, prerequisite_codes: newCourse.prerequisites })
    })
    .then(res => res.json())
    .then(savedCourse => {
      setSavedCourses(prev => [...prev, savedCourse]);
      resetForm();
      setShowCourseDetails(false);
      setErrorMessage(t.courseAdded);
      setShowSuccessModal(true);
    })
    .catch(err => {
      setErrorMessage("Error connecting to server");
      setShowErrorModal(true);
    });
  }

  const handleEditCourse = (course) => {
    setEditingCourse(course)
    setFormData({
      semester: course.semester,
      nameAr: course.nameAr,
      nameEn: course.nameEn,
      code: course.code,
      credits: course.credits.toString(),
      type: course.type,
      mode: course.mode,
      lectureHours: course.lectureHours.toString(),
      labHours: course.labHours.toString(),
      trainingHours: course.trainingHours.toString(),
      prerequisites: course.prerequisites || [],
      department: course.department
    })
  }

  const handleSaveEdit = () => {
    if (!validateForm(false)) {
      setShowErrorModal(true)
      return
    }

    setCourses(prev => prev.map(course => 
      course.id === editingCourse.id 
        ? {
            ...course,
            semester: selectedSemester,
            nameAr: formData.nameAr,
            nameEn: formData.nameEn,
            code: formData.code,
            credits: parseInt(formData.credits),
            type: formData.type,
            mode: formData.mode,
            lectureHours: parseInt(formData.lectureHours) || 0,
            labHours: parseInt(formData.labHours) || 0,
            trainingHours: parseInt(formData.trainingHours) || 0,
            prerequisites: formData.prerequisites.filter(p => p && p !== 'none'),
            department: formData.department
          }
        : course
    ))

    setEditingCourse(null)
    resetForm()
    setShowSuccessModal(true)
  }

  const handleDeleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId))
  }

  const handleClearTable = () => {
    setCourses([])
    setShowClearConfirm(false)
  }

  const handleViewCourse = (course) => {
    setSelectedCourse({...course})
    setEditingDetails(false)
    setShowCourseDetails(true)
  }

  const handleSaveCourseDetails = () => {
    // Update in current courses if exists
    setCourses(prev => prev.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    ))
    
    // Update in saved courses if exists
    setSavedCourses(prev => prev.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    ))
    localStorage.setItem('savedCourses', JSON.stringify(savedCourses.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    )))
    
    setEditingDetails(false)
    setErrorMessage(t.courseUpdated)
    setShowSuccessModal(true)
  }

  const resetForm = () => {
    setFormData({
      semester: "1",
      nameAr: '',
      nameEn: '',
      code: '',
      credits: '',
      type: 'Required',
      mode: 'In-Person',
      lectureHours: '',
      labHours: '',
      trainingHours: '',
      prerequisites: [],
      department: ''
    })
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }

  const getTotalCredits = () => {
    return courses.reduce((sum, course) => sum + course.credits, 0)
  }

  const getSemesterCredits = (semester) => {
    return courses
      .filter(course => course.semester === semester)
      .reduce((sum, course) => sum + course.credits, 0)
  }

  const getPrerequisiteNames = (prerequisites) => {
    if (!prerequisites || prerequisites.length === 0) return t.none
    return prerequisites.map(prereqCode => {
      const course = courses.find(c => c.code === prereqCode) || savedCourses.find(c => c.code === prereqCode)
      return course ? (language === 'ar' ? course.nameAr : course.nameEn) : prereqCode
    }).join(', ')
  }


  // Enhanced Courses Page Component with search
  const CoursesPage = () => {
    const filteredCourses = filterCourses(savedCourses, courseSearchTerm)
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t.courses}</h2>
          <Button 
            onClick={() => {
              resetForm()
              setSelectedCourse(null)
              setEditingDetails(false)
              setShowCourseDetails(true)
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addCourse}
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t.searchCoursesArabic}
            value={courseSearchTerm}
            onChange={(e) => setCourseSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filteredCourses.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {courseSearchTerm ? 'No courses found' : 'No courses saved yet'}
            </h3>
            <p className="text-gray-500">
              {courseSearchTerm ? 'Try adjusting your search terms' : 'Create a plan to save courses automatically'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewCourse(course)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{language === 'ar' ? course.nameAr : course.nameEn}</CardTitle>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t.creditHours}:</span>
                      <span className="font-medium">{course.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t.courseType}:</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        course.type === 'Required' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {language === 'ar' ? (course.type === 'Required' ? 'إجباري' : 'اختياري') : course.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t.department}:</span>
                      <span className="text-sm">{course.department}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Enhanced Plans Page Component with search
  const PlansPage = () => {
    const filteredPlans = filterPlans(savedPlans, planSearchTerm)
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t.plans}</h2>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t.searchPlans}
            value={planSearchTerm}
            onChange={(e) => setPlanSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filteredPlans.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {planSearchTerm ? 'No plans found' : 'No plans saved yet'}
            </h3>
            <p className="text-gray-500">
              {planSearchTerm ? 'Try adjusting your search terms' : 'Create your first study plan to get started'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{t.totalCredits}:</span>
                      <span className="font-medium">{plan.totalCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Semesters:</span>
                      <span className="font-medium">{plan.semesters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Courses:</span>
                      <span className="font-medium">{plan.courses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Credits/Semester:</span>
                      <span className="font-medium">{plan.maxCreditsPerSemester}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPlan(plan)
                          setShowPlanDetails(true)
                        }}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t.view}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editPlan(plan)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Export plan to Excel function
  const exportPlanToExcel = (plan) => {
    const headers = [
      'Semester', 'Course Name (Arabic)', 'Course Name (English)', 'Course Code', 
      'Credit Hours', 'Course Type', 'Study Mode', 'Lecture Hours', 'Lab Hours', 
      'Training Hours', 'Prerequisites', 'Department'
    ]
    
    const csvContent = headers.join(',') + '\n' + 
      plan.courses.map(course => [
        course.semester,
        `"${course.nameAr}"`,
        `"${course.nameEn}"`,
        course.code,
        course.credits,
        course.type,
        course.mode,
        course.lectureHours,
        course.labHours,
        course.trainingHours,
        `"${course.prerequisites.join(', ')}"`,
        `"${course.department}"`
      ].join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${plan.name}_study_plan.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    setErrorMessage(t.dataExported)
    setShowSuccessModal(true)
  }

  // Create Plan Page Component
  const CreatePlanPage = () => (
    <div className="space-y-6">
      {!showCreatePlanForm ? (
        <Card className="p-8 text-center">
          <Plus className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t.createPlan}</h3>
          <p className="text-gray-500 mb-6">Start creating your study plan by adding courses</p>
          <Button 
            onClick={() => setShowCreatePlanForm(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.createPlan}
          </Button>
        </Card>
      ) : (
        <>
          {/* Excel Controls */}
          <Card className="border-cyan-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  onClick={downloadTemplate}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.downloadTemplate}
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleImportExcel}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    {t.importExcel}
                  </Button>
                </div>
                
                <Button
                  onClick={exportToExcel}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  {t.exportExcel}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Max Credits Setting */}
          <Card className="border-cyan-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {t.maxCreditsLabel}:
                </label>
                <Input
                  type="number"
                  value={maxCreditsPerSemester}
                  onChange={(e) => setMaxCreditsPerSemester(parseInt(e.target.value) || 18)}
                  className="w-24"
                  min="1"
                  max="30"
                />
                <span className="text-sm text-gray-500">{t.creditHours}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Course Table */}
            <div className="xl:col-span-2">
              <Card className="border-cyan-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-cyan-50 to-teal-50">
                        <tr>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">#</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.semester}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseNameAr}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseNameEn}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseCode}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.creditHours}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseType}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.studyMode}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.department}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.prerequisite}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course, index) => (
                          <tr 
                            key={course.id} 
                            className="border-b hover:bg-cyan-50 transition-colors cursor-pointer"
                            onClick={() => handleViewCourse(course)}
                          >
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                {course.semester}
                              </span>
                            </td>
                            <td className="p-3" dir="rtl">{course.nameAr}</td>
                            <td className="p-3">{course.nameEn}</td>
                            <td className="p-3">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {course.code}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-cyan-700">{course.credits}</span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                course.type === 'Required' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {language === 'ar' ? (course.type === 'Required' ? 'إجباري' : 'اختياري') : course.type}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-sm text-gray-600">
                                {language === 'ar' ? 
                                  (course.mode === 'In-Person' ? 'حضوري' : course.mode === 'Online' ? 'عن بعد' : 'مدمج') 
                                  : course.mode}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">{course.department}</td>
                            <td className="p-3 text-sm text-gray-600">{getPrerequisiteNames(course.prerequisites)}</td>
                            <td className="p-3">
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewCourse(course)}
                                  className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditCourse(course)}
                                  className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 border-t bg-gradient-to-r from-cyan-50 to-teal-50">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">{t.totalCredits}: </span>
                        <span className="text-cyan-700 font-bold text-lg">{getTotalCredits()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowClearConfirm(true)}
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t.clearTable}
                        </Button>
                        <Button
                          onClick={savePlan}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {t.savePlan}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Form */}
            <div>
              <Card className="border-cyan-200">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                  <CardTitle className="text-cyan-800">
                    {editingCourse ? t.editCourse : t.addCourse}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Add from Existing Courses Button */}
                  <Button
                    onClick={() => setShowAddExistingCourse(true)}
                    variant="outline"
                    className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addFromExisting}
                  </Button>

                  {/* Semester Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.semester}
                    </label>
                    <div className="flex gap-2">
                      <select 
                        ref={semesterRef}
                        defaultValue={editingCourse ? formData.semester : "1"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                      >
                        {availableSemesters.map(sem => (
                          <option key={sem} value={sem.toString()}>
                            {t.semester} {sem} ({getSemesterCredits(sem.toString())}/{maxCreditsPerSemester} {t.creditHours})
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addSemester}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Course Names */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseNameAr}
                    </label>
                    <Input
                      ref={nameArRef}
                      defaultValue={editingCourse ? formData.nameAr : ''}
                      placeholder={t.courseNameAr}
                      dir="rtl"
                      className="text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseNameEn}
                    </label>
                    <Input
                      ref={nameEnRef}
                      defaultValue={editingCourse ? formData.nameEn : ''}
                      placeholder={t.courseNameEn}
                    />
                  </div>

                  {/* Course Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseCode}
                    </label>
                    <Input
                      ref={codeRef}
                      defaultValue={editingCourse ? formData.code : ''}
                      placeholder="CS101"
                      className="font-mono"
                    />
                  </div>

                  {/* Credit Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.creditHours}
                    </label>
                    <Input
                      ref={creditsRef}
                      type="number"
                      defaultValue={editingCourse ? formData.credits : ''}
                      placeholder="3"
                      min="1"
                      max="6"
                    />
                  </div>

                  {/* Course Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseType}
                    </label>
                    <select 
                      ref={typeRef}
                      defaultValue={editingCourse ? formData.type : 'Required'}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Required">{t.required}</option>
                      <option value="Elective">{t.elective}</option>
                    </select>
                  </div>

                  {/* Study Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.studyMode}
                    </label>
                    <select 
                      ref={modeRef}
                      defaultValue={editingCourse ? formData.mode : 'In-Person'}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="In-Person">{t.inPerson}</option>
                      <option value="Online">{t.online}</option>
                      <option value="Hybrid">{t.hybrid}</option>
                    </select>
                  </div>

                  {/* Hours */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.lectureHours}
                      </label>
                      <Input
                        ref={lectureHoursRef}
                        type="number"
                        defaultValue={editingCourse ? formData.lectureHours : ''}
                        placeholder="2"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.labHours}
                      </label>
                      <Input
                        ref={labHoursRef}
                        type="number"
                        defaultValue={editingCourse ? formData.labHours : ''}
                        placeholder="1"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.trainingHours}
                      </label>
                      <Input
                        ref={trainingHoursRef}
                        type="number"
                        defaultValue={editingCourse ? formData.trainingHours : ''}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.department}
                    </label>
                    <Input
                      ref={departmentRef}
                      defaultValue={editingCourse ? formData.department : ''}
                      placeholder="Computer Science"
                    />
                  </div>

                  {/* Prerequisites - Fixed Logic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.prerequisite}
                    </label>
                    <div className="space-y-2">
                      {formData.prerequisites.map((prereq, index) => (
                        <div key={index} className="flex gap-2">
                          <Select 
                            value={prereq} 
                            onValueChange={(value) => handlePrerequisiteChange(index, value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder={t.selectPrereq} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{t.none}</SelectItem>
                              {getAvailablePrerequisites(formData.semester).map(course => (
                                <SelectItem key={course.id} value={course.code}>
                                  {course.code} - {language === 'ar' ? course.nameAr : course.nameEn}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newPrereqs = formData.prerequisites.filter((_, i) => i !== index)
                              setFormData(prev => ({ ...prev, prerequisites: newPrereqs }))
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addPrerequisiteField}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Prerequisite
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    {editingCourse ? (
                      <>
                        <Button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {t.saveChanges}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingCourse(null)
                            resetForm()
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          {t.cancelEdit}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleAddCourse}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t.addCourseBtn}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )


  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-2 shadow-md">
                <img src={universityLogo} alt="University Logo" className="h-20 w-20" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{t.title}</h1>
                <p className="text-cyan-100 text-sm">{t.university}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
                </span>
              </button>
              
              {/* Navigation Menu */}
              <NavigationMenu />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Render current page */}
        {currentPage === 'createPlan' && <CreatePlanPage />}
        {currentPage === 'courses' && <CoursesPage />}
        {currentPage === 'plans' && <PlansPage />}
      </div>

      {/* Plan Name Dialog */}
      <Dialog open={showPlanNameDialog} onOpenChange={setShowPlanNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.enterPlanName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder={t.planName}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                onClick={savePlan}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                disabled={!planName.trim()}
              >
                {t.savePlan}
              </Button>
              <Button
                onClick={() => setShowPlanNameDialog(false)}
                variant="outline"
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add from Existing Courses Dialog */}
      <Dialog open={showAddExistingCourse} onOpenChange={setShowAddExistingCourse}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.addFromExisting}</DialogTitle>
          </DialogHeader>
          
          {/* Search Bar for Existing Courses */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t.searchCoursesArabic}
              value={existingCourseSearchTerm}
              onChange={(e) => setExistingCourseSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filterCourses(savedCourses, existingCourseSearchTerm).map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => addExistingCourse(course)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{language === 'ar' ? course.nameAr : course.nameEn}</h4>
                    <p className="text-sm text-gray-500">{course.code}</p>
                    <div className="flex justify-between text-sm">
                      <span>{t.creditHours}: {course.credits}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        course.type === 'Required' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {language === 'ar' ? (course.type === 'Required' ? 'إجباري' : 'اختياري') : course.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{course.department}</p>
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <p className="text-xs text-orange-600">
                        Prerequisites: {course.prerequisites.join(', ')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filterCourses(savedCourses, existingCourseSearchTerm).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {existingCourseSearchTerm ? 'No courses found matching your search' : 'No saved courses available'}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Plan Details Dialog with Export Button */}
      <Dialog open={showPlanDetails} onOpenChange={setShowPlanDetails}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto border-2 border-cyan-200 shadow-2xl">
          <DialogHeader className="border-b border-cyan-100 pb-4">
            <DialogTitle className="flex items-center justify-between text-xl font-bold text-cyan-800">
              <span>{t.planDetails}: {selectedPlan?.name}</span>
              {selectedPlan && (
                <Button
                  onClick={() => exportPlanToExcel(selectedPlan)}
                  className="bg-purple-600 hover:bg-purple-700 text-white border border-purple-700"
                  size="sm"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  {t.exportExcel}
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6 p-4">
              {/* Plan Summary */}
              <Card className="border-cyan-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                  <CardTitle className="text-cyan-800">Plan Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center border border-gray-200 rounded-lg p-3">
                      <div className="text-sm text-gray-600">{t.totalCredits}:</div>
                      <div className="text-2xl font-bold text-cyan-600">{selectedPlan.totalCredits}</div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Semesters:</div>
                      <div className="text-2xl font-bold text-cyan-600">{selectedPlan.semesters}</div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Courses:</div>
                      <div className="text-2xl font-bold text-cyan-600">{selectedPlan.courses.length}</div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Max Credits/Semester:</div>
                      <div className="text-2xl font-bold text-cyan-600">{selectedPlan.maxCreditsPerSemester}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Course Table */}
              <Card className="border-cyan-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                  <CardTitle className="text-cyan-800">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-cyan-50 to-teal-50">
                        <tr>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">#</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.semester}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseNameAr}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseNameEn}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseCode}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.creditHours}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.courseType}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.department}</th>
                          <th className="p-3 text-left font-semibold text-cyan-800 border-b border-cyan-200">{t.prerequisite}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlan.courses.map((course, index) => (
                          <tr key={course.id} className="border-b hover:bg-cyan-50 transition-colors">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                {course.semester}
                              </span>
                            </td>
                            <td className="p-3" dir="rtl">{course.nameAr}</td>
                            <td className="p-3">{course.nameEn}</td>
                            <td className="p-3">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {course.code}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-cyan-700">{course.credits}</span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                course.type === 'Required' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {language === 'ar' ? (course.type === 'Required' ? 'إجباري' : 'اختياري') : course.type}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">{course.department}</td>
                            <td className="p-3 text-sm text-gray-600">{getPrerequisiteNames(course.prerequisites)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Course Details Modal */}
      <Dialog open={showCourseDetails} onOpenChange={setShowCourseDetails}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto border-2 border-cyan-200 shadow-2xl">
          <DialogHeader className="border-b border-cyan-100 pb-4">
            <DialogTitle className="flex items-center justify-between text-xl font-bold text-cyan-800">
              <span>{selectedCourse ? t.courseDetails : t.addCourse}</span>
              <div className="flex gap-2">
                {selectedCourse && editingDetails ? (
                  <>
                    <Button
                      onClick={handleSaveCourseDetails}
                      size="sm"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t.save}
                    </Button>
                    <Button
                      onClick={() => setEditingDetails(false)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                    >
                      {t.cancel}
                    </Button>
                  </>
                ) : selectedCourse ? (
                  <Button
                    onClick={() => setEditingDetails(true)}
                    size="sm"
                    variant="outline"
                    className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t.edit}
                  </Button>
                ) : null}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCourse ? (
            <div className="space-y-6 p-4">
              {/* Basic Course Info */}
              <Card className="border-cyan-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                  <CardTitle className="text-cyan-800">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.courseNameAr}
                      </label>
                      {editingDetails ? (
                        <Input
                          value={selectedCourse.nameAr}
                          onChange={(e) => handleCourseDetailChange('nameAr', e.target.value)}
                          dir="rtl"
                          className="border-cyan-200"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium" dir="rtl">{selectedCourse.nameAr}</p>
                      )}
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.courseNameEn}
                      </label>
                      {editingDetails ? (
                        <Input
                          value={selectedCourse.nameEn}
                          onChange={(e) => handleCourseDetailChange('nameEn', e.target.value)}
                          className="border-cyan-200"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{selectedCourse.nameEn}</p>
                      )}
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.courseCode}
                      </label>
                      <p className="text-gray-900 font-mono font-bold text-lg bg-gray-100 px-2 py-1 rounded">{selectedCourse.code}</p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.creditHours}
                      </label>
                      <p className="text-gray-900 font-bold text-lg text-cyan-700">{selectedCourse.credits}</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.prerequisite}
                      </label>
                      {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 ? (
                        <div className="space-y-1">
                          {selectedCourse.prerequisites.map((prereqCode, index) => {
                            const prereqCourse = savedCourses.find(c => c.code === prereqCode)
                            return (
                              <div key={index} className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
                                <span className="font-mono text-sm font-bold text-blue-800">{prereqCode}</span>
                                {prereqCourse && (
                                  <span className="text-sm text-blue-600 ml-2">
                                    - {language === 'ar' ? prereqCourse.nameAr : prereqCourse.nameEn}
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">{t.none}</p>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.department}
                      </label>
                      <p className="text-gray-900 font-medium">{selectedCourse.department}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Extended Course Details */}
              <Card className="border-cyan-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50">
                  <CardTitle className="text-cyan-800">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseDescription}
                    </label>
                    {editingDetails ? (
                      <Textarea
                        value={selectedCourse.description}
                        onChange={(e) => handleCourseDetailChange('description', e.target.value)}
                        rows={3}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.description}</p>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.learningObjectives}
                    </label>
                    {editingDetails ? (
                      <Textarea
                        value={selectedCourse.objectives}
                        onChange={(e) => handleCourseDetailChange('objectives', e.target.value)}
                        rows={3}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.objectives}</p>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.assessmentMethods}
                    </label>
                    {editingDetails ? (
                      <Textarea
                        value={selectedCourse.assessment}
                        onChange={(e) => handleCourseDetailChange('assessment', e.target.value)}
                        rows={2}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.assessment}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.instructor}
                      </label>
                      {editingDetails ? (
                        <Input
                          value={selectedCourse.instructor}
                          onChange={(e) => handleCourseDetailChange('instructor', e.target.value)}
                          className="border-cyan-200"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCourse.instructor}</p>
                      )}
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.courseSchedule}
                      </label>
                      {editingDetails ? (
                        <Input
                          value={selectedCourse.schedule}
                          onChange={(e) => handleCourseDetailChange('schedule', e.target.value)}
                          className="border-cyan-200"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCourse.schedule}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseMaterials}
                    </label>
                    {editingDetails ? (
                      <Textarea
                        value={selectedCourse.materials}
                        onChange={(e) => handleCourseDetailChange('materials', e.target.value)}
                        rows={2}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.materials}</p>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.gradingCriteria}
                    </label>
                    {editingDetails ? (
                      <Input
                        value={selectedCourse.grading}
                        onChange={(e) => handleCourseDetailChange('grading', e.target.value)}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.grading}</p>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.officeHours}
                    </label>
                    {editingDetails ? (
                      <Input
                        value={selectedCourse.officeHours}
                        onChange={(e) => handleCourseDetailChange('officeHours', e.target.value)}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.officeHours}</p>
                    )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.courseNotes}
                    </label>
                    {editingDetails ? (
                      <Textarea
                        value={selectedCourse.notes}
                        onChange={(e) => handleCourseDetailChange('notes', e.target.value)}
                        rows={2}
                        className="border-cyan-200"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedCourse.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Add new course form for courses page (exact same as create page but without semester)
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.courseNameAr}
                  </label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    placeholder={t.courseNameAr}
                    dir="rtl"
                    className="text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.courseNameEn}
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => handleInputChange('nameEn', e.target.value)}
                    placeholder={t.courseNameEn}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.courseCode}
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="CS101"
                    className="font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.creditHours}
                  </label>
                  <Input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => handleInputChange('credits', e.target.value)}
                    placeholder="3"
                    min="1"
                    max="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.courseType}
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Required">{t.required}</SelectItem>
                      <SelectItem value="Elective">{t.elective}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.studyMode}
                  </label>
                  <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-Person">{t.inPerson}</SelectItem>
                      <SelectItem value="Online">{t.online}</SelectItem>
                      <SelectItem value="Hybrid">{t.hybrid}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.lectureHours}
                  </label>
                  <Input
                    type="number"
                    value={formData.lectureHours}
                    onChange={(e) => handleInputChange('lectureHours', e.target.value)}
                    placeholder="2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.labHours}
                  </label>
                  <Input
                    type="number"
                    value={formData.labHours}
                    onChange={(e) => handleInputChange('labHours', e.target.value)}
                    placeholder="1"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.trainingHours}
                  </label>
                  <Input
                    type="number"
                    value={formData.trainingHours}
                    onChange={(e) => handleInputChange('trainingHours', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.department}
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              {/* Prerequisites for Course Page - Shows all saved courses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.prerequisite}
                </label>
                <div className="space-y-2">
                  {formData.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex gap-2">
                      <Select 
                        value={prereq} 
                        onValueChange={(value) => handlePrerequisiteChange(index, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={t.selectPrereq} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t.none}</SelectItem>
                          {getAllSavedCoursesForPrerequisites().map(course => (
                            <SelectItem key={course.id} value={course.code}>
                              {course.code} - {language === 'ar' ? course.nameAr : course.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newPrereqs = formData.prerequisites.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, prerequisites: newPrereqs }))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addPrerequisiteField}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Prerequisite
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setShowCourseDetails(false)}
                  variant="outline"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={addCourseToSaved}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addCourse}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              {t.success}
            </DialogTitle>
          </DialogHeader>
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {errorMessage || t.courseAdded}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessModal(false)}>
              {t.ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              {t.error}
            </DialogTitle>
          </DialogHeader>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 whitespace-pre-line">
              {errorMessage}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => setShowErrorModal(false)}>
              {t.ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation Modal */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.confirmClear}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              onClick={handleClearTable}
              variant="destructive"
              className="flex-1"
            >
              {t.clear}
            </Button>
            <Button
              onClick={() => setShowClearConfirm(false)}
              variant="outline"
              className="flex-1"
            >
              {t.cancel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

