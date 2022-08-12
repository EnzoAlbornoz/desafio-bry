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
import { ApiTags } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import {
    AddCompanyEmployeesBodyDto,
    AddCompanyEmployeesParamsDto,
} from "./dto/add-company-employees.dto";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { GetOneCompanyDto } from "./dto/get-one-company.dto";
import { ListCompaniesDto } from "./dto/list-companies.dto";
import { RemoveCompanyEmployeeParamsDto } from "./dto/remove-company-employee.dto";
import { RemoveCompanyParamsDto } from "./dto/remove-company.dto";
import {
    UpdateCompanyBodyDto,
    UpdateCompanyParamsDto,
} from "./dto/update-company.dto";
import { Company } from "./entities/company.entity";
// Define controller
@ApiTags("Companies")
@Controller("/companies")
export class CompanyController {
    constructor(private companyService: CompanyService) {}

    @Get("/")
    async list(
        @Query() { page, pageSize }: ListCompaniesDto,
    ): Promise<Array<Company>> {
        // Define pagination options
        const pageDefined = typeof page === "number";
        const pageSizeDefined = typeof pageSize === "number";
        const paginationOptions =
            pageDefined && pageSizeDefined ? { page, pageSize } : undefined;
        // Fetch Companies
        const companies = await this.companyService.listCompanies(
            paginationOptions,
        );
        // Return listed companies
        return companies;
    }

    @Get("/:companyId")
    async getOne(@Param() { companyId }: GetOneCompanyDto): Promise<Company> {
        // Try get Company
        const maybeCompany = await this.companyService.getCompany(companyId);
        // Check for not found
        if (!maybeCompany) {
            throw new NotFoundException(`Company ${companyId} not found`);
        }
        // Return the Company
        return maybeCompany;
    }

    @Post("/")
    async create(
        @Body()
        {
            name,
            nationalRegistryOfLegalEntity,
            address,
            employees = [],
        }: CreateCompanyDto,
    ): Promise<Company> {
        // Create Company
        const company = await this.companyService.createCompany({
            name,
            nationalRegistryOfLegalEntity,
            address,
            employees,
        });
        // Return Company
        return company;
    }

    @Patch("/:companyId")
    async update(
        @Param() { companyId }: UpdateCompanyParamsDto,
        @Body() { name, address }: UpdateCompanyBodyDto,
    ) {
        // Fetch Company
        const maybeCompany = await this.companyService.getCompany(companyId);
        // Check for not found
        if (!maybeCompany) {
            throw new NotFoundException(`Company ${companyId} not found`);
        }
        // Update Company
        const company = await this.companyService.updateCompany(maybeCompany, {
            name,
            address,
        });
        // Return updated Company
        return company;
    }

    @Post("/:companyId/employees")
    async addEmployees(
        @Param() { companyId }: AddCompanyEmployeesParamsDto,
        @Body() { employee, employees = [] }: AddCompanyEmployeesBodyDto,
    ) {
        // Merge employees
        const mergedCompanies = employees.concat(employee ? [employee] : []);
        // Validate employees

        // Fetch Company
        const maybeCompany = await this.companyService.getCompany(companyId);
        // Check for not found
        if (!maybeCompany) {
            throw new NotFoundException(`Company ${companyId} not found`);
        }
        // Add Employees to Company
        const company = await this.companyService.addEmployeeToCompany(
            maybeCompany,
            mergedCompanies,
        );
        // Return modified Company
        return company;
    }

    @Delete("/:companyId/employees/:employeeId")
    async removeEmployee(
        @Param() { companyId, employeeId }: RemoveCompanyEmployeeParamsDto,
    ) {
        // Fetch Company
        const maybeCompany = await this.companyService.getCompany(companyId);
        // Check for not found
        if (!maybeCompany) {
            throw new NotFoundException(`Company ${companyId} not found`);
        }
        // Check if the employee is assigned to company
        if (!maybeCompany.employees.find(({ id }) => id === employeeId)) {
            throw new UnprocessableEntityException(
                `Employee ${employeeId} is not assigned to Company ${companyId}`,
            );
        }
        // Add Companies to Company
        const company = await this.companyService.removeEmployeeFromCompany(
            maybeCompany,
            [employeeId],
        );
        // Return modified Company
        return company;
    }

    @Delete("/:companyId")
    async removeCompany(@Param() { companyId }: RemoveCompanyParamsDto) {
        // Fetch Company
        const maybeCompany = await this.companyService.getCompany(companyId);
        // Check for not found
        if (!maybeCompany) {
            throw new NotFoundException(`Company ${companyId} not found`);
        }
        // Remove Company
        const removedCompany = await this.companyService.removeCompany(
            maybeCompany,
        );
        // Return removed Company
        return removedCompany;
    }
}
