// Import dependencies
import { IsNotEmpty, IsUUID } from "class-validator";
// Define DTO
export class GetOneEmployeeDto {
    @IsUUID("4")
    employeeId: string;
}
