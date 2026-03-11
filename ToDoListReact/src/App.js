import React, { useEffect, useState } from "react";
import service from "./service.js";

// --- רכיב ההתחברות וההרשמה ---
function Auth({ onAuthSuccess }) {
  //הרשמה או כניסה
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //פונקצית טיפול בטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // איפוס שגיאות קודמות
    try {
      if (isRegistering) {
        //הרשמה
        await service.register(username, password);
        alert("נרשמת בהצלחה! כעת ניתן להתחבר");
        setIsRegistering(false);
      } else {
        //כניסה
        await service.login(username, password);
        onAuthSuccess();
      }
    } catch (err) {
      setError(
        isRegistering
          ? "הרישום נכשל, נסה שם משתמש אחר"
          : "שם משתמש או סיסמה שגויים",
      );
    }
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>{isRegistering ? "Register" : "Login"}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="new-todo"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ position: "static", marginBottom: "10px" }}
          />
          <input
            className="new-todo"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ position: "static" }}
          />
          <button type="submit" className="login-button">
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </p>
        )}
        <p
          style={{
            textAlign: "center",
            cursor: "pointer",
            color: "#af5b5e",
            marginTop: "20px",
          }}
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError("");
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </header>
    </section>
  );
}

// --- הרכיב הראשי של האפליקציה ---
function App() {
  //משימה חדשה
  const [newTodo, setNewTodo] = useState("");
  //רשימת המשימות
  const [todos, setTodos] = useState([]);
  //האם המשתמש מחובר
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // בדיקה אם המשתמש כבר מחובר בטעינה ראשונה
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      getTodos();
    }
  }, [isAuthenticated]);

  //שליפת כל המשימות
  async function getTodos() {
    try {
      const tasks = await service.getTasks();
      setTodos(tasks);
    } catch (error) {
      console.error("נכשלה טעינת המשימות", error);
    }
  }
  //יציאה מהמערכת
  const handleLogout = () => {
    service.logout();
    setIsAuthenticated(false);
    setTodos([]);
  };
  //הוספת משימה
  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await service.addTask(newTodo);
    setNewTodo("");
    await getTodos();
  }
  //עדכון משימה
  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos();
  }
  //מחיקת משימה
  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  // תצוגה למשתמש לא מחובר
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  // תצוגה למשתמש מחובר (רשימת המשימות)
  return (
    <section className="todoapp">
      <header className="header">
        <button
          className="logout-link"
          onClick={handleLogout}
          style={{ float: "right", margin: "10px" }}
        >
          Logout
        </button>
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input
            className="new-todo"
            placeholder="Well, let's take on the day"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={(e) => updateCompleted(todo, e.target.checked)}
                />
                <label>{todo.name}</label>
                <button
                  className="destroy"
                  onClick={() => deleteTodo(todo.id)}
                ></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default App;
