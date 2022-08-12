// Import dependencies
import { type DataSourceOptions } from "typeorm";
import { newDb, DataType } from "pg-mem";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { readdir, readFile } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import { randomUUID } from "node:crypto";
// Export helpers
export async function setupTestDatabase() {
    // Instantiate DB
    const db = newDb({ autoCreateForeignKeyIndices: true });
    // Setup Custom Domains
    db.public.registerEquivalentType({
        name: "email",
        equivalentTo: DataType.text,
        isValid(value) {
            return /^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                value,
            );
        },
    });
    // Setup UUID Generator
    db.public.registerFunction({
        name: "gen_random_uuid",
        args: [],
        returns: DataType.uuid,
        implementation: randomUUID,
    });
    // Give the Database a name
    db.public.registerFunction({
        name: "current_database",
        args: [],
        returns: DataType.text,
        implementation: () => "bry",
    });
    // Setup DB Schema
    const migrations = await readdir(
        resolvePath(__dirname, "../../migrations"),
    );
    for (const migration of migrations.sort()) {
        if (migration.startsWith("00_")) continue;

        const fileContent = await readFile(
            resolvePath(__dirname, "../../migrations", migration),
            { encoding: "utf8" },
        );
        db.public.query(fileContent);
    }
    // Backup DB
    const backup = db.backup();
    // Return Modules and DB
    return {
        db,
        backup,
    };
}
