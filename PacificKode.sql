CREATE DATABASE PacifickodeDB;

USE PacifickodeDB

CREATE TABLE Departments(
   DepartmentId NVARCHAR(10) NOT NULL,
   DepartmentName NVARCHAR(100) NOT NULL,

   CONSTRAINT PK_Departments PRIMARY KEY CLUSTERED(DepartmentId)
)

CREATE TABLE Employees(
   EmployeeId INT NOT NULL IDENTITY(1,1),
   FirstName NVARCHAR(50) NOT NULL,
   LastName NVARCHAR(50) NOT NULL,
   Email NVARCHAR(100) NOT NULL,
   DateOfBirth DATE NOT NULL,
   Salary DECIMAL(18,2) NOT NULL,
   DepartmentId NVARCHAR(10) NOT NULL,

   CONSTRAINT PK_Employees PRIMARY KEY CLUSTERED(EmployeeId),
   CONSTRAINT UQ_Employees_Email UNIQUE(Email),
   CONSTRAINT  CHK_Employees_Salary CHECK (Salary >= 0),
   CONSTRAINT CHK_Employees_DateOfBirth CHECK (DateOfBirth <= CAST(GETDATE() AS DATE)),
   CONSTRAINT FK_Employees_Departments FOREIGN KEY(DepartmentId) REFERENCES Departments(DepartmentId)

);

CREATE NONCLUSTERED INDEX Idx_Employees_DepartmentId ON Employees(DepartmentId);

CREATE NONCLUSTERED INDEX Idx_Employees_FirstName_LastName ON Employees(FirstName,LastName);



SELECT 'Connection successful' AS Status;

