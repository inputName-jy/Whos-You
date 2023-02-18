-- USE your_database;


-- INSERT INTO your_table_for_departments
INSERT INTO department (name)
VALUES
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Sales');

-- INSERT INTO your_table_for_roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4),
    ('Lead Engineer', 120000, 1),
    ('Software Engineer', 100000, 1),
    ('Account Manager', 80000, 2),
    ('Accountant', 65000, 2),
    ('Legal Team Lead', 100000, 3),
    ('Lawyer', 80000, 3);


-- INSERT INTO your_table_for_employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, null),
    ('Jane', 'Doe', 2, 1),
    ('John', 'Smith', 3, 2),
    ('Jane', 'Smith', 4, null),
    ('John', 'Doe', 5, 3),
    ('Jane', 'Doe', 6, 4),
    ('John', 'Smith', 7, null),
    ('Jane', 'Smith', 8, 4);