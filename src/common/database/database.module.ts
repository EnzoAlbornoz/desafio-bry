// Import dependencies
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import databaseConfig from "./database.config";
// Define module
@Module({
    imports: [
        ConfigModule.forFeature(databaseConfig),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("database.host"),
                port: configService.get("database.port"),
                username: configService.get("database.username"),
                password: configService.get("database.password"),
                autoLoadEntities: true,
                useUTC: true,
                namingStrategy: new SnakeNamingStrategy(),
                applicationName: "Desafio BRy Service",
            }),
        }),
    ],
})
export class DatabaseModule {}
