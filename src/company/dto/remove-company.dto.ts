// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
// Define DTO
export class RemoveCompanyParamsDto {
    @ApiProperty({
        description: "Company's identifier",
        example: "6911e262-467b-4044-b385-d9247df9cae7",
    })
    @IsUUID("4")
    @IsNotEmpty()
    companyId: string;
}
