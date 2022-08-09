// Import dependencies
import { Company } from "src/company/entities/company.entity";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinTable,
    ManyToMany,
} from "typeorm";
// Define entity
@Entity("employees")
export class Employee {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("varchar", { length: 11 })
    socialSecurityNumber: string;

    @Column("varchar", { length: 254 })
    email: string;

    // This could change based on the country standards for addresses (or maybe use an International Postal Address)
    @Column("text")
    address: string;

    @ManyToMany(() => Company, (company) => company.employees, {
        cascade: true,
    })
    @JoinTable({ name: "companies_employees" })
    companies: Array<Company>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
