"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminAuth = new mongoose_1.default.Schema({
    companyCode: {
        type: String,
    },
    companyname: {
        type: String,
        unique: true
    },
    companyEmail: {
        type: String,
        unique: true,
        required: [true, "please enter your company email"],
        trim: true,
        lowercase: true,
    },
    yourName: {
        type: String,
        required: [true, "please enter your name"],
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
    },
    walletNumber: Number,
    wallet: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "adminWallet",
        },
    ],
    transactionHistory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "adminTransactionHistory",
        },
    ],
    viewUser: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "staffAuth",
        }
    ]
}, { timestamps: true });
const adminAuth = mongoose_1.default.model("adminAuthModel", AdminAuth);
exports.default = adminAuth;
