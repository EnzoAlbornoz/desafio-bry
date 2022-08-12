// Import dependencies
import { Company } from "../../company/entities/company.entity";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinTable,
    ManyToMany,
    Index,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID } from "class-validator";
import { IsCPF } from "brazilian-class-validator";
// Define entity
@Entity("employees")
@Index(["socialSecurityNumber", "deletedAt"], { unique: true })
export class Employee {
    @ApiProperty({ description: "Employee's id" })
    @IsUUID()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ description: "Employee's name" })
    @IsString()
    @Column("text")
    name: string;

    @ApiProperty({
        description:
            "Employee's brazillian social security number (known as CPF)",
    })
    @IsCPF()
    @Column("varchar", { length: 11, unique: true })
    socialSecurityNumber: string;

    @ApiProperty({ description: "Employee's e-mail" })
    @IsEmail()
    @Column("varchar", { length: 254 })
    email: string;

    // This could change based on the country standards for addresses (or maybe use an International Postal Address)
    @ApiProperty({ description: "Employee's address" })
    @IsString()
    @Column("text")
    address: string;

    @ApiProperty({ description: "Employee's companies", type: [Company] })
    @ManyToMany(() => Company, (company) => company.employees, {
        cascade: true,
    })
    @JoinTable({
        name: "companies_employees",
        joinColumn: {
            name: "employee_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: { name: "company_id", referencedColumnName: "id" },
    })
    companies: Array<Company>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
