// Import dependencies
import { Employee } from "../../employee/entities/employee.entity";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    Index,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString, IsUUID } from "class-validator";
import { IsCNPJ } from "brazilian-class-validator";
// Define entity
@Entity("companies")
@Index(["nationalRegistryOfLegalEntity", "deletedAt"], { unique: true })
export class Company {
    @ApiProperty({ description: "Company's id" })
    @IsUUID()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ description: "Company's name" })
    @IsString()
    @Column("text")
    name: string;

    @ApiProperty({
        description:
            "Company's brazillian national registry of legal entity (known as CNPJ)",
    })
    @IsCNPJ()
    @Column("varchar", { length: 14 })
    nationalRegistryOfLegalEntity: string;

    // This could change based on the country standards for addresses (or maybe use an International Postal Address)
    @ApiProperty({ description: "Company's address" })
    @IsString()
    @Column("text")
    address: string;

    @ApiProperty({ description: "Company's employees", type: [Employee] })
    @ManyToMany(() => Employee, (category) => category.companies)
    employees: Array<Employee>;

    @IsDate()
    @CreateDateColumn()
    createdAt: Date;

    @IsDate()
    @UpdateDateColumn()
    updatedAt: Date;

    @IsDate()
    @DeleteDateColumn()
    deletedAt?: Date;
}
