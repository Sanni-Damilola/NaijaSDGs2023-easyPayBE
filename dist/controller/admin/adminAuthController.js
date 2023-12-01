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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneAdmin = exports.getAllAdmin = exports.adminSignin = exports.adminSignup = void 0;
const adminAuth_1 = __importDefault(require("../../model/admin/adminAuth"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminWallets_1 = __importDefault(require("../../model/admin/admindashboard/adminWallets"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyname, companyEmail, yourName, password, walletNumber } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const dater = Date.now();
        const generateNumber = Math.floor(Math.random() * 78) + dater;
        const genCode = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false,
        });
        const admin = yield adminAuth_1.default.create({
            companyCode: genCode,
            companyname,
            companyEmail,
            yourName,
            password: hash,
            walletNumber: generateNumber,
        });
        const createWallet = yield adminWallets_1.default.create({
            _id: admin === null || admin === void 0 ? void 0 : admin._id,
            balance: 15000,
            credit: 0,
            debit: 0,
        });
        admin === null || admin === void 0 ? void 0 : admin.wallet.push(new mongoose_1.default.Types.ObjectId(createWallet === null || createWallet === void 0 ? void 0 : createWallet._id));
        admin.save();
        return res.status(200).json({
            message: "Success",
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred while creating admin",
            data: error.message,
        });
    }
});
exports.adminSignup = adminSignup;
const adminSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { companyEmail, password, companyname } = req.body;
        const admin = yield adminAuth_1.default.findOne({ companyEmail });
        if ((admin === null || admin === void 0 ? void 0 : admin.companyname) !== companyname) {
            return;
        }
        else {
            const check = yield bcrypt_1.default.compare(password, admin === null || admin === void 0 ? void 0 : admin.password);
            if (check) {
                res.status(201).json({
                    message: "welcome",
                    data: admin
                });
            }
            else {
                console.log("bad");
                return res.status(400).json({
                    message: "login failed"
                });
            }
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occurred while creating admin",
            data: error.message,
        });
    }
});
exports.adminSignin = adminSignin;
//get all admins
const getAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminAuth_1.default.find();
        return res.status(200).json({
            message: "get all admins",
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get admin",
            data: error,
            err: error.message,
        });
    }
});
exports.getAllAdmin = getAllAdmin;
const getOneAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminAuth_1.default.findById(req.params.adminId).populate([
            {
                path: "wallet",
                select: "balance credit debit",
            },
            {
                path: "viewUser",
            },
            {
                path: "transactionHistory"
            }
        ]);
        return res.status(200).json({
            message: "get one admin",
            data: admin,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get one admin",
            data: error,
            err: error.message,
        });
    }
});
exports.getOneAdmin = getOneAdmin;
