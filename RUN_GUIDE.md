# دليل تشغيل المشروع المصلح (Excel Fixed)

لقد قمت بإصلاح مشكلة "Failed to fetch" في أزرار الـ Excel مع الحفاظ على كافة وظائف النسخة المستقرة.

## كيفية التشغيل في VS Code:

### 1. تشغيل الـ Backend:
1. افتح Terminal جديد في VS Code.
2. ادخل لمجلد الـ backend: `cd backend`
3. تثبيت المكتبات: `pip install -r requirements.txt`
4. تشغيل السيرفر: `uvicorn main:app --reload --port 8000`
   * **ملاحظة:** تأكد أن السيرفر يعمل على المنفذ 8000.

### 2. تشغيل الـ Frontend:
1. افتح Terminal ثانٍ.
2. ادخل لمجلد الـ frontend: `cd frontend`
3. تشغيل التطبيق: `npm run dev`
4. افتح الرابط الذي سيظهر لك (غالباً `http://localhost:5173`).

## معلومات الدخول:
* **المستخدم:** `Admin`
* **كلمة المرور:** `12345`

في حال استمرار مشكلة "Failed to fetch"، تأكد من إغلاق أي سيرفر قديم يعمل في الخلفية وإعادة تشغيل الـ Backend.
