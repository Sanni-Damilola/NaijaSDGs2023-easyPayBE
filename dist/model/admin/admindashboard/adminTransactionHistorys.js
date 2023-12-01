"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminTransactionHistorySchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
    },
    date: {
        type: String,
    },
    transactionReference: {
        type: Number,
    },
});
const adminTransactionHistory = mongoose_1.default.model("adminTransactionHistory", adminTransactionHistorySchema);
exports.default = adminTransactionHistory;
