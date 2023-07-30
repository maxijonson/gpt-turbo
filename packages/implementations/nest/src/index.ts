import fs from "fs";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module.js";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface.js";
import {
    SSL_PRIVATE_KEY_PATH,
    SSL_CERTIFICATE_PATH,
    USE_CORS,
    USE_SWAGGER,
    PORT,
} from "./config/env.js";
import { ZodValidationExceptionFilter } from "./filters/zod-validation-exception.filter.js";
import "./config/gpt-turbo.js";

patchNestJsSwagger();

const getHttpsOptions = (): HttpsOptions | undefined => {
    if (!SSL_PRIVATE_KEY_PATH || !SSL_CERTIFICATE_PATH) {
        console.info("❌ HTTPS disabled");
        return undefined;
    }

    const canUseHttps =
        fs.existsSync(SSL_PRIVATE_KEY_PATH) &&
        fs.existsSync(SSL_CERTIFICATE_PATH);

    if (!canUseHttps) {
        console.error(
            "HTTPS is enabled but the private key and/or the public certificate provided do not exist."
        );
        console.info("❌ HTTPS disabled");
        return undefined;
    }

    console.info("✅ HTTPS enabled");
    return {
        key: fs.readFileSync(SSL_PRIVATE_KEY_PATH, "utf-8"),
        cert: fs.readFileSync(SSL_CERTIFICATE_PATH, "utf-8"),
    };
};

const bootstrap = async () => {
    const httpsOptions = getHttpsOptions();
    const app = await NestFactory.create(AppModule, {
        httpsOptions,
    });

    if (USE_CORS) {
        app.enableCors();
    }
    console.info(USE_CORS ? "✅ CORS enabled" : "❌ CORS disabled");

    if (USE_SWAGGER) {
        const options = new DocumentBuilder()
            .setTitle("GPT Turbo - Nest")
            .setDescription("GPT Turbo implementation with NestJS")
            .setVersion("1.0")
            .addTag("gpt-turbo")
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup("swagger", app, document);
    }
    console.info(USE_SWAGGER ? "✅ Swagger enabled" : "❌ Swagger disabled");

    app.enableShutdownHooks();

    app.useGlobalFilters(new ZodValidationExceptionFilter());

    console.info(`🚀 Listening on port ${PORT}`);
    await app.listen(PORT);
};

bootstrap();
