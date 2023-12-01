"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otherSchema = new mongoose_1.default.Schema({
    percentageRate: {
        type: Number,
    },
    totalBal: {
        type: Number,
    }
});
const otherModel = mongoose_1.default.model("staffOther", otherSchema);
exports.default = otherModel;
