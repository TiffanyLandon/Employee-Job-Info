DROP DATABASE IF EXISTS department;
CREATE DATABASE department;

USE department;

CREATE TABLE role (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  salary  DECIMAL(30,2) NOT NULL
);

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(30) NOT NULL
);