"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lti_provider_1 = require("./lti/lti.provider");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const ltiApp = await (0, lti_provider_1.setupLti)(configService);
    const expressInstance = app.getHttpAdapter().getInstance();
    expressInstance.use('/lti', ltiApp);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    const expressListEndpoints = require('express-list-endpoints');
    const endpoints = expressListEndpoints(expressInstance);
    console.log('Registered endpoints:', endpoints);
}
bootstrap();
//# sourceMappingURL=main.js.map