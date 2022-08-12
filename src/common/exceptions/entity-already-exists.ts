// Import dependencies
import { ConflictException } from "@nestjs/common";
// Define exception
export class EntityAlreadyExists extends ConflictException {
    constructor(entityName: string) {
        super(`This entity of type ${entityName} already exists`);
    }
}
