"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    app.setGlobalPrefix('api/v1', { exclude: [''] });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
    }));
    app.enableCors({
        "origin": [
            "http://localhost:3000",
            "https://e-learning-wheat-seven.vercel.app",
        ],
        "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
        "preflightContinue": false,
        credentials: true
    });
    await app.listen(port ?? 8080);
}
bootstrap();
//# sourceMappingURL=main.js.map