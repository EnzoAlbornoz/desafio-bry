// Import dependencies
import { registerAs } from "@nestjs/config";
// Define config
export default registerAs("database", () => ({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PORT,
}));
