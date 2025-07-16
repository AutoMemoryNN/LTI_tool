"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLtiProvider = createLtiProvider;
exports.setupLti = setupLti;
const ltijs_1 = require("ltijs");
function createLtiProvider(config) {
    const key = config.get('LTI_KEY');
    const mongoUrl = config.get('LTI_MONGO');
    if (!key) {
        throw new Error('LTI_KEY is not defined');
    }
    if (!mongoUrl) {
        throw new Error('LTI_MONGO is not defined');
    }
    ltijs_1.Provider.setup(key, { url: mongoUrl });
}
async function setupLti(config) {
    createLtiProvider(config);
    ltijs_1.Provider.onConnect((token, _req, res) => {
        console.log('✅ LTI Launch Payload:', token);
        return res.send('Hello from LTI-NestJS 🎓');
    });
    await ltijs_1.Provider.deploy({ serverless: true });
    return ltijs_1.Provider.app;
}
//# sourceMappingURL=lti.provider.js.map