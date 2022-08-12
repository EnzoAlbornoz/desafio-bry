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
// Define entity
@Entity("employees")
@Index(["socialSecurityNumber", "deletedAt"], { unique: true })
export class Employee {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("varchar", { length: 11, unique: true })
    socialSecurityNumber: string;

    @Column("varchar", { length: 254 })
    email: string;

    // This could change based on the country standards for addresses (or maybe use an International Postal Address)
    @Column("text")
    address: string;

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
