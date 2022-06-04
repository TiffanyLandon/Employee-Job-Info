INSERT INTO departments (name)
VALUES
  ('Member Services'),
  ('Front End'),
  ('Janitor');

INSERT INTO roles (title,salary,department_id)
VALUES
  ('Customer Service',15.50,1),
  ('Cashier',12.00,2),
  ('Trash picker',10000,3);
 

INSERT INTO employees (first_name, last_name,roles_id,manager_id)
VALUES
  ('Tanya','Longhorn',1,1),
  ('Peter','John',1,Null),
  ('Sara','Header', 3,Null);
  


  
 