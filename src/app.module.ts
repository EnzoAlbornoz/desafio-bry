// Import Dependencies
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./common/database/database.module";
import { CompanyModule } from "./company/company.module";
import { EmployeeModule } from "./employee/employee.module";

// Define application
@Module({
    imports: [
        // Shared modules
        ConfigModule.forRoot(),
        DatabaseModule,
        // Domains modules
        EmployeeModule,
        CompanyModule,
    ],
})
export class AppModule {}
