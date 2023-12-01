"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const staffWalletSchema = new mongoose_1.default.Schema({
    balance: {
        type: Number,
        required: true,
    },
    credit: {
        type: Number,
    },
    debit: {
        type: Number,
    },
});
const staffWalletModel = mongoose_1.default.model("staffWallet", staffWalletSchema);
exports.default = staffWalletModel;
