# تحديثات مشروع خطة الدراسة الجامعية

## نظرة عامة
تم إجراء تحديثات شاملة على مشروع خطة الدراسة الجامعية لإصلاح مشاكل مزامنة البيانات، وإعادة هيكلة واجهة المستخدم، وإضافة التحقق الشامل من البيانات.

---

## 1. إصلاح مزامنة البيانات (Data Synchronization)

### المشكلة الأصلية:
- عدم توافق بين naming conventions في Frontend و Backend
- عدم وجود "Single Source of Truth" للبيانات
- فقدان البيانات عند الانتقال بين الصفحات

### الحل المطبق:

#### Backend (FastAPI + Pydantic):
```python
# استخدام snake_case مع Alias للتوافق مع camelCase
class CourseBase(BaseModel):
    name_ar: str = Field(..., alias="nameAr")
    name_en: str = Field(..., alias="nameEn")
    lecture_hours: int = Field(default=0, ge=0, alias="lectureHours")
    # ... المزيد من الحقول
    
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
```

#### Frontend (React):
- تبسيط `api.js` لإرسال البيانات مباشرة بدون تحويل معقد
- استخدام API كـ "Single Source of Truth"
- مزامنة تلقائية للبيانات بين الصفحات

---

## 2. إصلاح بق الـ Semester

### المشكلة:
عند إضافة مقرر موجود من قائمة المقررات الموجودة، لم يتم تعيين الـ Semester بشكل صحيح.

### الحل:
```javascript
// إضافة متغير لتتبع الـ Semester النشط
const [selectedExistingCourseSemester, setSelectedExistingCourseSemester] = useState("1")

// تعيين الـ Semester عند إضافة المقرر
const addExistingCourseToPlan = (course, targetSemester) => {
  setCourses(prev => [...prev, { ...course, semester: targetSemester }])
}
```

---

## 3. إعادة هيكلة صفحة Create Plan

### التحسينات:

#### أ) نظام البطاقات (Semester Cards):
```
┌─────────────────────────────────┐
│ الترم 1 (3/18 ساعات)            │
├─────────────────────────────────┤
│ • مقرر 1 (3 ساعات)              │
│ • مقرر 2 (3 ساعات)              │
├─────────────────────────────────┤
│ [+ إضافة مقرر] [+ من الموجود]  │
└─────────────────────────────────┘
```

**المميزات:**
- عرض واضح لكل ترم بشكل منفصل
- عرض مباشر للساعات المستخدمة والحد الأقصى
- إمكانية إضافة مقررات مباشرة من البطاقة

#### ب) Modal الأولي لتهيئة الخطة:
```
┌─────────────────────────────────┐
│ إعدادات الخطة                   │
├─────────────────────────────────┤
│ اسم الخطة: [____________]        │
│ عدد الأترام: [8]                │
│ الحد الأقصى للساعات: [18]       │
├─────────────────────────────────┤
│ [إلغاء] [ابدأ الإنشاء]         │
└─────────────────────────────────┘
```

---

## 4. التحقق الشامل من البيانات

### Backend Validation (Pydantic):

#### التحقق من المقررات:
```python
@field_validator('semester')
def validate_semester(cls, v):
    sem = int(v)
    if sem < 1 or sem > 12:
        raise ValueError('Semester must be between 1 and 12')
    return v

@field_validator('name_ar')
def validate_name_ar(cls, v):
    if not re.search(r'[\u0600-\u06FF]', v):
        raise ValueError('Arabic course name must contain Arabic characters')
    return v.strip()

@field_validator('credits')
def validate_credits(cls, v):
    if v <= 0 or v > 6:
        raise ValueError('Credits must be between 1 and 6')
    return v
```

#### التحقق من الخطط:
```python
@field_validator('name')
def validate_name(cls, v):
    if not v.strip() or len(v.strip()) > 100:
        raise ValueError('Plan name must be 1-100 characters')
    return v.strip()

@field_validator('max_credits_per_semester')
def validate_max_credits(cls, v):
    if v <= 0 or v > 30:
        raise ValueError('Max credits must be between 1 and 30')
    return v
```

### Frontend Validation:
```javascript
const validateCourseData = (data) => {
  if (!data.nameAr || !isArabic(data.nameAr)) 
    return "Arabic text only (Course Name)";
  if (!data.nameEn || !isEnglish(data.nameEn)) 
    return "English text only (Course Name)";
  if (parseInt(data.credits) <= 0) 
    return "Positive numbers only (Credits)";
  return null;
};
```

