// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsInt,
    IsOptional,
    IsPositive,
    Min,
    ValidateIf,
} from "class-validator";

// Export DTO
export class ListEmployeesDto {
    // Pagination parameters
    @ApiProperty({
        description: "Pagination - Selected page",
        example: 3,
        minimum: 0,
        required: false,
    })
    @ValidateIf(({ pageSize }) => typeof pageSize !== "undefined")
    @Min(0)
    @IsInt()
    @Type(() => Number)
    page?: number;

    @ApiProperty({
        description: "Pagination - Items per page",
        example: 20,
        minimum: 1,
        required: false,
    })
    @ValidateIf(({ page }) => typeof page !== "undefined")
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    pageSize?: number;
}
