// Import dependencies
import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
} from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { ListEmployeesDto } from "./dto/list-employees.dto";
import { EmployeeService } from "./employee.service";
import { type Employee } from "./entities/employee.entity";
// Define controller
@Controller("/employee")
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
    async getOne(@Param("employeeId") employeeId: string): Promise<Employee> {
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
}
