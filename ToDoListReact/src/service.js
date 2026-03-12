import axios from "axios";

// הגדרת כתובת ה-API כברירת מחדל
//axios.defaults.baseURL = "http://localhost:5072";
const apiUrl = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = apiUrl;

// אינטרספטור להוספת הטוקן לכל בקשה שיוצאת
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// אינטרספטור לתפיסת שגיאות (כמו 401 - לא מורשה)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("User is not authorized, redirecting to login...");

      // 1. מחיקת הטוקן הלא תקין מהאחסון המקומי
      localStorage.removeItem("token");

      // 2. הפניה מחדש לדף הבית/לוגין
      // מכיוון שבאפליקציה שלך App.js מציג לוגין אם אין טוקן,
      // טעינה מחדש של הדף תשלח את המשתמש למסך ההתחברות.
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default {
  // שליפת משימות
  getTasks: async () => {
    const result = await axios.get(`/items`);
    return result.data;
  },

  // הוספת משימה
  addTask: async (name) => {
    const result = await axios.post(`/items`, { name, isComplete: false });
    return result.data;
  },

  // עדכון משימה
  setCompleted: async (id, isComplete) => {
    const result = await axios.put(`/items/${id}?isComplete=${isComplete}`);
    return result.data;
  },

  // מחיקת משימה
  deleteTask: async (id) => {
    await axios.delete(`/items/${id}`);
  },

  // לוגין - לשמירת הטוקן!
  login: async (username, password) => {
    const result = await axios.post(`/login`, { username, password });
    if (result.data && result.data.token) {
      localStorage.setItem("token", result.data.token); // שמירת המפתח בדפדפן
    }
    return result.data;
  },

  // הרשמה
  register: async (username, password) => {
    await axios.post(`/register`, { username, password });
  },

  // יציאה מהמערכת
  logout: () => {
    localStorage.removeItem("token");
  },
};
