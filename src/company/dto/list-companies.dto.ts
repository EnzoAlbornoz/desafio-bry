// Import dependencies
import { ApiProperty } from "@nestjs/swagger";
import {
    IsInt,
    IsOptional,
    IsPositive,
    Min,
    ValidateIf,
} from "class-validator";

// Export DTO
export class ListCompaniesDto {
    // Pagination parameters
    @ApiProperty({
        description: "Pagination - Selected page",
        example: 3,
        minimum: 0,
    })
    @ValidateIf(({ pageSize }) => typeof pageSize === "number")
    @Min(0)
    @IsInt()
    @IsOptional()
    page?: number;

    @ApiProperty({
        description: "Pagination - Items per page",
        example: 20,
        minimum: 1,
    })
    @ValidateIf(({ page }) => typeof page === "number")
    @IsPositive()
    @IsInt()
    @IsOptional()
    pageSize?: number;
}
