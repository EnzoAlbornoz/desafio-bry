// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
// Define DTO
export class RemoveEmployeeCompaniesParamsDto {
    @ApiProperty({
        description: "Employee's identifier",
        example: "54a3a4b6-82ad-4aae-ae8d-8ecc22aecdc5",
    })
    @IsUUID("4")
    @IsNotEmpty()
    employeeId: string;

    @ApiProperty({
        description: "Employee's company identifier",
        example: "54a3a4b6-82ad-4aae-ae8d-8ecc22aecdc5",
    })
    @IsUUID("4")
    @IsNotEmpty()
    companyId: string;
}
