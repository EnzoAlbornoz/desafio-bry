// Import dependencies
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityAlreadyExists } from "../common/exceptions/entity-already-exists";
import { Employee } from "../employee/entities/employee.entity";
import { QueryFailedError, type Repository } from "typeorm";
import { Company } from "./entities/company.entity";
// Define Types
export interface CreateCompanyParams {
    name: string;
    nationalRegistryOfLegalEntity: string;
    address: string;
    employees: Array<string>;
}

interface PaginationOptions {
    page: number;
    pageSize: number;
}
type UpdateCompanyParams = Pick<
    Partial<CreateCompanyParams>,
    "name" | "address"
>;
// Define service
@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
    ) {}

    async listCompanies(
        paginationOptions?: PaginationOptions,
    ): Promise<Array<Company>> {
        // Define pagination options
        const { page = 0, pageSize = 1 } = paginationOptions || {};
        const paginationSkip = paginationOptions ? page * pageSize : undefined;
        const paginationTake = paginationOptions ? pageSize : undefined;
        // Fetch Companies
        const companies = this.companiesRepository.find({
            skip: paginationSkip,
            take: paginationTake,
            relations: {
                employees: true,
            },
        });
        // Return fetched Companies
        return companies;
    }

    async getCompany(companyId: string): Promise<Company | null> {
        // Fetch Company
        const maybeCompany = this.companiesRepository.findOne({
            where: { id: companyId },
            relations: { employees: true },
        });
        // Maybe return a Company
        return maybeCompany;
    }

    async createCompany({
        name,
        nationalRegistryOfLegalEntity,
        address,
        employees,
    }: CreateCompanyParams): Promise<Company> {
        // Create empty entity
        let company = this.companiesRepository.create({
            name,
            nationalRegistryOfLegalEntity,
            address,
            employees: employees.map((employeeId) => ({ id: employeeId })),
        });
        // Persist entity on database
        try {
            company = await this.companiesRepository.save(company);
            // Return created entity
            return company;
        } catch (error) {
            // Check for Known errors
            if (
                error instanceof QueryFailedError &&
                error.message.includes("duplicate key value violates")
            ) {
                // Duplicate key violation
                throw new EntityAlreadyExists("Company");
            }
            // Default: Retrow
            throw error;
        }
    }

    async updateCompany(
        company: Company,
        { name, address }: UpdateCompanyParams,
    ): Promise<Company> {
        // Update Company data
        company.name = name ?? company.name;
        company.address = address ?? company.address;
        // Persist entity
        return this.companiesRepository.save(company);
    }

    async addEmployeeToCompany(company: Company, employeesIds: Array<string>) {
        // Update Company data
        company.employees.push(
            ...employeesIds.map((employeeId) => {
                const employee = new Employee();
                employee.id = employeeId;
                return employee;
            }),
        );
        // Persist entity
        return this.companiesRepository.save(company);
    }

    async removeEmployeeFromCompany(
        company: Company,
        employeesIds: Array<string>,
    ) {
        // Update Company data
        company.employees = company.employees.filter(
            (employee) => !employeesIds.includes(employee.id),
        );
        // Persist Entity
        return this.companiesRepository.save(company);
    }

    async removeCompany(company: Company): Promise<Company> {
        // Soft remove the Company
        const [removedCompany] = await this.companiesRepository.softRemove([
            company,
        ]);
        // Return removed Company
        return removedCompany;
    }
}
