// Import dependencies
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/company/entities/company.entity";
import { DeepPartial, type Repository } from "typeorm";
import { Employee } from "./entities/employee.entity";
// Define Types
export interface CreateEmployeeParams {
    name: string;
    socialSecurityNumber: string;
    email: string;
    address: string;
    companies: Array<string>;
}

interface PaginationOptions {
    page: number;
    pageSize: number;
}
// Define service
@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) {}

    async listEmployees(
        paginationOptions?: PaginationOptions,
    ): Promise<Array<Employee>> {
        // Define pagination options
        const { page = 0, pageSize = 1 } = paginationOptions || {};
        const paginationSkip = paginationOptions ? page * pageSize : undefined;
        const paginationTake = paginationOptions ? pageSize : undefined;
        // Fetch Employees
        const employees = this.employeesRepository.find({
            skip: paginationSkip,
            take: paginationTake,
            relations: {
                companies: true,
            },
        });
        // Return fetched Employees
        return employees;
    }

    async getEmployee(employeeId: string): Promise<Employee | null> {
        // Fetch Employee
        const maybeEmployee = this.employeesRepository.findOne({
            where: { id: employeeId },
            relations: { companies: true },
        });
        // Maybe return a employee
        return maybeEmployee;
    }

    async createEmployee({
        name,
        socialSecurityNumber,
        email,
        address,
        companies,
    }: CreateEmployeeParams): Promise<Employee> {
        // Create empty entity
        let employee = this.employeesRepository.create({
            name,
            socialSecurityNumber,
            email,
            address,
            companies: companies.map((companyId) => ({ id: companyId })),
        });
        // Persist entity on database
        employee = await this.employeesRepository.save(employee);
        // Return created entity
        return employee;
    }
}
