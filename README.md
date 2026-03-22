## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Bootstrap 5 |
| Form Validation | React Hook Form + Zod |
| HTTP Client | Axios |
| Backend | .NET 8 Web API |
| Data Access | ADO.NET (raw SQL — no ORM) |
| Database | SQL Server 2022 |

---

## Features

### Departments
- Add a new department
- Edit department name
- Delete department (blocked if employees are assigned)
- Department ID is auto-converted to uppercase

### Employees
- Add a new employee
- Edit employee details
- Delete employee
- Age is auto-calculated from date of birth (frontend live preview + backend computed property)
- Department assigned via dropdown populated from the departments list

### General
- Form validation at every layer (HTML, Zod, .NET Model Annotations, Database Constraints)
- Toast notifications for success and error feedback
- Loading spinner while data is being fetched
- Confirm dialog before any delete action
- Reusable components — FormInput, FormSelect, PageHeader, TableSpinner, ConfirmDeleteModal
- React Router for client-side navigation
- CORS configured for local development

---

## Project Structure

```
Pacifickode-Practicaltest/
├── Controllers/
│   ├── DepartmentController.cs
│   └── EmployeeController.cs
├── Data/
│   ├── DepartmentRepository.cs
│   └── EmployeeRepository.cs
├── Models/
│   ├── Department.cs
│   └── Employee.cs
├── Properties/
├── pacifickode-ui/                        → React + Vite + TypeScript
│   ├── src/
│   │   ├── api/
│   │   │   ├── departmentApi.ts
│   │   │   └── employeeApi.ts
│   │   ├── components/
│   │   │   ├── ConfirmDeleteModal.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── TableSpinner.tsx
│   │   ├── pages/
│   │   │   ├── Departments.tsx
│   │   │   └── Employees.tsx
│   │   ├── schemas/
│   │   │   ├── departmentSchema.ts
│   │   │   └── employeeSchema.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── errorHelper.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   └── vite.config.ts
├── .gitignore
├── appsettings.json
├── appsettings.Development.json.example
├── Pacifickode-Practicaltest.csproj
├── Pacifickode-Practicaltest.slnx
├── PacificKode.sql                        → Database schema script
├── Program.cs
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js 18+](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Visual Studio 2022](https://visualstudio.microsoft.com/)
- [SQL Server 2022](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

---

## Setup & Installation

### Step 1 — Database

1. Open **SSMS** and connect to your SQL Server instance
2. Open the file `database/schema.sql`
3. Press **F5** to run the script
4. This will create the `PracticalTestDB` database with the following:
   - `Departments` table
   - `Employees` table
   - All constraints (PK, FK, UNIQUE, CHECK)
   - Indexes for performance

---

### Step 2 — Backend (.NET API)

1. Open `PracticalTest.API` in **Visual Studio 2022**

2. Copy the example config file:
```
appsettings.Development.json.example  →  appsettings.Development.json
```

3. Open `appsettings.Development.json` and update the connection string with your SQL Server instance name:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=PracticalTestDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> To find your server name — open SSMS and check the server name shown in the connection dialog

4. Press **F5** to run the API

5. Note the port number from the browser that opens (e.g. `http://localhost:5000`)

6. Verify the API is working by visiting:
```
http://localhost:5000/api/department
http://localhost:5000/api/employee
```
Both should return `[]` (empty array) if the database is empty.

---

### Step 3 — Frontend (React)

1. Navigate to the frontend folder:
```bash
cd pacifickode-ui
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```
.env.example  →  .env
```

4. Open `.env` and update the API URL with the port from Step 2:
```
VITE_BACKEND_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and go to:
```
http://localhost:5173
```

---

## Database Schema

### Departments
| Column | Type | Constraints |
|---|---|---|
| DepartmentId | NVARCHAR(10) | PRIMARY KEY |
| DepartmentName | NVARCHAR(100) | NOT NULL |

### Employees
| Column | Type | Constraints |
|---|---|---|
| EmployeeId | INT IDENTITY(1,1) | PRIMARY KEY |
| FirstName | NVARCHAR(50) | NOT NULL |
| LastName | NVARCHAR(50) | NOT NULL |
| Email | NVARCHAR(100) | NOT NULL, UNIQUE |
| DateOfBirth | DATE | NOT NULL |
| Salary | DECIMAL(18,2) | NOT NULL, >= 0 |
| DepartmentId | NVARCHAR(10) | FOREIGN KEY → Departments |

---

## API Endpoints

### Departments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/department` | Get all departments |
| POST | `/api/department` | Add a new department |
| PUT | `/api/department/{departmentId}` | Update a department |
| DELETE | `/api/department/{departmentId}` | Delete a department |

### Employees

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employee` | Get all employees |
| POST | `/api/employee` | Add a new employee |
| PUT | `/api/employee/{employeeId}` | Update an employee |
| DELETE | `/api/employee/{employeeId}` | Delete an employee |

---

## Validation Layers

```
User fills form
      ↓
HTML attributes       → maxLength, min, max, date picker restrictions
      ↓
Zod schema            → required, format, range, age check (18+)
      ↓
.NET Model Annotations → Required, StringLength, EmailAddress, Range
      ↓
Controller checks     → duplicate Department ID, duplicate Email
      ↓
Database constraints  → PK, FK, UNIQUE, CHECK, NOT NULL
```

---

## Environment Variables

### Frontend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND_API_URL` | Base URL of the .NET API | `http://localhost:5000/api` |

> Note: All Vite environment variables must start with `VITE_` to be accessible in the browser.

---

## Important Notes

- `appsettings.Development.json` is **gitignored** — never commit your connection string
- `.env` is **gitignored** — never commit your environment variables
- Use the `.example` files as templates when setting up on a new machine
- The `Age` field is computed — it is **not stored** in the database, it is calculated from `DateOfBirth` on every API response
- Deleting a department that has employees assigned will be **blocked** by the foreign key constraint

---

## Running Both Servers

You need both servers running at the same time:

| Server | Command | URL |
|---|---|---|
| Backend | Press F5 in Visual Studio | `http://localhost:5000` |
| Frontend | `npm run dev` | `http://localhost:5173` |
