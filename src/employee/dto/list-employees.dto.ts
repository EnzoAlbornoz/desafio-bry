// Import dependencies
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
    @ValidateIf(({ pageSize }) => typeof pageSize === "number")
    @Min(0)
    @IsInt()
    @IsOptional()
    page?: number;

    @ValidateIf(({ page }) => typeof page === "number")
    @IsPositive()
    @IsInt()
    @IsOptional()
    pageSize?: number;
}
