import { Test, TestingModule } from "@nestjs/testing";
import {
    DynamicModule,
    INestApplication,
    ValidationPipe,
} from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
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

describe("CompanyController (e2e)", () => {
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

    it("/companies (GET)", () => {
        return request(app.getHttpServer()).get("/companies").expect(200);
    });

    it("/companies (POST) - 201 - Valid User", () => {
        const name = faker.name.fullName();
        const address = faker.address.streetAddress(true);
        const nationalRegistryOfLegalEntity = generateNrle(false);

        return request(app.getHttpServer())
            .post("/companies")
            .send({
                name,
                address,
                nationalRegistryOfLegalEntity,
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.name).toBe(name);
                expect(res.body.address).toBe(address);
                expect(res.body.nationalRegistryOfLegalEntity).toBe(
                    nationalRegistryOfLegalEntity,
                );
                expect(res.body.employees).toStrictEqual([]);
                expect(res.body.deletedAt).toBeNull();
                expect(Date.parse(res.body.createdAt)).not.toBeNaN();
                expect(Date.parse(res.body.updatedAt)).not.toBeNaN();
            });
    });

    it("/companies (POST) - 400 - Invalid User", () => {
        const name = faker.name.fullName();
        const address = faker.address.streetAddress(true);
        const nationalRegistryOfLegalEntity = generateNrle(false);

        return request(app.getHttpServer())
            .post("/companies")
            .send({
                address,
                nationalRegistryOfLegalEntity,
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.error).toBe("Bad Request");
            });
    });

    describe("A company is created", () => {
        let company: Company;
        beforeEach(async () => {
            const companyService = app
                .select(CompanyModule)
                .get(CompanyService);
            company = await companyService.createCompany({
                name: faker.name.fullName(),
                address: faker.address.streetAddress(true),
                nationalRegistryOfLegalEntity: generateNrle(false),
                employees: [],
            });
        });

        it("/companies/:companyId (GET) - 200 - Valid companyId", () => {
            return request(app.getHttpServer())
                .get(`/companies/${company.id}`)
                .expect(200);
        });

        it("/companies/:companyId (PATCH) - 200 - Valid companyId", () => {
            const newName = faker.company.name();
            return request(app.getHttpServer())
                .patch(`/companies/${company.id}`)
                .send({
                    name: newName,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toBeDefined();
                    expect(Date.parse(res.body.updatedAt)).toBeGreaterThan(
                        company.updatedAt.getTime(),
                    );
                    expect(res.body.name).toBe(newName);
                });
        });

        it("/companies/:companyId (DELETE) - 200 - Valid companyId", async () => {
            await request(app.getHttpServer())
                .delete(`/companies/${company.id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toBeDefined();
                    expect(Date.parse(res.body.deletedAt)).toBeGreaterThan(
                        company.updatedAt.getTime(),
                    );
                    // expect(res.body.name).toBe(newName);
                });
            const maybeCompany = await app
                .select(CompanyModule)
                .get(CompanyService)
                .getCompany(company.id);
            return expect(maybeCompany).toBeNull();
        });

        describe("and a employee is created", () => {
            let employee: Employee;
            beforeEach(async () => {
                const employeeService = app
                    .select(EmployeeModule)
                    .get(EmployeeService);
                employee = await employeeService.createEmployee({
                    name: faker.name.fullName(),
                    address: faker.address.streetAddress(true),
                    email: faker.internet.email(),
                    socialSecurityNumber: generateSsn(false),
                    companies: [],
                });
            });

            it("/companies/:companyId/employees (POST) - 200 - Valid companyId", () => {
                return request(app.getHttpServer())
                    .post(`/companies/${company.id}/employees`)
                    .send({
                        employee: employee.id,
                    })
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).toBeDefined();
                        expect(Array.isArray(res.body.employees));
                        expect(
                            (res.body.employees as Employee[]).find(
                                ({ id }) => id === employee.id,
                            ),
                        ).not.toBeNull();
                    });
            });

            describe("and the employee is assigned to the company", () => {
                beforeEach(async () => {
                    const companyService = app
                    .select(CompanyModule)
                    .get(CompanyService);

                    company = await companyService.addEmployeeToCompany(company, [employee.id]);
                })

                it("/companies/:companyId/employees/:employeeId (DELETE) - 200 - Valid companyId", () => {
                    return request(app.getHttpServer())
                        .delete(`/companies/${company.id}/employees/${employee.id}`)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body).toBeDefined();
                            expect(Array.isArray(res.body.employees));
                            expect(
                                (res.body.employees as Employee[]).find(
                                    ({ id }) => id === employee.id,
                                ),
                            ).toBeUndefined();
                        });
                });
            })

        });
    });
});
