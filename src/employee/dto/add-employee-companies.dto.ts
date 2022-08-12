// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsNotEmpty, IsUUID, ValidateIf } from "class-validator";
// Define DTO
export class AddEmployeeCompaniesBodyDto {
    @ApiProperty({
        description:
            "Single company to be included to the user. It should receive only the Id of the company.",
    })
    @IsUUID("4")
    @IsNotEmpty()
    @ValidateIf((o) => o.companies === undefined)
    company?: string;

    @ApiProperty({
        description:
            "Multiple companies to be included to the user. It should receive only the Ids of the companies.",
    })
    @IsUUID("4", { each: true })
    @ArrayNotEmpty()
    @ValidateIf((o) => o.company === undefined)
    companies?: Array<string>;
}

export class AddEmployeeCompaniesParamsDto {
    @IsUUID("4")
    @IsNotEmpty()
    employeeId: string;
}
