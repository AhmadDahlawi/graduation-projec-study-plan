const API_BASE_URL = 'http://localhost:8000';

// Helper for snake_case conversion (Frontend camelCase -> Backend snake_case)
const toSnakeCase = (obj) => {
  const snakeObj = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    // Special mapping for prerequisites to prerequisite_codes
    if (key === 'prerequisites') {
      snakeObj['prerequisite_codes'] = obj[key];
    } else {
      snakeObj[snakeKey] = obj[key];
    }
  }
  return snakeObj;
};

// Helper for camelCase conversion (Backend snake_case -> Frontend camelCase)
const toCamelCase = (obj) => {
  const camelObj = {};
  for (const key in obj) {
    // Special mapping for prerequisite_codes to prerequisites
    if (key === 'prerequisite_codes') {
      camelObj['prerequisites'] = obj[key];
    } else {
      const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
      camelObj[camelKey] = obj[key];
    }
  }
  return camelObj;
};

export const api = {
  // Courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.map(toCamelCase);
  },

  getCourse: async (id) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    const data = await response.json();
    return toCamelCase(data);
  },

  createCourse: async (courseData) => {
    const snakeData = toSnakeCase(courseData);
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create course');
    }
    const data = await response.json();
    return toCamelCase(data);
  },

  updateCourse: async (id, courseData) => {
    const snakeData = toSnakeCase(courseData);
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update course');
    }
    const data = await response.json();
    return toCamelCase(data);
  },

  deleteCourse: async (id) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete course');
    return await response.json();
  },

  searchCourses: async (query) => {
    const response = await fetch(`${API_BASE_URL}/courses/search/?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search courses');
    const data = await response.json();
    return data.map(toCamelCase);
  },

  // Plans
  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/plans`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    const data = await response.json();
    return data.map(plan => ({
      ...plan,
      courses: plan.courses.map(toCamelCase)
    }));
  },

  createPlan: async (planData) => {
    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: planData.name,
        max_credits_per_semester: planData.maxCreditsPerSemester,
        course_ids: planData.courseIds
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create plan');
    }
    const data = await response.json();
    return {
      ...data,
      courses: data.courses.map(toCamelCase)
    };
  },

  deletePlan: async (id) => {
    const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete plan');
    return await response.json();
  }
};
