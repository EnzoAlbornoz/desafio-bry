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
export class UpdateCompanyBodyDto {
    @ApiProperty({
        description: "Company's name",
        example: "João da Silva",
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: "Company's address",
        example: "742 Evergreen Terrace, Springfield",
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}

export class UpdateCompanyParamsDto {
    @IsUUID("4")
    @IsNotEmpty()
    companyId: string;
}
