import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { CheckCircle, AlertCircle, Trash2, Edit, X, Globe, Plus, Download, Upload, FileSpreadsheet, Eye, Save, Menu, BookOpen, Calendar, Search, Settings } from 'lucide-react'
import ExcelButtons from '@/components/ExcelButtons.jsx'
import universityLogo from './assets/university-logo.png'
import './App.css'
import { api } from './services/api'

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
    requiresPrerequisite: "Requires",
    prerequisiteMustBeBefore: "Prerequisite must be in a previous semester:",
    close: "Close",
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
    missingPrerequisites: "This course has missing prerequisites",
    numSemesters: "Number of Semesters",
    planConfig: "Plan Configuration",
    startCreating: "Start Creating",
    arabicOnly: "Arabic text only",
    englishOnly: "English text only",
    positiveOnly: "Positive numbers only"
  },
  ar: {
    title: "برنامج الخطة الدراسية",
    university: "جامعة أم القرى",
    downloadTemplate: "تحميل القالب",
    importExcel: "استيراد ملف Excel",
    exportExcel: "تصدير إلى Excel",
    maxCreditsLabel: "الحد الأقصى للساعات في الترم",
    addCourse: "إضافة مقرر",
    editCourse: "تعديل المقرر",
    courseDetails: "تفاصيل المقرر",
    semester: "الترم",
    addSemester: "إضافة ترم",
    courseNameAr: "اسم المقرر (عربي)",
    courseNameEn: "اسم المقرر (إنجليزي)",
    courseCode: "رمز المقرر",
    creditHours: "الساعات المعتمدة",
    courseType: "نوع المقرر",
    studyMode: "طريقة الدراسة",
    lectureHours: "ساعات المحاضرة",
    lecture: "محاضرة",
    lab: "معمل",
    training: "تدريب",
    labHours: "ساعات المعمل",
    trainingHours: "ساعات التدريب",    prerequisite: "المتطلب السابق",
    requiresPrerequisite: "يتطلب",
    prerequisiteMustBeBefore: "يجب أن يكون المتطلب في ترم سابق:",
    close: "إغلاق",
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
    missingPrerequisites: "هذا المقرر له متطلبات سابقة مفقودة",
    numSemesters: "عدد الأترام",
    planConfig: "إعدادات الخطة",
    startCreating: "ابدأ الإنشاء",
    arabicOnly: "نص عربي فقط",
    englishOnly: "نص إنجليزي فقط",
    positiveOnly: "أرقام موجبة فقط"
  }
}

