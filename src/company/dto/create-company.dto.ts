// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { IsCNPJ } from "brazilian-class-validator";
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
// Define DTO
export class CreateCompanyDto {
    @ApiProperty({
        description: "Compnany's name",
        example: "Big Tech",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description:
            "Company's brazillian National Registry of Legal Entity (CNPJ, in portuguese)",
        example: "55554128000199",
    })
    @IsCNPJ()
    @IsNotEmpty()
    nationalRegistryOfLegalEntity: string;

    @ApiProperty({
        description: "Company's address",
        example: "100 Industrial Way, Springfield",
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        type: [String],
        description: "Ids of the employees associated with the company",
        examples: {
            optional: undefined,
            empty: [],
            singleEmployee: ["31e663a6-f531-4ed0-a3b4-30d1c60ea2d4"],
            multipleEmployees: [
                "31e663a6-f531-4ed0-a3b4-30d1c60ea2d4",
                "841e6467-33f2-46ba-9b5f-271a5eda72e9",
            ],
        },
    })
    @IsUUID("4", { each: true })
    @IsArray()
    @IsOptional()
    employees?: Array<string>;
}