---

## 5. Endpoints الجديدة

### Courses:
- `POST /courses` - إنشاء مقرر جديد
- `GET /courses` - الحصول على جميع المقررات
- `GET /courses/{id}` - الحصول على مقرر محدد ✨ **جديد**
- `PUT /courses/{id}` - تحديث مقرر ✨ **جديد**
- `DELETE /courses/{id}` - حذف مقرر
- `GET /courses/search/?q=query` - البحث عن مقررات ✨ **جديد**

### Plans:
- `POST /plans` - إنشاء خطة جديدة
- `GET /plans` - الحصول على جميع الخطط
- `GET /plans/{id}` - الحصول على خطة محددة ✨ **جديد**
- `PUT /plans/{id}` - تحديث خطة ✨ **جديد**
- `DELETE /plans/{id}` - حذف خطة

---

## 6. اختبار End-to-End

تم إنشاء ملف اختبار شامل (`test_e2e.py`) يغطي:

### اختبارات المقررات:
- ✅ إنشاء مقرر صحيح
- ✅ رفض مقرر بأسماء عربية غير صحيحة
- ✅ رفض مقرر بأسماء إنجليزية غير صحيحة
- ✅ رفض مقرر بساعات سالبة
- ✅ رفض مقرر بترم غير صحيح
- ✅ استرجاع جميع المقررات
- ✅ استرجاع مقرر محدد
- ✅ تحديث مقرر
- ✅ حذف مقرر
- ✅ البحث عن مقررات

### اختبارات الخطط:
- ✅ إنشاء خطة صحيحة
- ✅ رفض خطة باسم فارغ
- ✅ رفض خطة بساعات عالية جداً
- ✅ استرجاع جميع الخطط
- ✅ تحديث خطة
- ✅ حذف خطة

### اختبارات المزامنة:
- ✅ مزامنة المقررات عند الإنشاء
- ✅ مزامنة المقررات في الخطط

---

## 7. تحسينات الواجهة

### قبل التحديث:
- جدول واحد كبير يعرض جميع المقررات
- صعوبة في إدارة الأترام المختلفة
- عدم وضوح الحد الأقصى للساعات المستخدمة

### بعد التحديث:
- نظام بطاقات منفصلة لكل ترم
- عرض واضح للساعات المستخدمة والمتبقية
- إمكانية إضافة مقررات مباشرة من البطاقة
- Modal أولي لتهيئة الخطة
- تصميم أكثر احترافية وسهولة في الاستخدام

---

## 8. ملفات التحديث

### Backend:
- `backend/models.py` - تحديث أسماء الأعمدة إلى snake_case
- `backend/schemas.py` - إضافة Alias والتحقق من البيانات
- `backend/main.py` - إضافة endpoints جديدة وإصلاح المزامنة
- `backend/test_e2e.py` - اختبارات شاملة ✨ **جديد**

### Frontend:
- `frontend/src/services/api.js` - تبسيط التعامل مع البيانات
- `frontend/src/App.jsx` - إعادة هيكلة شاملة

---

## 9. كيفية الاستخدام

### تشغيل Backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### تشغيل Frontend:
```bash
cd frontend
npm install
npm run dev
```

### تشغيل الاختبارات:
```bash
cd backend
pip install pytest
pytest test_e2e.py -v
```

---

## 10. ملاحظات مهمة

1. **Single Source of Truth**: جميع البيانات تُحفظ في قاعدة البيانات، والواجهة تعرضها فقط
2. **Validation**: التحقق يتم على مستويين (Frontend و Backend) لضمان سلامة البيانات
3. **Language Support**: دعم كامل للعربية والإنجليزية مع التحقق من اللغة
4. **Error Handling**: رسائل خطأ واضحة ومفيدة للمستخدم

---

## 11. الخطوات التالية (اختيارية)

- [ ] إضافة نظام المستخدمين (Authentication)
- [ ] إضافة نظام الصلاحيات (Authorization)
- [ ] إضافة نظام الإشعارات
- [ ] تحسين الأداء (Caching, Pagination)
- [ ] إضافة نظام التقارير
- [ ] تطبيق Mobile

---

**تاريخ التحديث:** 26 أبريل 2026
**الإصدار:** 2.0
