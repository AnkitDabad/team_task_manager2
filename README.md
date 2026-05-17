# Team Task Manager

A modern full-stack Team Collaboration & Task Management web application built for managing projects, assigning tasks, tracking progress, and handling team workflows with secure role-based authentication.

Designed to simulate a real-world productivity platform used in software companies and collaborative teams.

##Project Overview

Team Task Manager helps teams organize their workflow efficiently by providing:

Secure authentication using JWT
Role-based access control
Project and task management
Team collaboration features
Task progress tracking
Dashboard analytics
Due date monitoring

This project demonstrates full-stack development concepts including frontend-backend integration, authentication, API handling, database management, and deployment.

## Stack
- Frontend:
  - React.js
  - Vite
  - React Router DOM
  - Axios
  - CSS
- Backend:
  - Node.js
  - Express.js
  - JWT Authentication
  - REST API
- Database: SQLite
- Auth: JWT

## Features
Authentication & Authorization
  - User Signup & Login
  - JWT-based Authentication
  - Protected Routes
  - Role-based Access Control
  - Admin & Member Roles

Project Management
  - Create Projects
  - Delete Projects
  - View All Team Projects
  - Project-based Task Organization

Task Management
  - Create Tasks
  - Assign Tasks to Team Members
  - Update Task Status
  - Delete Tasks
  - Due Date Tracking
  - Task Prioritization

Dashboard & Analytics
  - Total Tasks Count
  - Completed Tasks
  - In Progress Tasks
  - Overdue Tasks
  - Real-time Task Statistics


## Folder Structure

team-task-manager/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── database/
│   ├── server.js
│   └── package.json
│
└── README.md
