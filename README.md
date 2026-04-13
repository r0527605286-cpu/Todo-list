own
# 🚀 Full-Stack Todo List Application

אפליקציית ניהול משימות מתקדמת הכוללת צד לקוח (Frontend) וצד שרת (Backend), המאפשרת ניהול משתמשים ומעקב אחר משימות בזמן אמת.

## 🏗️ ארכיטקטורת הפרויקט

הפרויקט מחולק לשני חלקים עיקריים:

### 1. Frontend (צד לקוח) - `ToDoListReact`
נבנה באמצעות **React.js**. 
- **טכנולוגיות:** React Hooks, Axios, CSS3.
- **תכונות:** ממשק משתמש אינטראקטיבי, תקשורת אסינכרונית מול השרת.

### 2. Backend (צד שרת) - `TodoApi`
נבנה באמצעות **ASP.NET Core (.NET)**.
- **טכנולוגיות:** Entity Framework Core, MySQL Server.
- **תכונות:** RESTful API מאובטח, ניהול בסיס נתונים, תמיכה ב-CORS וניהול משתמשים.

---

## ✨ תכונות עיקריות
- **ניהול משימות מלא (CRUD):** יצירה, קריאה, עדכון ומחיקה של משימות.
- **מערכת משתמשים:** תמיכה בטבלאות משתמשים לשמירה אישית של נתונים.
- **Persistence:** הנתונים נשמרים בבסיס נתונים SQL ולא נמחקים ברענון דף.
- **Docker Ready:** הפרויקט כולל `Dockerfile` להרצה מהירה בסביבת קונטיינרים.

---

## 🚀 הוראות הרצה

### דרישות מוקדמות
- .NET 8 SDK ומעלה
- Node.js & npm
- MySQL Server

### הרצת השרת (Backend)
1. כנס לתיקיית `TodoApi`.
2. עדכן את מחרוזת ההתקשרות בקובץ `appsettings.json`.
3. הרץ את הפקודות:
   ```bash
   dotnet ef database update
   dotnet run
הרצת הלקוח (Frontend)
כנס לתיקיית ToDoListReact.

התקן חבילות: npm install.

הרץ את האפליקציה: npm start.

🛠️ טכנולוגיות בשימוש
Client: React, Axios

Server: .NET Core, Entity Framework

Database: MySQL

DevOps: Docker, .gitignore optimization

נבנה על ידי Rivka
