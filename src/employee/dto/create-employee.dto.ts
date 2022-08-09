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
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsCPF()
    @IsNotEmpty()
    socialSecurityNumber: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsUUID("4", { each: true })
    @IsArray()
    @IsOptional()
    companies?: Array<string>;
}
