// Import dependencies
import { Employee } from "src/employee/entities/employee.entity";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
} from "typeorm";
// Define entity
@Entity("companies")
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text")
    name: string;

    @Column("varchar", { length: 14 })
    nationalRegistryOfLegalEntity: string;

    // This could change based on the country standards for addresses (or maybe use an International Postal Address)
    @Column("text")
    address: string;

    @ManyToMany(() => Employee, (category) => category.companies, {
        cascade: true,
    })
    employees: Array<Employee>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
