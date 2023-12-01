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
exports.travelPlan = exports.FeesPlan = exports.HousePlan = void 0;
const staffAuth_1 = __importDefault(require("../../../model/staff/staffAuth"));
const StaffHouse_1 = __importDefault(require("../../../model/staff/staffDashboard/StaffHouse"));
const staffFees_1 = __importDefault(require("../../../model/staff/staffDashboard/staffFees"));
const mongoose_1 = __importDefault(require("mongoose"));
const staffTravel_1 = __importDefault(require("../../../model/staff/staffDashboard/staffTravel"));
//create house plan
const HousePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { percentageRate, totalBal, subscribe } = req.body;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        // const getStaff =
        const createHousePlan = yield StaffHouse_1.default.create({
            percentageRate,
            totalBal: 0.00,
            subscribe,
            _id: getStaff === null || getStaff === void 0 ? void 0 : getStaff._id
        });
        yield ((_a = getStaff === null || getStaff === void 0 ? void 0 : getStaff.houseRentPlan) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(createHousePlan === null || createHousePlan === void 0 ? void 0 : createHousePlan._id)));
        getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
        return res.status(201).json({
            message: "created house plan",
            data: createHousePlan,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occured",
            data: error.message,
            err: error,
        });
    }
});
exports.HousePlan = HousePlan;
const FeesPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { percentageRate, totalBal, subscribe } = req.body;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        const createFeesPlan = yield staffFees_1.default.create({
            percentageRate,
            totalBal: 0.00,
            subscribe,
            _id: getStaff === null || getStaff === void 0 ? void 0 : getStaff._id
        });
        yield ((_b = getStaff === null || getStaff === void 0 ? void 0 : getStaff.schoolFeesPlan) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(createFeesPlan === null || createFeesPlan === void 0 ? void 0 : createFeesPlan._id)));
        getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
        return res.status(201).json({
            message: "created fees plan",
            data: createFeesPlan,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occured",
            data: error.message,
            err: error,
        });
    }
});
exports.FeesPlan = FeesPlan;
const travelPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { percentageRate, totalBal, subscribe } = req.body;
        const getStaff = yield staffAuth_1.default.findById(req.params.staffId);
        if (subscribe === true) {
            // const getStaff =
            const createTravelPlan = yield staffTravel_1.default.create({
                percentageRate,
                totalBal: 0.00,
                subscribe,
                _id: getStaff === null || getStaff === void 0 ? void 0 : getStaff._id
            });
            yield ((_c = getStaff === null || getStaff === void 0 ? void 0 : getStaff.travelAndTour) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(createTravelPlan === null || createTravelPlan === void 0 ? void 0 : createTravelPlan._id)));
            getStaff === null || getStaff === void 0 ? void 0 : getStaff.save();
            return res.status(201).json({
                message: "created travel plan",
                data: createTravelPlan,
            });
        }
        else {
            return res.status(404).json({
                message: "cant create plan because you are not subscribed",
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "an error occured",
            data: error.message,
            err: error,
        });
    }
});
exports.travelPlan = travelPlan;
