"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//default get
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "api is available for consumption testing ",
    });
});
//routes
app.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
});
