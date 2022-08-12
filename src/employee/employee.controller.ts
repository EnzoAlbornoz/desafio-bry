// Import dependencies
import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UnprocessableEntityException,
} from "@nestjs/common";
import {
    AddEmployeeCompaniesBodyDto,
    AddEmployeeCompaniesParamsDto,
} from "./dto/add-employee-companies.dto";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { GetOneEmployeeDto } from "./dto/get-one-employee.dto";
import { ListEmployeesDto } from "./dto/list-employees.dto";
import { RemoveEmployeeCompaniesParamsDto } from "./dto/remove-employee-company.dto";
import { RemoveEmployeeParamsDto } from "./dto/remove-employee.dto";
import {
    UpdateEmployeeBodyDto,
    UpdateEmployeeParamsDto,
} from "./dto/update-employee.dto";
import { EmployeeService } from "./employee.service";
import { type Employee } from "./entities/employee.entity";
// Define controller
@Controller("/employees")
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}

    @Get("/")
    async list(
        @Query() { page, pageSize }: ListEmployeesDto,
    ): Promise<Array<Employee>> {
        // Define pagination options'
        const pageDefined = typeof page === "number";
        const pageSizeDefined = typeof pageSize === "number";
        const paginationOptions =
            pageDefined && pageSizeDefined ? { page, pageSize } : undefined;
        // Fetch Employees
        const employees = await this.employeeService.listEmployees(
            paginationOptions,
        );
        // Return listed Employees
        return employees;
    }

    @Get("/:employeeId")
    async getOne(
        @Param() { employeeId }: GetOneEmployeeDto,
    ): Promise<Employee> {
        // Try get Employee
        const maybeEmployee = await this.employeeService.getEmployee(
            employeeId,
        );
        // Check for not found
        if (!maybeEmployee) {
            throw new NotFoundException(`Employee ${employeeId} not found`);
        }
        // Return the Employee
        return maybeEmployee;
    }

    @Post("/")
    async create(
        @Body()
        {
            name,
            socialSecurityNumber,
            email,
            address,
            companies = [],
        }: CreateEmployeeDto,
    ): Promise<Employee> {
        // Create Employee
        const employee = await this.employeeService.createEmployee({
            name,
            socialSecurityNumber,
            email,
            address,
            companies,
        });
        // Return Employee
        return employee;
    }

    @Patch("/:employeeId")
    async update(
        @Param() { employeeId }: UpdateEmployeeParamsDto,
        @Body() { name, email, address }: UpdateEmployeeBodyDto,
    ) {
        // Fetch Employee
        const maybeEmployee = await this.employeeService.getEmployee(
            employeeId,
        );
        // Check for not found
        if (!maybeEmployee) {
            throw new NotFoundException(`Employee ${employeeId} not found`);
        }
        // Update Employee
        const employee = await this.employeeService.updateEmployee(
            maybeEmployee,
            { name, address, email },
        );
        // Return updated Employee
        return employee;
    }

    @Post("/:employeeId/companies")
    async addCompanies(
        @Param() { employeeId }: AddEmployeeCompaniesParamsDto,
        @Body() { company, companies = [] }: AddEmployeeCompaniesBodyDto,
    ) {
        // Merge companies
        const mergedCompanies = companies.concat(company ? [company] : []);
        // Validate companies

        // Fetch Employee
        const maybeEmployee = await this.employeeService.getEmployee(
            employeeId,
        );
        // Check for not found
        if (!maybeEmployee) {
            throw new NotFoundException(`Employee ${employeeId} not found`);
        }
        // Add Companies to Employee
        const employee = await this.employeeService.addCompanyToEmployee(
            maybeEmployee,
            mergedCompanies,
        );
        // Return modified Employee
        return employee;
    }

    @Delete("/:employeeId/companies/:companyId")
    async removeCompany(
        @Param() { employeeId, companyId }: RemoveEmployeeCompaniesParamsDto,
    ) {
        // Validate if company exists

        // Fetch Employee
        const maybeEmployee = await this.employeeService.getEmployee(
            employeeId,
        );
        // Check for not found
        if (!maybeEmployee) {
            throw new NotFoundException(`Employee ${employeeId} not found`);
        }
        // Check if the user is assigned to company
        if (!maybeEmployee.companies.find(({ id }) => id === companyId)) {
            throw new UnprocessableEntityException(
                `Employee ${employeeId} is not assigned to Company ${companyId}`,
            );
        }
        // Add Companies to Employee
        const employee = await this.employeeService.removeCompanyFromEmployee(
            maybeEmployee,
            [companyId],
        );
        // Return modified Employee
        return employee;
    }

    @Delete("/:employeeId")
    async removeEmployee(@Param() { employeeId }: RemoveEmployeeParamsDto) {
        // Fetch Employee
        const maybeEmployee = await this.employeeService.getEmployee(
            employeeId,
        );
        // Check for not found
        if (!maybeEmployee) {
            throw new NotFoundException(`Employee ${employeeId} not found`);
        }
        // Remove Employee
        const removedEmployee = await this.employeeService.removeEmployee(
            maybeEmployee,
        );
        // Return removed Employee
        return removedEmployee;
    }
}