function App({ language: initialLanguage = 'ar', setLanguage: setParentLanguage, user, token }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [courses, setCourses] = useState([]) // Courses in current plan
  const [savedCourses, setSavedCourses] = useState([]) // Global courses database
  const [savedPlans, setSavedPlans] = useState([])
  const [formData, setFormData] = useState({
    semester: "1",
    nameAr: '',
    nameEn: '',
    code: '',
    credits: '',
    type: 'Required',
    mode: 'In-Person',
    lectureHours: '0',
    labHours: '0',
    trainingHours: '0',
    prerequisiteCodes: [],
    department: ''
  })
  const [editingCourse, setEditingCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCourseDetails, setShowCourseDetails] = useState(false)
  const [showPlanDetails, setShowPlanDetails] = useState(false)
  const [showAddExistingCourse, setShowAddExistingCourse] = useState(false)
  const [showPlanConfigDialog, setShowPlanConfigDialog] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showCreatePlanForm, setShowCreatePlanForm] = useState(false)
  const [editingDetails, setEditingDetails] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [maxCreditsPerSemester, setMaxCreditsPerSemester] = useState(18)
  const [numSemesters, setNumSemesters] = useState(8)
  const [planName, setPlanName] = useState('')
  const [currentPage, setCurrentPage] = useState('createPlan')
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [planSearchTerm, setPlanSearchTerm] = useState('')
  const [existingCourseSearchTerm, setExistingCourseSearchTerm] = useState('')
  const [selectedExistingCourseSemester, setSelectedExistingCourseSemester] = useState("1")
  const [activeSemesterForAdd, setActiveSemesterForAdd] = useState("1")

  const t = translations[language]
  const isRTL = language === 'ar'

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
  }

  // Fetch initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, plansData] = await Promise.all([
          api.getCourses(),
          api.getPlans()
        ]);
        setSavedCourses(coursesData);
        setSavedPlans(plansData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // Validation Helpers
  const isArabic = (text) => /^[\u0600-\u06FF\s0-9]+$/.test(text);
  const isEnglish = (text) => /^[A-Za-z\s0-9]+$/.test(text);

  const validateCourseData = (data) => {
    if (!data.nameAr || !isArabic(data.nameAr)) return t.arabicOnly + " (" + t.courseNameAr + ")";
    if (!data.nameEn || !isEnglish(data.nameEn)) return t.englishOnly + " (" + t.courseNameEn + ")";
    if (!data.code || data.code.trim() === '') return "Course code is required";
    if (parseInt(data.credits) <= 0) return t.positiveOnly + " (" + t.creditHours + ")";
    if (parseInt(data.lectureHours) < 0 || parseInt(data.labHours) < 0 || parseInt(data.trainingHours) < 0) return t.positiveOnly;
    
    // Check for duplicate course codes
    if (!editingCourse) {
      if (savedCourses.some(c => c.code.toUpperCase() === data.code.toUpperCase())) {
        return t.courseCodeExists;
      }
    } else if (editingCourse && editingCourse.code !== data.code) {
      if (savedCourses.some(c => c.code.toUpperCase() === data.code.toUpperCase())) {
        return t.courseCodeExists;
      }
    }
    
    // Check for duplicate course names
    if (!editingCourse) {
      if (savedCourses.some(c => c.nameAr.toLowerCase() === data.nameAr.toLowerCase() || c.nameEn.toLowerCase() === data.nameEn.toLowerCase())) {
        return 'Course name already exists';
      }
    } else if (editingCourse && (editingCourse.nameAr !== data.nameAr || editingCourse.nameEn !== data.nameEn)) {
      if (savedCourses.some(c => c.id !== editingCourse.id && (c.nameAr.toLowerCase() === data.nameAr.toLowerCase() || c.nameEn.toLowerCase() === data.nameEn.toLowerCase()))) {
        return 'Course name already exists';
      }
    }
    
    return null;
  };

  // --- Course Management ---

  const addOrUpdateCourse = async (courseData, isGlobalOnly = false) => {
    const validationError = validateCourseData(courseData);
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorModal(true);
      return;
    }

    try {
      let savedCourse;
      
      if (editingCourse) {
        // Update existing course (use the ID from editingCourse)
        savedCourse = await api.updateCourse(editingCourse.id, courseData);
        setSavedCourses(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
        
        // Update in current plan
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...savedCourse, semester: courseData.semester } : c));
        
        // Update in all saved plans that contain this course
        setSavedPlans(prev => prev.map(plan => ({
          ...plan,
          courses: plan.courses.map(c => c.id === editingCourse.id ? { ...savedCourse, semester: c.semester } : c)
        })))
      } else {
        // Create new course
        const existingGlobal = savedCourses.find(c => c.code === courseData.code);
        
        if (existingGlobal) {
          // Update existing global course if code matches
          savedCourse = await api.updateCourse(existingGlobal.id, courseData);
          setSavedCourses(prev => prev.map(c => c.id === savedCourse.id ? savedCourse : c));
        } else {
          // Create new global course
          savedCourse = await api.createCourse(courseData);
          setSavedCourses(prev => [...prev, savedCourse]);
        }

        if (!isGlobalOnly) {
          // Add in current plan
          setCourses(prev => {
            const exists = prev.find(c => c.code === savedCourse.code);
            if (exists) {
              return prev.map(c => c.code === savedCourse.code ? { ...savedCourse, semester: courseData.semester } : c);
            }
            return [...prev, { ...savedCourse, semester: courseData.semester }];
          });
        }
      }

      setErrorMessage(t.courseAdded);
      setShowSuccessModal(true);
      resetForm();
      setShowCourseDetails(false);
    } catch (err) {
      // Handle complex error objects from FastAPI (pydantic validation)
      let msg = err.message;
      if (typeof err === 'object' && err !== null) {
        if (Array.isArray(err.detail)) {
          msg = err.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('\n');
        } else if (err.detail) {
          msg = err.detail;
        }
      }
      setErrorMessage(String(msg));
      setShowErrorModal(true);
    }
  };

  const addExistingCourseToPlan = (course, targetSemester) => {
    if (courses.some(c => c.code === course.code)) {
      setErrorMessage(t.duplicateCourse);
      setShowErrorModal(true);
      return;
    }

    // Check prerequisites
    if (course.prerequisiteCodes && course.prerequisiteCodes.length > 0) {
      const missingPrereqs = [];
      const wrongSemesterPrereqs = [];

      for (const prereqCode of course.prerequisiteCodes) {
        if (prereqCode === 'none' || !prereqCode) continue;
        
        const prereqInPlan = courses.find(c => c.code === prereqCode);
        if (!prereqInPlan) {
          const prereqCourse = savedCourses.find(c => c.code === prereqCode);
          if (prereqCourse) {
            missingPrereqs.push(prereqCourse.nameAr || prereqCourse.nameEn);
          }
        } else if (parseInt(prereqInPlan.semester) >= parseInt(targetSemester)) {
          wrongSemesterPrereqs.push(`${prereqCode} (${t.semester} ${prereqInPlan.semester})`);
        }
      }

      if (missingPrereqs.length > 0) {
        setErrorMessage(`${course.nameAr || course.nameEn} ${t.requiresPrerequisite}: ${missingPrereqs.join(', ')}`);
        setShowErrorModal(true);
        return;
      }

      if (wrongSemesterPrereqs.length > 0) {
        setErrorMessage(`${course.nameAr || course.nameEn} ${t.prerequisiteMustBeBefore}: ${wrongSemesterPrereqs.join(', ')}`);
        setShowErrorModal(true);
        return;
      }
    }

    const semesterCredits = courses
      .filter(c => c.semester === targetSemester)
      .reduce((sum, c) => sum + c.credits, 0);
    
    if (semesterCredits + course.credits > maxCreditsPerSemester) {
      setErrorMessage(t.creditsExceeded);
      setShowErrorModal(true);
      return;
    }

    setCourses(prev => [...prev, { ...course, semester: targetSemester }]);
    setShowAddExistingCourse(false);
    setErrorMessage(t.courseAdded);
    setShowSuccessModal(true);
  };

  // --- Plan Management ---

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      setErrorMessage(t.enterPlanName);
      setShowErrorModal(true);
      return;
    }

    // Check for duplicate plan names (only if creating new plan, not editing)
    if (!selectedPlan && savedPlans.some(p => p.name.toLowerCase() === planName.trim().toLowerCase())) {
      setErrorMessage(t.planNameExists);
      setShowErrorModal(true);
      return;
    }

    try {
      const planData = {
        name: planName.trim(),
        maxCreditsPerSemester: parseInt(maxCreditsPerSemester),
        courseIds: courses.map(c => c.id)
      };

      let savedPlan;
      if (selectedPlan) {
        // Update existing plan
        savedPlan = await api.updatePlan(selectedPlan.id, planData);
        setSavedPlans(prev => prev.map(p => p.id === selectedPlan.id ? savedPlan : p));
      } else {
        // Create new plan
        savedPlan = await api.createPlan(planData);
        setSavedPlans(prev => [...prev, savedPlan]);
      }
      
      setErrorMessage(t.planSaved);
      setShowSuccessModal(true);
      setShowCreatePlanForm(false);
      setCourses([]);
      setPlanName('');
      setSelectedPlan(null);
    } catch (err) {
      setErrorMessage(err.message);
      setShowErrorModal(true);
    }
  };

  const resetForm = () => {
    setFormData({
      semester: activeSemesterForAdd,
      nameAr: '',
      nameEn: '',
      code: '',
      credits: '',
      type: 'Required',
      mode: 'In-Person',
      lectureHours: '0',
      labHours: '0',
      trainingHours: '0',
      prerequisiteCodes: [],
      department: ''
    });
    setEditingCourse(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  // --- UI Components ---

  const SemesterCard = ({ semester }) => {
    const semesterCourses = courses.filter(c => c.semester === semester.toString());
    const totalCredits = semesterCourses.reduce((sum, c) => sum + c.credits, 0);

    return (
      <Card className="border-cyan-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <CardHeader className="bg-cyan-50 py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-cyan-800">
            {t.semester} {semester}
          </CardTitle>
          <div className="text-sm font-medium text-cyan-600">
            {totalCredits} / {maxCreditsPerSemester} {t.creditHours}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3 flex-grow">
          {semesterCourses.length > 0 ? (
            semesterCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-2 bg-white border rounded-md group">
                <div className="flex-1">
                  <div className="font-medium text-sm">{language === 'ar' ? course.nameAr : course.nameEn}</div>
                  <div className="text-xs text-gray-500">{course.code} • {course.credits} {t.creditHours}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => {
                    setEditingCourse(course);
                    setFormData({ ...course, credits: course.credits.toString(), lectureHours: course.lectureHours.toString(), labHours: course.labHours.toString(), trainingHours: course.trainingHours.toString() });
                    setShowCourseDetails(true);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setCourses(prev => prev.filter(c => c.id !== course.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400 text-xs italic">No courses added</div>
          )}
        </CardContent>
        <div className="p-4 pt-0 mt-auto">
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full text-xs h-9 border-dashed border-cyan-300 text-cyan-600 hover:bg-cyan-50 justify-start"
              onClick={() => {
                setActiveSemesterForAdd(semester.toString());
                resetForm();
                setFormData(prev => ({ ...prev, semester: semester.toString() }));
                setShowCourseDetails(true);
              }}
            >
              <Plus className="h-3 w-3 mr-2" /> {t.addCourse}
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-xs h-9 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 justify-start"
              onClick={() => {
                setSelectedExistingCourseSemester(semester.toString());
                setShowAddExistingCourse(true);
              }}
            >
              <Search className="h-3 w-3 mr-2" /> {t.addExistingCourse}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const CreatePlanPage = () => (
    <div className="space-y-6">
      {!showCreatePlanForm ? (
        <Card className="p-12 text-center border-2 border-dashed border-cyan-200 bg-cyan-50/30">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Plus className="h-10 w-10 text-cyan-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.createPlan}</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">ابدأ بتنظيم مسيرتك الأكاديمية من خلال إنشاء خطة دراسية متكاملة بنظام الأترام.</p>
          <Button 
            onClick={() => setShowPlanConfigDialog(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-200 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.createPlan}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Plan Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{planName}</h2>
                <p className="text-sm text-gray-500">{numSemesters} {t.numSemesters} • {maxCreditsPerSemester} {t.maxCreditsLabel}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPlanConfigDialog(true)}>
                <Settings className="w-4 h-4 mr-2" /> {t.planConfig}
              </Button>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={handleSavePlan}>
                <Save className="w-4 h-4 mr-2" /> {t.savePlan}
              </Button>
            </div>
          </div>

          {/* Semester Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: numSemesters }, (_, i) => i + 1).map(sem => (
              <SemesterCard key={sem} semester={sem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CoursesPage = () => {
    const filteredCourses = savedCourses.filter(c => 
      c.nameAr.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(courseSearchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{t.courses}</h2>
          <Button onClick={() => { resetForm(); setShowCourseDetails(true); }} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> {t.addCourse}
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t.searchCoursesArabic}
            value={courseSearchTerm}
            onChange={(e) => setCourseSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? course.nameAr : course.nameEn}</CardTitle>
                <p className="text-sm text-gray-500">{course.code}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">{t.creditHours}: {course.credits}</div>
                  <div className="text-sm text-gray-600">{t.department}: {course.department}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setSelectedCourse(course); setEditingCourse(null); setFormData({ semester: '', nameAr: '', nameEn: '', code: '', credits: '', type: 'Required', mode: 'In-Person', lectureHours: '0', labHours: '0', trainingHours: '0', prerequisiteCodes: [], department: '' }); setShowCourseDetails(true); }}>
                    <Eye className="w-4 h-4 mr-2" /> {t.view}
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setEditingCourse(course); setFormData({ ...course, credits: course.credits.toString(), lectureHours: course.lectureHours.toString(), labHours: course.labHours.toString(), trainingHours: course.trainingHours.toString() }); setShowCourseDetails(true); }}>
                    <Edit className="w-4 h-4 mr-2" /> {t.edit}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const PlansPage = () => {
    const filteredPlans = savedPlans.filter(p => p.name.toLowerCase().includes(planSearchTerm.toLowerCase()));

    const handlePlanImported = async () => {
      try {
        const response = await fetch('http://localhost:8000/plans');
        const data = await response.json();
        setSavedPlans(data);
      } catch (error) {
        console.error('Error refreshing plans:', error);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.plans}</h2>
        
        <ExcelButtons 
          plans={savedPlans} 
          onPlanImported={handlePlanImported}
          language={language}
        />
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t.searchPlans}
            value={planSearchTerm}
            onChange={(e) => setPlanSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-gray-500">Courses: {plan.courses.length} • Total Credits: {plan.totalCredits}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setSelectedPlan(plan); setShowPlanDetails(true); }}>
                    <Eye className="w-4 h-4 mr-2" /> {t.view}
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setSelectedPlan(plan); setCourses(plan.courses || []); setPlanName(plan.name); setMaxCreditsPerSemester(plan.maxCreditsPerSemester || 18); setNumSemesters(Math.max(...(plan.courses || []).map(c => parseInt(c.semester))) || 8); setShowCreatePlanForm(true); setCurrentPage('createPlan'); }}>
                    <Edit className="w-4 h-4 mr-2" /> {t.edit}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-1 shadow-md">
                <img src={universityLogo} alt="Logo" className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{t.title}</h1>
                <p className="text-cyan-100 text-xs">{t.university}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 mr-6">
                <button onClick={() => setCurrentPage('createPlan')} className={`text-sm font-medium hover:text-cyan-100 transition-colors ${currentPage === 'createPlan' ? 'underline underline-offset-8' : ''}`}>{t.createPlan}</button>
                <button onClick={() => setCurrentPage('courses')} className={`text-sm font-medium hover:text-cyan-100 transition-colors ${currentPage === 'courses' ? 'underline underline-offset-8' : ''}`}>{t.courses}</button>
                <button onClick={() => setCurrentPage('plans')} className={`text-sm font-medium hover:text-cyan-100 transition-colors ${currentPage === 'plans' ? 'underline underline-offset-8' : ''}`}>{t.plans}</button>
              </nav>

              <Button onClick={toggleLanguage} variant="ghost" className="text-white hover:bg-white/20">
                <Globe className="w-4 h-4 mr-2" /> {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-red-500/20 text-sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {currentPage === 'createPlan' && <CreatePlanPage />}
        {currentPage === 'courses' && <CoursesPage />}
        {currentPage === 'plans' && <PlansPage />}
      </main>

      {/* Plan Config Dialog */}
      <Dialog open={showPlanConfigDialog} onOpenChange={setShowPlanConfigDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t.planConfig}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>{t.planName}</label>
              <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder={t.enterPlanName} />
            </div>
            <div className="grid gap-2">
              <label>{t.numSemesters}</label>
              <Input type="number" value={numSemesters} onChange={(e) => setNumSemesters(parseInt(e.target.value) || 8)} min="1" max="12" />
            </div>
            <div className="grid gap-2">
              <label>{t.maxCreditsLabel}</label>
              <Input type="number" value={maxCreditsPerSemester} onChange={(e) => setMaxCreditsPerSemester(parseInt(e.target.value) || 18)} min="1" max="30" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowPlanConfigDialog(false); setShowCreatePlanForm(true); }} className="bg-cyan-600 text-white w-full">
              {t.startCreating}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Details Dialog (Add/Edit/View) */}
      <Dialog open={showCourseDetails} onOpenChange={(open) => { if (!open) { setEditingCourse(null); setSelectedCourse(null); resetForm(); } setShowCourseDetails(open); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCourse && !editingCourse ? t.courseDetails : (editingCourse ? t.editCourse : t.addCourse)}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <label>{t.courseNameAr}</label>
              <Input value={selectedCourse && !editingCourse ? selectedCourse.nameAr : formData.nameAr} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('nameAr', e.target.value) : null} disabled={selectedCourse && !editingCourse} dir="rtl" />
            </div>
            <div className="grid gap-2">
              <label>{t.courseNameEn}</label>
              <Input value={selectedCourse && !editingCourse ? selectedCourse.nameEn : formData.nameEn} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('nameEn', e.target.value) : null} disabled={selectedCourse && !editingCourse} />
            </div>
            <div className="grid gap-2">
              <label>{t.courseCode}</label>
              <Input value={selectedCourse && !editingCourse ? selectedCourse.code : formData.code} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('code', e.target.value) : null} disabled={selectedCourse && !editingCourse} />
            </div>
            <div className="grid gap-2">
              <label>{t.creditHours}</label>
              <Input type="number" value={selectedCourse && !editingCourse ? selectedCourse.credits : formData.credits} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('credits', e.target.value) : null} disabled={selectedCourse && !editingCourse} />
            </div>
            <div className="grid gap-2">
              <label>{t.courseType}</label>
              <Select value={selectedCourse && !editingCourse ? selectedCourse.type : formData.type} onValueChange={(v) => !selectedCourse || editingCourse ? handleInputChange('type', v) : null} disabled={selectedCourse && !editingCourse}>
                <SelectTrigger disabled={selectedCourse && !editingCourse}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Required">{t.required}</SelectItem>
                  <SelectItem value="Elective">{t.elective}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>{t.studyMode}</label>
              <Select value={selectedCourse && !editingCourse ? selectedCourse.mode : formData.mode} onValueChange={(v) => !selectedCourse || editingCourse ? handleInputChange('mode', v) : null} disabled={selectedCourse && !editingCourse}>
                <SelectTrigger disabled={selectedCourse && !editingCourse}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="In-Person">{t.inPerson}</SelectItem>
                  <SelectItem value="Online">{t.online}</SelectItem>
                  <SelectItem value="Hybrid">{t.hybrid}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>{t.department}</label>
              <Input value={selectedCourse && !editingCourse ? selectedCourse.department : formData.department} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('department', e.target.value) : null} disabled={selectedCourse && !editingCourse} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">{t.creditHours} {language === 'ar' ? 'التفاصيل' : 'Details'}</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">{language === 'ar' ? 'محاضرة' : 'Lecture'}</label>
                  <Input type="number" value={selectedCourse && !editingCourse ? (selectedCourse.lectureHours || 0) : formData.lectureHours} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('lectureHours', e.target.value) : null} disabled={selectedCourse && !editingCourse} className="text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">{language === 'ar' ? 'معمل' : 'Lab'}</label>
                  <Input type="number" value={selectedCourse && !editingCourse ? (selectedCourse.labHours || 0) : formData.labHours} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('labHours', e.target.value) : null} disabled={selectedCourse && !editingCourse} className="text-center" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">{language === 'ar' ? 'تدريب' : 'Training'}</label>
                  <Input type="number" value={selectedCourse && !editingCourse ? (selectedCourse.trainingHours || 0) : formData.trainingHours} onChange={(e) => !selectedCourse || editingCourse ? handleInputChange('trainingHours', e.target.value) : null} disabled={selectedCourse && !editingCourse} className="text-center" />
                </div>
              </div>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <label>{t.prerequisite}</label>
              <div className="space-y-2">
                {(selectedCourse && !editingCourse ? (selectedCourse.prerequisiteCodes || []) : formData.prerequisiteCodes).map((code, index) => (
                  <div key={index} className="flex gap-2">
                    <Select value={code} onValueChange={(val) => {
                      if (!selectedCourse || editingCourse) {
                        const newCodes = [...formData.prerequisiteCodes];
                        newCodes[index] = val;
                        handleInputChange('prerequisiteCodes', newCodes);
                      }
                    }} disabled={selectedCourse && !editingCourse}>
                      <SelectTrigger className="flex-1" disabled={selectedCourse && !editingCourse}><SelectValue placeholder={t.selectPrereq} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t.none}</SelectItem>
                        {savedCourses.filter(c => c.code !== (selectedCourse && !editingCourse ? selectedCourse.code : formData.code)).map(c => (
                          <SelectItem key={c.id} value={c.code}>{c.code} - {language === 'ar' ? c.nameAr : c.nameEn}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(!selectedCourse || editingCourse) && <Button size="icon" variant="ghost" onClick={() => {
                      handleInputChange('prerequisiteCodes', formData.prerequisiteCodes.filter((_, i) => i !== index));
                    }}><X className="h-4 w-4" /></Button>}
                  </div>
                ))}
                {(!selectedCourse || editingCourse) && <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  handleInputChange('prerequisiteCodes', [...formData.prerequisiteCodes, '']);
                }}><Plus className="h-3 w-3 mr-2" /> Add Prerequisite</Button>}
              </div>
            </div>
          </div>
          <DialogFooter>
            {selectedCourse && !editingCourse ? (
              <Button variant="outline" onClick={() => { setShowCourseDetails(false); setSelectedCourse(null); resetForm(); }}>{t.cancel}</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setShowCourseDetails(false); setEditingCourse(null); setSelectedCourse(null); resetForm(); }}>{t.cancel}</Button>
                <Button onClick={() => addOrUpdateCourse(formData)} className="bg-cyan-600 text-white">{t.save}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Details Dialog - View Mode (Read-only) */}
      <Dialog open={showPlanDetails && selectedPlan && !editingCourse} onOpenChange={(open) => { if (!open) { setSelectedPlan(null); } setShowPlanDetails(open); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.viewPlan}: {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-6 py-4">
              {/* Plan Header */}
              <div className="flex items-center justify-between bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPlan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPlan.courses.length} {t.courses} • {selectedPlan.totalCredits} {t.creditHours}</p>
                </div>
              </div>

              {/* Semester Cards Grid - Read-only */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: Math.max(...(selectedPlan.courses || []).map(c => parseInt(c.semester))) || 8 }, (_, i) => i + 1).map(sem => {
                  const semesterCourses = (selectedPlan.courses || []).filter(c => c.semester === sem.toString());
                  const totalCredits = semesterCourses.reduce((sum, c) => sum + c.credits, 0);
                  return (
                    <Card key={sem} className="border-cyan-200 shadow-sm">
                      <CardHeader className="bg-cyan-50 py-3">
                        <CardTitle className="text-lg text-cyan-800">
                          {t.semester} {sem}
                        </CardTitle>
                        <div className="text-sm font-medium text-cyan-600 mt-1">
                          {totalCredits} / {selectedPlan.maxCreditsPerSemester || 18} {t.creditHours}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {semesterCourses.length > 0 ? (
                          semesterCourses.map(course => (
                            <div key={course.id} className="p-2 bg-white border rounded-md">
                              <div className="font-medium text-sm">{language === 'ar' ? course.nameAr : course.nameEn}</div>
                              <div className="text-xs text-gray-500">{course.code} • {course.credits} {t.creditHours}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-400 text-xs italic">No courses</div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowPlanDetails(false); setSelectedPlan(null); }}>{t.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Existing Course Dialog */}
      <Dialog open={showAddExistingCourse} onOpenChange={setShowAddExistingCourse}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.addExistingCourse}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t.searchCourses}
                value={existingCourseSearchTerm}
                onChange={(e) => setExistingCourseSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {savedCourses
                .filter(c => c.code.toLowerCase().includes(existingCourseSearchTerm.toLowerCase()) || c.nameAr.includes(existingCourseSearchTerm) || c.nameEn.toLowerCase().includes(existingCourseSearchTerm.toLowerCase()))
                .map(course => (
                  <div key={course.id} className="p-3 hover:bg-gray-50 border-b last:border-0 flex items-center justify-between cursor-pointer" onClick={() => addExistingCourseToPlan(course, selectedExistingCourseSemester)}>
                    <div>
                      <div className="font-medium text-sm">{language === 'ar' ? course.nameAr : course.nameEn}</div>
                      <div className="text-xs text-gray-500">{course.code} • {course.credits} {t.creditHours}</div>
                    </div>
                    <Plus className="h-4 w-4 text-cyan-600" />
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success/Error Modals */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.success}</h3>
            <p className="text-gray-500">{errorMessage || t.courseAdded}</p>
            <Button onClick={() => setShowSuccessModal(false)} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white">
              {t.ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.error}</h3>
            <p className="text-gray-500">{errorMessage}</p>
            <Button onClick={() => setShowErrorModal(false)} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white">
              {t.ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
