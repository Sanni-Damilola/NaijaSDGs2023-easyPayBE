"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savingsSchema = new mongoose_1.default.Schema({
    percentageRate: {
        type: Number,
    },
    totalBal: {
        type: Number,
    }
});
const savingsModel = mongoose_1.default.model("staffSavingsPlan", savingsSchema);
exports.default = savingsModel;
