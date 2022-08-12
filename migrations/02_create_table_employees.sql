CREATE TABLE IF NOT EXISTS employees (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL CHECK("name" <> ''),
    "social_security_number" char(11) NOT NULL CHECK("social_security_number" <> ''),
    "email" email NOT NULL,
    "address" text NOT NULL CHECK("address" <> ''),
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamptz
);

-- Partial Index to prevent double registration
CREATE UNIQUE INDEX idx_employees_ssn_deleted_at
    ON employees ("social_security_number")
    WHERE "deleted_at" IS NULL
;
