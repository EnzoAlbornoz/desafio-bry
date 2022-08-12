// Import dependencies
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "../employee/entities/employee.entity";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { Company } from "./entities/company.entity";
// Define module
@Module({
    controllers: [CompanyController],
    imports: [TypeOrmModule.forFeature([Company, Employee])],
    providers: [CompanyService],
})
export class CompanyModule {}
