"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const DB_URI: string = process.env.MongoDB_URL?.toString()!;
const LIVE_URI = (_a = process.env.DB_Connection_String) === null || _a === void 0 ? void 0 : _a.toString();
const dbConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connect = yield mongoose_1.default.connect(LIVE_URI);
        console.log(`database is connected`);
    }
    catch (error) {
        console.log(`unable to connect to database ${error}`);
    }
});
exports.default = dbConfig;
