// Import Dependencies
import { Module } from "@nestjs/common";
import { DatabaseModule } from "./common/database/database.module";
import { EmployeeModule } from "./employee/employee.module";

// Define application
@Module({
    imports: [
        // Shared modules
        DatabaseModule,
        // Domains modules
        EmployeeModule,
    ],
})
export class AppModule {}
