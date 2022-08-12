// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsNotEmpty, IsUUID, ValidateIf } from "class-validator";
// Define DTO
export class AddCompanyEmployeesBodyDto {
    @ApiProperty({
        description:
            "Single employee to be included into the company. It should receive only the Id of the employee.",
    })
    @IsUUID("4")
    @IsNotEmpty()
    @ValidateIf((o) => o.employees === undefined)
    employee?: string;

    @ApiProperty({
        description:
            "Multiple employees to be included into the company. It should receive only the Ids of the employees.",
    })
    @IsUUID("4", { each: true })
    @ArrayNotEmpty()
    @ValidateIf((o) => o.employee === undefined)
    employees?: Array<string>;
}

export class AddCompanyEmployeesParamsDto {
    @IsUUID("4")
    companyId: string;
}
