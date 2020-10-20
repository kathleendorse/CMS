DROP DATABASE IF EXISTS ems_DB;
CREATE DATABASE ems_DB;

USE ems_DB;

CREATE TABLE Departments(
  DepartmentID int NOT NULL AUTO_INCREMENT,
  DepartmentName VARCHAR(30) NOT NULL,
  PRIMARY KEY (DepartmentID)
);

CREATE TABLE Roles(
  RoleID INT NOT NULL AUTO_INCREMENT,
  Title VARCHAR(30) NOT NULL,
  Salary DECIMAL NOT NULL,
  DepartmentID INT,
  PRIMARY KEY (RoleID),
  FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

CREATE TABLE Employees(
  EmployeeID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(30) ,
  LastName VARCHAR(30),
  RoleID INT,
  ManagerID INT,
  PRIMARY KEY (EmployeeID),
  FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
  FOREIGN KEY (ManagerID) REFERENCES Employees(EmployeeID)
);

USE ems_DB;
INSERT INTO roles (Title, Salary)
VALUES("N/A", 0);

USE ems_DB;
INSERT INTO employees (FirstName, LastName, RoleID)
VALUES("None", "None", 1);

-- BELOW LINE NEEDS TO BE RUN SEPARATELY- AFTER EVERYTHING ABOVE

USE ems_DB;
DELETE FROM employees WHERE EmployeeID = 2;