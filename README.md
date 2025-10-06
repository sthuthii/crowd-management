

## Crowd Management and Emergency Response System (SIH25165)
## TEAM ID: 104038

An intelligent and scalable **Crowd Management System** designed to ensure public safety, optimize crowd flow, and provide real-time emergency handling during high-traffic events.
Built with **FastAPI (Backend)**, **React (Frontend)**, and **PostgreSQL (Database)**, this system helps administrators, emergency teams, and navigation assistants manage large gatherings efficiently.


## Overview

In crowded environments such as **temples, festivals, and public events**, managing people flow and emergency response is critical.
This system allows:

* Real-time crowd and emergency monitoring
* Worker and user coordination
* Priority-based emergency response
* Route navigation and crowd prediction

---

##  Features

###  Core Modules

1. **Emergency Management**

   * Register, update, and resolve emergency events.
   * Assign priority levels (Low, Medium, High).
   * Track emergency response status.
   * Real-time notifications for responders.

2. **Crowd Prediction**

   * Predict crowd levels based on ticket, entry, and exit data.
   * Historical data-based prediction model (supports online learning).
   * Useful for planning crowd control measures.

3. **Navigation & Accessibility**

   * Route optimization and crowd-aware navigation.
   * Accessibility support for differently-abled individuals.
   * Integrated map with crowd density visualization.

4. **User Management**

   * Role-based access: Admins, Emergency Workers, Users.
   * Authentication & authorization support.
   * Database-driven tracking of user reports and roles.

5. **Data Dashboard**

   * Admin dashboard to visualize emergency logs and crowd reports.
   * Real-time view of crowd hotspots.
   * Filter and search through emergencies, zones, and workers.

---

## System Architecture

```
Frontend (React)
     |
     | REST API Calls
     v
Backend (FastAPI)
     |
     | SQLAlchemy ORM
     v
Database (PostgreSQL)
```

### Tech Stack:

| Layer           | Technology                   |
| --------------- | ---------------------------- |
| Frontend        | React.js, Axios, TailwindCSS |
| Backend         | FastAPI, SQLAlchemy          |
| Database        | PostgreSQL                   |
| Auth            | JWT-based authentication     |
| Deployment      | Uvicorn / Docker             |
| Version Control | Git + GitHub                 |

---

##  Project Structure

```
crowd-management/
│
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── database.py              # Database connection setup
│   │   ├── models.py                # SQLAlchemy ORM models
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── emergency.py         # Emergency routes
│   │   │   ├── navigation.py        # Navigation & accessibility routes
│   │   │   ├── priority.py          # Priority-based logic
│   │   └── ...
│   ├── requirements.txt             # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # UI pages (Dashboard, EmergencyForm, etc.)
│   │   ├── api.js                   # Axios API calls
│   │   ├── App.js                   # App entry point
│   └── package.json
│
├── README.md
└── .env.example                     # Example environment variables
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crowd-management.git
cd crowd-management
```

---

### 2. Backend Setup

#### a. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
```

#### b. Install Dependencies

```bash
pip install -r requirements.txt
```

#### c. Configure Database

Create a `.env` file inside `backend/`:

```
DATABASE_URL=postgresql://username:password@localhost:5432/crowd_management
```

#### d. Apply Migrations

If using Alembic or direct SQLAlchemy:

```bash
alembic upgrade head
```

(or manually create tables from models)

#### e. Run Backend

```bash
uvicorn app.main:app --reload
```

The backend runs at  **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### Frontend Setup

#### a. Navigate to frontend folder

```bash
cd ../frontend
```

#### b. Install Dependencies

```bash
npm install
```

#### c. Start the React App

```bash
npm start
```

Frontend runs at **[http://localhost:3000](http://localhost:3000)**

---

## PI Endpoints

| Method | Endpoint                | Description                                  |
| ------ | ----------------------- | -------------------------------------------- |
| `POST` | `/api/emergency/`       | Create a new emergency                       |
| `GET`  | `/api/emergency/`       | Get all active emergencies                   |
| `GET`  | `/api/emergency/{id}`   | Get emergency by ID                          |
| `PUT`  | `/api/emergency/{id}`   | Update emergency details                     |
| `GET`  | `/api/emergency/status` | (Optional) Get summary of active emergencies |
| `POST` | `/api/navigation/route` | Get optimized route                          |
| `GET`  | `/api/priority/`        | Get priority-wise emergency list             |

---

### Example: Create Emergency

**Request**

```json
POST /api/emergency/
{
  "title": "Medical Emergency",
  "description": "Person fainted near north gate",
  "priority": "high"
}
```

**Response**

```json
{
  "id": 1,
  "title": "Medical Emergency",
  "status": "active",
  "priority": "high",
  "created_at": "2025-10-06T11:30:00Z"
}
```

---

## Database Schema (Simplified)

**Emergency Table**

| Column      | Type                  | Description        |
| ----------- | --------------------- | ------------------ |
| id          | Integer               | Primary Key        |
| title       | String                | Emergency title    |
| description | String                | Description        |
| status      | Enum(active/resolved) | Current status     |
| priority    | Enum(low/medium/high) | Severity           |
| created_at  | DateTime              | Creation timestamp |

---

##  AI & Prediction (Future Integration)

The system can integrate an **online learning crowd prediction model**, which continuously learns from:

* Ticket sales / entry data
* CCTV footfall metrics
* Emergency reports

Possible algorithms:

* Random Forest / Gradient Boosting
* LSTM for time-series crowd forecasting

This can help predict future crowd surges and send preventive alerts.

---

## Security & Performance

* JWT-based authentication for all user endpoints.
* CORS middleware enabled for React integration.
* Optimized SQLAlchemy queries to minimize latency.
* Scalable microservice-friendly FastAPI architecture.

---

##  Contributors

| Name                | Role                             |
| ------------------- | -------------------------------- |
| **Sthuthi Poojary** | Backend Developer                |
| **Poorna G Kollya** | Frontend Developer               |
| **Shivani L N**     | Backend Developer                |
| **Thrisha Rai A**   | Frontend Developer               |
| **Dhwani Shrikar**  | Version Control                  |
| **Dimply Kundar**   | Research and documentation       |




