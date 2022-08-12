// Import dependencies
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../company/entities/company.entity";
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
type UpdateEmployeeParams = Pick<
    Partial<CreateEmployeeParams>,
    "name" | "email" | "address"
>;
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

    async updateEmployee(
        employee: Employee,
        { name, email, address }: UpdateEmployeeParams,
    ): Promise<Employee> {
        // Update Employee data
        employee.name = name ?? employee.name;
        employee.email = email ?? employee.email;
        employee.address = address ?? employee.address;
        // Persist entity
        return this.employeesRepository.save(employee);
    }

    async addCompanyToEmployee(
        employee: Employee,
        companiesIds: Array<string>,
    ) {
        // Update Employee data
        employee.companies.push(
            ...companiesIds.map((companyId) => {
                const company = new Company();
                company.id = companyId;
                return company;
            }),
        );
        // Persist entity
        return this.employeesRepository.save(employee);
    }

    async removeCompanyFromEmployee(
        employee: Employee,
        companiesIds: Array<string>,
    ) {
        // Update Employee data
        employee.companies = employee.companies.filter(
            (company) => !companiesIds.includes(company.id),
        );
        // Persist Entity
        return this.employeesRepository.save(employee);
    }

    async removeEmployee(employee: Employee): Promise<Employee> {
        // Soft remove the Employee
        const [removedEmployee] = await this.employeesRepository.softRemove([
            employee,
        ]);
        // Return removed Employee
        return removedEmployee;
    }
}
