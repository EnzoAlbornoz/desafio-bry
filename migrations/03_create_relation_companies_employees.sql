CREATE TABLE IF NOT EXISTS companies_employees (
    "company_id" uuid NOT NULL REFERENCES companies ("id"),
    "employee_id" uuid NOT NULL REFERENCES employees ("id"),
    PRIMARY KEY ("company_id", "employee_id")
)
