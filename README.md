# 🚗 Car Dealership Inventory System

A full-stack Car Dealership Inventory Management System built using **FastAPI, React, SQLite, Tailwind CSS, and JWT Authentication**.

This project was developed using **Test Driven Development (TDD)** principles with a focus on backend API design, database management, authentication, frontend interaction, and AI-assisted development workflow.

---

# 📌 Project Overview

The Car Dealership Inventory System allows users to:

- Register an account
- Login securely using JWT authentication
- View available vehicles
- Search vehicles
- Purchase vehicles
- Manage vehicle inventory through an Admin Panel

Administrators can:

- Add new vehicles
- Update vehicle details
- Delete vehicles
- Restock inventory

The application follows a client-server architecture:

```
Frontend (React)
        |
        |
REST API
        |
        |
Backend (FastAPI)
        |
        |
SQLite Database
```

---

# 🛠️ Technologies Used

## Backend

- Python
- FastAPI
- SQLAlchemy ORM
- SQLite Database
- JWT Authentication
- Python-JOSE
- Pytest

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Development Tools

- Git & GitHub
- VS Code
- AI Assistance (ChatGPT)

---

# 📂 Project Structure

```
car-dealership-inventory

│
├── backend
│
│   ├── app
│   │
│   ├── core
│   │   ├── security.py
│   │   └── admin.py
│   │
│   ├── models
│   │
│   ├── schemas
│   │
│   ├── repository
│   │
│   ├── tests
│   │
│   ├── database.py
│   └── main.py
│
│
├── frontend
│
│   ├── src
│   │
│   ├── pages
│   ├── components
│   ├── services
│   └── App.jsx
│
├── README.md
└── PROMPTS.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone <your-github-link>

cd car-dealership-inventory
```

---

# Backend Setup

Move into backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔐 Authentication

The application uses JWT based authentication.

Flow:

1. User registers
2. User logs in
3. Backend generates JWT token
4. Token is stored in frontend local storage
5. Token is sent with protected API requests

---

# 🚘 API Endpoints

## Authentication

### Register User

```
POST /api/auth/register
```

Example:

```json
{
"name":"Krisha Patel",
"email":"krisha@gmail.com",
"password":"Password123"
}
```

---

### Login User

```
POST /api/auth/login
```

Returns:

```json
{
"access_token":"jwt_token",
"token_type":"bearer"
}
```

---

# Vehicle APIs

## Add Vehicle (Admin)

```
POST /api/vehicles
```

---

## Get Vehicles

```
GET /api/vehicles
```

---

## Search Vehicle

```
GET /api/vehicles/search
```

Search supported by:

- Make
- Model
- Category

---

## Update Vehicle (Admin)

```
PUT /api/vehicles/{id}
```

---

## Delete Vehicle (Admin)

```
DELETE /api/vehicles/{id}
```

---

## Purchase Vehicle

```
POST /api/vehicles/{id}/purchase
```

Decreases available quantity.

---

## Restock Vehicle (Admin)

```
POST /api/vehicles/{id}/restock
```

Increases available quantity.

---

# 🧪 Testing (TDD)

The backend was developed following Test Driven Development:

RED → GREEN → REFACTOR

Test cases include:

✅ User Registration

✅ Duplicate Email Validation

✅ User Login

✅ Health Check

✅ Add Vehicle

✅ Get Vehicles

✅ Search Vehicle


Run tests:

```bash
python -m pytest -v
```

Test Result:

```
11 passed
```

# 🤖 My AI Usage

## AI Tool Used

ChatGPT

---

## How AI Was Used

AI was used as a development assistant throughout the project.

Usage included:

- Understanding FastAPI architecture
- Generating initial boilerplate code
- Designing API structures
- Creating pytest test cases
- Debugging errors
- Improving frontend UI design
- Reviewing authentication flow
- Improving documentation

---

## Reflection

AI helped improve development speed by providing suggestions, explaining errors, and helping structure the application.

However, all generated suggestions were reviewed, modified, tested, and integrated manually.

AI was used as an assistant rather than replacing the development process.

---

# 🚀 Future Improvements

Possible future enhancements:

- Vehicle image upload
- Role based permissions
- Sales history
- Dashboard analytics
- Deployment using AWS/Vercel
- PostgreSQL migration
