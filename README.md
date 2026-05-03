# Full-Stack Todo List Application

A high-performance task management application featuring a dedicated Frontend and Backend, enabling user authentication and real-time task tracking.

## Project Architecture

The project is structured into two main components:

### 1. Frontend - ToDoListReact
Developed using React.js, focusing on a responsive and interactive user experience.
* **Technologies:** React Hooks, Axios, CSS3.
* **Key Features:** Interactive UI components and asynchronous server communication.

### 2. Backend - TodoApi
Developed using ASP.NET Core (.NET), providing a robust and secure server-side logic.
* **Technologies:** Entity Framework Core, MySQL Server.
* **Key Features:** Secure RESTful API, database management, CORS support, and user management.

## Core Features

* **Full CRUD Operations:** Create, Read, Update, and Delete tasks seamlessly.
* **User System:** Support for user tables to ensure personal data persistence.
* **Data Persistence:** Information is stored in a SQL database, ensuring data remains intact after page refreshes.
* **Docker Support:** Includes a Dockerfile for rapid deployment in containerized environments.

## Getting Started

### Prerequisites
* .NET 8 SDK or higher
* Node.js and npm
* MySQL Server

### Backend Setup (TodoApi)
1. Navigate to the `TodoApi` directory.
2. Update the connection string in the `appsettings.json` file.
3. Execute the following commands:
   ```bash
   dotnet ef database update
   dotnet run
