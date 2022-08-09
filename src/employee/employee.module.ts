// Import dependencies
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeController } from "./employee.controller";
import { Employee } from "./entities/employee.entity";
// Define module
@Module({
    controllers: [EmployeeController],
    imports: [TypeOrmModule.forFeature([Employee])],
})
export class EmployeeModule {}
