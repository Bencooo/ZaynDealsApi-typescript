"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const userRoutes_1 = __importDefault(require("./user/routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', userRoutes_1.default);
const server = http_1.default.createServer(app);
server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
});
//# sourceMappingURL=index.js.map