CREATE TABLE IF NOT EXISTS companies (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL CHECK("name" <> ''),
    "national_registry_of_legal_entity" char(14) NOT NULL CHECK("national_registry_of_legal_entity" <> ''),
    "address" text NOT NULL CHECK("address" <> ''),
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamptz
);

-- Partial Index to prevent double registration
CREATE UNIQUE INDEX idx_companies_nrle_deleted_at
    ON companies ("national_registry_of_legal_entity")
    WHERE "deleted_at" IS NULL
;
