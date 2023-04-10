import fs from "fs";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface.js";
import {
    SSL_PRIVATE_KEY_PATH,
    SSL_CERTIFICATE_PATH,
    USE_CORS,
} from "./config/env.js";

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

    await app.listen(process.env.PORT || 3000);
};

bootstrap();
