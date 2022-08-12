import { Test, TestingModule } from "@nestjs/testing";
import {
    DynamicModule,
    INestApplication,
    ValidationPipe,
} from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { EmployeeModule } from "../src/employee/employee.module";
import { setupTestDatabase } from "./helpers/setup-test-db";
import { Company } from "../src/company/entities/company.entity";
import { Employee } from "../src/employee/entities/employee.entity";
import { CompanyModule } from "../src/company/company.module";
import { IMemoryDb, IBackup } from "pg-mem";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { DataSourceOptions, Db } from "typeorm";
import { faker } from "@faker-js/faker";
import { generate as generateNrle } from "@fnando/cnpj";
import { generate as generateSsn } from "@fnando/cpf";
// import { log } from "console";
import { EmployeeService } from "../src/employee/employee.service";
import * as bodyParser from "body-parser";
import { CompanyService } from "../src/company/company.service";

describe("EmployeeController (e2e)", () => {
    let app: INestApplication;
    let memoryDb: IMemoryDb;
    let memoryDbBackup: IBackup;

    beforeEach(async () => {
        // Prepare DB
        if (!memoryDb) {
            const { db, backup } = await setupTestDatabase();
            memoryDb = db;
            memoryDbBackup = backup;
        } else {
            memoryDbBackup.restore();
        }
        // Setup Base Module
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                // Create TypeOrm Adatper
                TypeOrmModule.forRootAsync({
                    useFactory: () => ({}),
                    dataSourceFactory: async (_) => {
                        const dataSource =
                            memoryDb.adapters.createTypeormDataSource({
                                type: "postgres",
                                useUTC: true,
                                namingStrategy: new SnakeNamingStrategy(),
                                applicationName: "Desafio BRy Service Mock",
                                entities: [Company, Employee],
                            } as DataSourceOptions);
                        return dataSource;
                    },
                }),
                EmployeeModule,
                CompanyModule,
            ],
        }).compile();
        // Setup Application
        app = moduleFixture.createNestApplication();
        // Enable validation pipes
        app.useGlobalPipes(new ValidationPipe());
        app.use(bodyParser.json());
        // Start the Application
        await app.init();
    });

    afterEach(async () => {
        // Close Nest
        await app.close();
    });

    it("/employees (GET)", () => {
        return request(app.getHttpServer()).get("/employees").expect(200);
    });

    it("/employees (POST) - 201 - Valid User", () => {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const address = faker.address.streetAddress(true);
        const socialSecurityNumber = generateSsn(false);

        return request(app.getHttpServer())
            .post("/employees")
            .send({
                name,
                email,
                address,
                socialSecurityNumber,
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.name).toBe(name);
                expect(res.body.email).toBe(email);
                expect(res.body.address).toBe(address);
                expect(res.body.socialSecurityNumber).toBe(
                    socialSecurityNumber,
                );
                expect(res.body.companies).toStrictEqual([]);
                expect(res.body.deletedAt).toBeNull();
                expect(Date.parse(res.body.createdAt)).not.toBeNaN();
                expect(Date.parse(res.body.updatedAt)).not.toBeNaN();
            });
    });

    it("/employees (POST) - 400 - Invalid User", () => {
        const email = faker.internet.email();
        const address = faker.address.streetAddress(true);
        const socialSecurityNumber = generateSsn(false);

        return request(app.getHttpServer())
            .post("/employees")
            .send({
                email,
                address,
                socialSecurityNumber,
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.error).toBe("Bad Request");
            });
    });

    describe("A user is created", () => {
        let employee: Employee;
        beforeEach(async () => {
            const employeeService = app
                .select(EmployeeModule)
                .get(EmployeeService);
            employee = await employeeService.createEmployee({
                name: faker.name.fullName(),
                email: faker.internet.email(),
                address: faker.address.streetAddress(true),
                socialSecurityNumber: generateSsn(false),
                companies: [],
            });
        });

        it("/employee/:employeeId (GET) - 200 - Valid employeeId", () => {
            return request(app.getHttpServer())
                .get(`/employees/${employee.id}`)
                .expect(200);
        });

        it("/employee/:employeeId (PATCH) - 200 - Valid employeeId", () => {
            const newName = faker.name.fullName();
            return request(app.getHttpServer())
                .patch(`/employees/${employee.id}`)
                .send({
                    name: newName,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toBeDefined();
                    expect(Date.parse(res.body.updatedAt)).toBeGreaterThan(
                        employee.updatedAt.getTime(),
                    );
                    expect(res.body.name).toBe(newName);
                });
        });

        it("/employee/:employeeId (DELETE) - 200 - Valid employeeId", async () => {
            await request(app.getHttpServer())
                .delete(`/employees/${employee.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toBeDefined();
                    expect(Date.parse(res.body.deletedAt)).toBeGreaterThan(
                        employee.updatedAt.getTime(),
                    );
                    // expect(res.body.name).toBe(newName);
                });
            const maybeEmployee = await app
                .select(EmployeeModule)
                .get(EmployeeService)
                .getEmployee(employee.id);
            return expect(maybeEmployee).toBeNull();
        });

        describe("and a company is created", () => {
            let company: Company;
            beforeEach(async () => {
                const companyService = app
                    .select(CompanyModule)
                    .get(CompanyService);
                company = await companyService.createCompany({
                    name: faker.company.name(),
                    address: faker.address.streetAddress(true),
                    nationalRegistryOfLegalEntity: generateNrle(false),
                    employees: [],
                });
            });

            it("/employees/:employeeId/companies (POST) - 200 - Valid employeeId", () => {
                return request(app.getHttpServer())
                    .post(`/employees/${employee.id}/companies`)
                    .send({
                        company: company.id,
                    })
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).toBeDefined();
                        expect(Array.isArray(res.body.companies));
                        expect(
                            (res.body.companies as Company[]).find(
                                ({ id }) => id === company.id,
                            ),
                        );
                    });
            });

            describe("and the company is assigned to the employee", () => {
                beforeEach(async () => {
                    const employeeService = app
                    .select(EmployeeModule)
                    .get(EmployeeService);

                    employee = await employeeService.addCompanyToEmployee(employee, [company.id]);
                })

                it("/employees/:employeeId/companies/:companyId (DELETE) - 200 - Valid employeeId", () => {
                    return request(app.getHttpServer())
                        .delete(`/employees/${employee.id}/companies/${company.id}`)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body).toBeDefined();
                            expect(Array.isArray(res.body.companies));
                            expect(
                                !(res.body.companies as Company[]).find(
                                    ({ id }) => id === company.id,
                                ),
                            );
                        });
                });
            })

        });
    });
});
