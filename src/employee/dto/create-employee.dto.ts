// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { IsCPF } from "brazilian-class-validator";
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
// Define DTO
export class CreateEmployeeDto {
    @ApiProperty({
        description: "Employee's name",
        example: "João da Silva",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description:
            "Employee's brazillian Social Security Number (CPF, in portuguese)",
        example: "1234567809",
    })
    @IsCPF()
    @IsNotEmpty()
    socialSecurityNumber: string;

    @ApiProperty({
        description: "Employee's e-mail",
        example: "employe1234@bigtech.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "Employee's address",
        example: "742 Evergreen Terrace, Springfield",
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: "Ids of the companies associated with the employee",
        examples: [
            undefined,
            [],
            ["69412bc6-4938-4416-946d-344daf442769"],
            [
                "69412bc6-4938-4416-946d-344daf442769",
                "5eccd940-189d-4229-8a56-130d86862065",
            ],
        ],
    })
    @IsUUID("4", { each: true })
    @IsArray()
    @IsOptional()
    companies?: Array<string>;
}
