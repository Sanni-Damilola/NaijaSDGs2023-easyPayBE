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
exports.checkPayment = exports.checkOutToBank = exports.payInToWallet = exports.fundWalletFromBank = exports.staffWithPlans = exports.MakeTransfer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const staffAuth_1 = __importDefault(require("../../../model/staff/staffAuth"));
const adminAuth_1 = __importDefault(require("../../../model/admin/adminAuth"));
const adminWallets_1 = __importDefault(require("../../../model/admin/admindashboard/adminWallets"));
const adminTransactionHistorys_1 = __importDefault(require("../../../model/admin/admindashboard/adminTransactionHistorys"));
const stafftransactionHistorys_1 = __importDefault(require("../../../model/staff/staffDashboard/stafftransactionHistorys"));
const StaffWallet_1 = __importDefault(require("../../../model/staff/staffDashboard/StaffWallet"));
const StaffHouse_1 = __importDefault(require("../../../model/staff/staffDashboard/StaffHouse"));
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const staffTravel_1 = __importDefault(require("../../../model/staff/staffDashboard/staffTravel"));
const staffFees_1 = __importDefault(require("../../../model/staff/staffDashboard/staffFees"));
//admin transfer from wallet to staff wallet for staffs with no plans
const MakeTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { walletNumber, amount } = req.body;
        const getDate = new Date().toDateString();
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        //RECIEVER ACCOUNT
        const getReciever = yield staffAuth_1.default.findOne({ walletNumber });
        const getRecieverWallet = yield StaffWallet_1.default.findById(getReciever === null || getReciever === void 0 ? void 0 : getReciever._id);
        // SENDER ACCOUNT
        const getUser = yield adminAuth_1.default.findById(req.params.UserId);
        const getUserWallet = yield adminWallets_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        if (getUser && getReciever) {
            if (amount > (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance)) {
                return res.status(404).json({
                    message: "insufficent fund.",
                });
            }
            else {
                // undating the sender walllet
                yield adminWallets_1.default.findByIdAndUpdate(getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet._id, {
                    balance: (getUserWallet === null || getUserWallet === void 0 ? void 0 : getUserWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getReciever === null || getReciever === void 0 ? void 0 : getReciever.yourName}`,
                    receiver: getReciever === null || getReciever === void 0 ? void 0 : getReciever.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                (_a = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getUser === null || getUser === void 0 ? void 0 : getUser.save();
                // reciever wallet
                yield StaffWallet_1.default.findByIdAndUpdate(getRecieverWallet === null || getRecieverWallet === void 0 ? void 0 : getRecieverWallet._id, {
                    balance: (getRecieverWallet === null || getRecieverWallet === void 0 ? void 0 : getRecieverWallet.balance) + amount,
                    credit: amount,
                    debit: 0,
                });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} has been sent to you by ${getUser === null || getUser === void 0 ? void 0 : getUser.companyname}`,
                    transactionType: "credit",
                    receiver: getUser === null || getUser === void 0 ? void 0 : getUser.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_b = getReciever === null || getReciever === void 0 ? void 0 : getReciever.transactionHistory) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getReciever === null || getReciever === void 0 ? void 0 : getReciever.save();
            }
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found",
            });
        }
    }
    catch (err) {
        return res.status(404).json({
            message: "an error occurred",
            err,
        });
    }
});
exports.MakeTransfer = MakeTransfer;
//admin transfer from wallet to staff wallet for staffs with a plan
const staffWithPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h;
    try {
        const { walletNumber, amount } = req.body;
        const getDate = new Date().toDateString();
        const referenceGeneratedNumber = Math.floor(Math.random() * 67485753) + 243;
        //get details of the admin sending the money
        const getAdmin = yield adminAuth_1.default.findById(req.params.adminId);
        const getAdminWallet = yield adminWallets_1.default.findById(getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin._id);
        console.log("part 1");
        ///get the details of the staff you want to pay
        const getStaff = yield staffAuth_1.default.findOne({ walletNumber });
        const getStaffWallet = yield StaffWallet_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        console.log("part 2");
        //get staff with either plans
        const getHousePlan = yield StaffHouse_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        const getTravelPlan = yield staffTravel_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        const getSchool = yield staffFees_1.default.findById(getStaff === null || getStaff === void 0 ? void 0 : getStaff._id);
        console.log("checking get details");
        if (amount > (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance)) {
            return res.status(404).json({
                message: "insufficent fund.",
            });
        }
        else if ((getHousePlan === null || getHousePlan === void 0 ? void 0 : getHousePlan.subscribe) === true) {
            if (getStaff && getAdmin) {
                yield adminWallets_1.default.findByIdAndUpdate(getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet._id, {
                    balance: (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                console.log("house plan balance");
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName}`,
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                console.log("admin history");
                (_c = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.transactionHistory) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
                const total = amount - getHousePlan.percentageRate;
                console.log("final");
                yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                    balance: Number((getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) + total),
                    credit: amount,
                    debit: 0,
                });
                console.log("staff house plan balance");
                yield StaffHouse_1.default.findByIdAndUpdate(getHousePlan === null || getHousePlan === void 0 ? void 0 : getHousePlan._id, {
                    percentageRate: getHousePlan === null || getHousePlan === void 0 ? void 0 : getHousePlan.percentageRate,
                    totalBal: getHousePlan.totalBal + (getHousePlan === null || getHousePlan === void 0 ? void 0 : getHousePlan.percentageRate),
                    subscribe: true,
                });
                console.log('house plan balance');
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} has been sent to you by ${getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyname} but the sum of ${getHousePlan === null || getHousePlan === void 0 ? void 0 : getHousePlan.percentageRate} has been deducted`,
                    transactionType: "credit",
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_d = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
            }
            console.log("testing");
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else if ((getTravelPlan === null || getTravelPlan === void 0 ? void 0 : getTravelPlan.subscribe) === true) {
            if (getStaff && getAdmin) {
                yield adminWallets_1.default.findByIdAndUpdate(getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet._id, {
                    balance: (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                console.log("testing again");
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName}`,
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                console.log('testwusagd');
                (_e = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.transactionHistory) === null || _e === void 0 ? void 0 : _e.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
                const total = amount - getTravelPlan.percentageRate;
                yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                    balance: (getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) + total,
                    credit: amount,
                    debit: 0,
                });
                console.log("another balance");
                yield staffTravel_1.default.findByIdAndUpdate(getTravelPlan === null || getTravelPlan === void 0 ? void 0 : getTravelPlan._id, {
                    percentageRate: getTravelPlan === null || getTravelPlan === void 0 ? void 0 : getTravelPlan.percentageRate,
                    totalBal: getTravelPlan.totalBal + (getTravelPlan === null || getTravelPlan === void 0 ? void 0 : getTravelPlan.percentageRate),
                    subscribe: true,
                }, { new: true });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} was sent to you by ${getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyname} but the sum of ${getTravelPlan === null || getTravelPlan === void 0 ? void 0 : getTravelPlan.percentageRate} has been deducted as part of your subscribed plans`,
                    transactionType: "credit",
                    receiver: getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                console.log("hgssfdhdfs");
                (_f = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _f === void 0 ? void 0 : _f.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
            }
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else if ((getSchool === null || getSchool === void 0 ? void 0 : getSchool.subscribe) === true) {
            if (getStaff && getAdmin) {
                yield adminWallets_1.default.findByIdAndUpdate(getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet._id, {
                    balance: (getAdminWallet === null || getAdminWallet === void 0 ? void 0 : getAdminWallet.balance) - amount,
                    credit: 0,
                    debit: amount,
                });
                console.log("gwuywrtshua");
                const createHisorySender = yield adminTransactionHistorys_1.default.create({
                    message: `you have sent ${amount} to ${getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName}`,
                    receiver: getStaff === null || getStaff === void 0 ? void 0 : getStaff.yourName,
                    transactionReference: referenceGeneratedNumber,
                    date: getDate,
                });
                console.log("fwsytarsghs");
                (_g = getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.transactionHistory) === null || _g === void 0 ? void 0 : _g.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.save();
                const total = amount - getSchool.percentageRate;
                yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                    balance: (getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) + total,
                    credit: amount,
                    debit: 0,
                });
                console.log('ytwyewerew');
                yield staffFees_1.default.findByIdAndUpdate(getSchool === null || getSchool === void 0 ? void 0 : getSchool._id, {
                    percentageRate: getSchool === null || getSchool === void 0 ? void 0 : getSchool.percentageRate,
                    totalBal: getSchool.totalBal + (getSchool === null || getSchool === void 0 ? void 0 : getSchool.percentageRate),
                    subscribe: true,
                });
                const createHisoryReciever = yield stafftransactionHistorys_1.default.create({
                    message: `an amount of ${amount} has been sent to you by ${getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.companyname} but the sum of ${getSchool === null || getSchool === void 0 ? void 0 : getSchool.percentageRate} has been deducted`,
                    transactionType: "credit",
                    receiver: getAdmin === null || getAdmin === void 0 ? void 0 : getAdmin.yourName,
                    transactionReference: referenceGeneratedNumber,
                });
                (_h = getStaff === null || getStaff === void 0 ? void 0 : getStaff.transactionHistory) === null || _h === void 0 ? void 0 : _h.push(new mongoose_1.default.Types.ObjectId(createHisoryReciever === null || createHisoryReciever === void 0 ? void 0 : createHisoryReciever._id));
                getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
            }
            return res.status(200).json({
                message: "Transaction successfull",
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found or insufficient money",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred",
            error,
        });
    }
});
exports.staffWithPlans = staffWithPlans;
//fund your wallet from your bank
const fundWalletFromBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const getUser = yield adminAuth_1.default.findById(req.params.userId);
        const getWallet = yield adminWallets_1.default.findById(req.params.walletId);
        const { amount, transactinRef } = req.body;
        yield adminWallets_1.default.findByIdAndUpdate(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id, {
            balance: (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance) + amount,
        });
        const createHisorySender = yield adminTransactionHistorys_1.default.create({
            message: `an amount of ${amount} has been credited to your wallet`,
            transactionType: "credit",
            transactionReference: transactinRef,
        });
        (_j = getUser === null || getUser === void 0 ? void 0 : getUser.transactionHistory) === null || _j === void 0 ? void 0 : _j.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
        res.status(200).json({
            message: "Wallet updated successfully",
        });
    }
    catch (err) {
        console.log("here", err);
        return res.status(404).json({
            message: "an error occurred",
            err,
        });
    }
});
exports.fundWalletFromBank = fundWalletFromBank;
const secretKey = "sk_test_rSihim6nnGwbvXXN5jbFB7fWU91MGog8ap3vGPko";
const secretKey1 = "sk_test_7DF9mBWoPnFwSabhQWELxNNcECKcsXdNjg58aqMD";
const encrypt = "nmtoaxoUniDpZ4C3z1JGmkwLhAs1jLQV";
const encrypt1 = "wfQuLFf73CSYmzBcrQQqJfKrvwyGPcoi";
const urlData = "https://api.korapay.com/merchant/api/v1/charges/card";
function encryptAES256(encryptionKey, paymentData) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", encryptionKey, iv);
    const encrypted = cipher.update(paymentData);
    const ivToHex = iv.toString("hex");
    const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString("hex");
    return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
}
const payInToWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const getRegisterAdmin = yield adminAuth_1.default.findById(req.params.id);
        if (getRegisterAdmin) {
            const data = {
                amount: `${amount}`,
                redirect_url: "https://codelab-student.web.app",
                currency: "NGN",
                reference: `${(0, uuid_1.v4)()}`,
                narration: "Fix Test Webhook",
                channels: ["card"],
                default_channel: "card",
                customer: {
                    name: `${getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.companyname}`,
                    email: `${getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.companyEmail}`,
                },
                notification_url: "https://webhook.site/8d321d8d-397f-4bab-bf4d-7e9ae3afbd50",
                metadata: {
                    key0: "test0",
                    key1: "test1",
                    key2: "test2",
                    key3: "test3",
                    key4: "test4",
                },
            };
            var config = {
                mathod: "post",
                maxBodyLength: Infinity,
                url: "https://api.korapay.com/merchant/api/v1/charges/initialize",
                headers: {
                    // "Content-Type": "application/json",
                    Authorization: `Bearer ${secretKey}`,
                },
                data: data,
            };
            yield (0, axios_1.default)(config)
                .then(function (response) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const getWallet = yield adminWallets_1.default.findById(getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin._id);
                    yield adminWallets_1.default.findByIdAndUpdate(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id, {
                        balance: (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance) + amount,
                    }, { new: true });
                    const createHisorySender = yield adminTransactionHistorys_1.default.create({
                        message: `an amount of ${amount} has been credited to your wallet`,
                        transactionType: "credit",
                        // transactionReference: "12345",
                    });
                    (_a = getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.transactionHistory) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                    return res.status(200).json({
                        message: `an amount of ${amount} has been added`,
                        data: {
                            paymentInfo: amount,
                            paymentData: JSON.parse(JSON.stringify(response.data)),
                        },
                    });
                });
            })
                .catch(function (error) {
                console.log(error);
            });
        }
        else {
            return res.status(404).json({
                message: "Account not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "an error occurred",
            err: error.message,
        });
    }
});
exports.payInToWallet = payInToWallet;
// export const checkPayment = async (req: Request, res: Response) => {
//   try {
//     const {
//       amount,
//       name,
//       number,
//       cvv,
//       pin,
//       expiry_year,
//       expiry_month,
//     } = req.body;
//     const paymentData = {
//       reference: uuid(), // must be at least 8 chara
//       card: {
//         name: "Test Cards",
//         number: "5188513618552975",
//         cvv: "123",
//         expiry_month: "09",
//         expiry_year: "30",
//         pin: "1234",
//       },
//       amount,
//       currency: "NGN",
//       redirect_url: "https://merchant-redirect-url.com",
//       customer: {
//         name: "John Doe",
//         email: "johndoe@korapay.com",
//       },
//       metadata: {
//         internalRef: "JD-12-67",
//         age: 15,
//         fixed: true,
//       },
//     };
//     const stringData = JSON.stringify(paymentData);
//     const bufData = Buffer.from(stringData, "utf-8");
//     const encryptedData = encryptAES256(encrypt, bufData);
//     const getRegisterAdmin = await adminAuth.findById(req.params.id);
//     var config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: urlData,
//       headers: {
//         Authorization: `Bearer ${secretKey}`,
//       },
//       data: {
//         charge_data: `${encryptedData}`,
//       },
//     };
//     await axios(config)
//     .then(async function (response) {
//       const getWallet = await adminWalletModel.findById(
//         getRegisterAdmin?._id
//       );
//       await adminWalletModel.findByIdAndUpdate(
//         getWallet?._id,
//         {
//           balance: getWallet?.balance! + amount,
//         },
//         { new: true }
//       );
//       const createHisorySender = await adminTransactionHistory.create({
//         message: `an amount of ${amount} has been credited to your wallet`,
//         transactionType: "credit",
//         // transactionReference: "12345",
//       });
//       getRegisterAdmin?.transactionHistory?.push(
//         new mongoose.Types.ObjectId(createHisorySender?._id)
//       );
//       return res.status(200).json({
//         message: `an amount of ${amount} has been added`,
//         data: {
//           paymentInfo: amount,
//           paymentData: JSON.parse(JSON.stringify(response.data)),
//         },
//       });
//     })
//       .catch(function (error) {
//         console.log(error);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };
const checkOutToBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, name, number, cvv, pin, expiry_year, expiry_month, title, description, bank, account } = req.body;
        //account: "0000000000",
        // bank: "033",
        const getStaffInfo = yield staffAuth_1.default.findById(req.params.staffid);
        const getStaffWallet = yield StaffWallet_1.default.findById(getStaffInfo === null || getStaffInfo === void 0 ? void 0 : getStaffInfo._id);
        var data = JSON.stringify({
            reference: (0, uuid_1.v4)(),
            destination: {
                type: "bank_account",
                amount,
                currency: "NGN",
                narration: "Test Transfer Payment",
                bank_account: {
                    bank,
                    account,
                },
                customer: {
                    name: `${getStaffInfo === null || getStaffInfo === void 0 ? void 0 : getStaffInfo.yourName}`,
                    email: `${getStaffInfo === null || getStaffInfo === void 0 ? void 0 : getStaffInfo.email}`,
                },
            },
        });
        var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://api.korapay.com/merchant/api/v1/transactions/disburse",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secretKey1}`,
            },
            data: data,
        };
        (0, axios_1.default)(config)
            .then(function (response) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status) === true) {
                    if (amount > (getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance)) {
                        return res.status(404).json({
                            message: "insufficent fund.",
                        });
                    }
                    else {
                        yield StaffWallet_1.default.findByIdAndUpdate(getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet._id, {
                            balance: Number((getStaffWallet === null || getStaffWallet === void 0 ? void 0 : getStaffWallet.balance) - amount),
                        });
                        const createHisorySender = yield stafftransactionHistorys_1.default.create({
                            message: `an amount of ${amount} has been withdrawn from your wallet`,
                            transactionType: "credit",
                            // transactionReference: "12345",
                        });
                        (_b = getStaffInfo === null || getStaffInfo === void 0 ? void 0 : getStaffInfo.transactionHistory) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                        return res.status(200).json({
                            message: `an amount of ${amount} has been added`,
                            data: {
                                paymentInfo: amount,
                                paymentData: JSON.parse(JSON.stringify(response.data)),
                            },
                        });
                    }
                }
                else {
                    return res.status(404).json({
                        message: "failed transaction",
                    });
                }
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkOutToBank = checkOutToBank;
const checkPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // name: "Test Cards",
        // number: "5188513618552975",
        // cvv: "123",
        // expiry_month: "09",
        // expiry_year: "30",
        // pin: "1234",
        const getWallet = yield adminWallets_1.default.findById(req.params.adminid);
        console.log(getWallet);
        const getRegisterAdmin = yield adminAuth_1.default.findById(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id);
        const { amount, name, number, cvv, pin, expiry_year, expiry_month } = req.body;
        const paymentData = {
            reference: (0, uuid_1.v4)(),
            card: {
                name,
                number,
                cvv,
                expiry_month,
                expiry_year,
                pin: "1234",
            },
            amount,
            currency: "NGN",
            redirect_url: "https://merchant-redirect-url.com",
            customer: {
                name: `${getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.yourName}`,
                email: `${getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.companyEmail}`,
            },
            metadata: {
                internalRef: "JD-12-67",
                age: 15,
                fixed: true,
            },
        };
        const stringData = JSON.stringify(paymentData);
        const bufData = Buffer.from(stringData, "utf-8");
        const encryptedData = encryptAES256(encrypt1, bufData);
        var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: urlData,
            headers: {
                Authorization: `Bearer ${secretKey1}`,
            },
            data: {
                charge_data: `${encryptedData}`,
            },
        };
        (0, axios_1.default)(config)
            .then(function (response) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                console.log(response);
                if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status) === true) {
                    yield adminWallets_1.default.findByIdAndUpdate(getWallet === null || getWallet === void 0 ? void 0 : getWallet._id, {
                        balance: Number(amount + (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance)),
                    });
                    const createHisorySender = yield adminTransactionHistorys_1.default.create({
                        message: `an amount of ${amount} has been credited to your wallet`,
                        transactionType: "credit",
                        // transactionReference: "12345",
                    });
                    (_b = getRegisterAdmin === null || getRegisterAdmin === void 0 ? void 0 : getRegisterAdmin.transactionHistory) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createHisorySender === null || createHisorySender === void 0 ? void 0 : createHisorySender._id));
                    return res.status(200).json({
                        message: `an amount of ${amount} has been added`,
                        data: {
                            paymentInfo: amount,
                            paymentData: JSON.parse(JSON.stringify(response.data)),
                        },
                    });
                }
                else {
                    return res.status(404).json({
                        message: "failed transaction",
                    });
                }
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkPayment = checkPayment;
