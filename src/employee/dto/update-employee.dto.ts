// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
// Define DTO
export class UpdateEmployeeBodyDto {
    @ApiProperty({
        description: "Employee's name",
        example: "João da Silva",
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: "Employee's e-mail",
        example: "employe1234@bigtech.com",
    })
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: "Employee's address",
        example: "742 Evergreen Terrace, Springfield",
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}

export class UpdateEmployeeParamsDto {
    @IsUUID("4")
    @IsNotEmpty()
    employeeId: string;
}
