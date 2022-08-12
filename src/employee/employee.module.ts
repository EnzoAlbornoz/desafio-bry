// Import dependencies
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "../company/entities/company.entity";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { Employee } from "./entities/employee.entity";
// Define module
@Module({
    controllers: [EmployeeController],
    imports: [TypeOrmModule.forFeature([Employee, Company])],
    providers: [EmployeeService],
})
export class EmployeeModule {}
