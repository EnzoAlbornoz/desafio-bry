import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    // Create Nest application with Fastify
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { logger: ["log"] },
    );
    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe());
    // Create swagger docs
    const swaggerConfig = new DocumentBuilder()
        .setTitle("API Rest - Desafio BRy")
        .setDescription("Desafio do processo seletivo BRy")
        .setVersion("0.1.0")
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    // Add Swagger docs under /docs
    SwaggerModule.setup("docs", app, swaggerDocument);
    // Enable requests
    await app.listen(3000);
}
bootstrap();
