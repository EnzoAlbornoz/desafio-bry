// Define environment variables
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_HOST: string;
            DATABASE_PORT: string;
            DATABASE_USER: string;
            DATABASE_PASS: string;
        }
    }
}
// Define as a module
export default {};
