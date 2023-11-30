import mongoose from "mongoose";

import { staffSignUp } from "../allinterfaces";

interface SAuth extends staffSignUp, mongoose.Document {}

const StaffAuth = new mongoose.Schema<staffSignUp>(
  {
    companyCode : {
      type : String,
   
    },
    yourName: {
      type: String,
      required: [true, "please enter your name"],
    },
    plans: {
      type : Boolean
    },
    amount: {
type:Number
    },
  
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    companyname: {
      type: String,
    },
    position: {
      type: String,
    },
    walletNumber: {
      type :Number,
    },
    wallet: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffWallet",
      },
    ],
    transactionHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffTransactionHistory",
      },
    ],
    savingsPlan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffSavingsPlan",
      },
    ],
    houseRentPlan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffHousePlan",
      },
    ],
    schoolFeesPlan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffSchoolFeesPlan",
      },
    ],
    
    investmentPlan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffInvestmentPlan",
      },
    ],
    travelAndTour: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffTravelAndTour",
      },
    ],
    other: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffOther",
      },
    ],
  },
  { timestamps: true }
);

const staffAuth = mongoose.model<SAuth>("staffAuth", StaffAuth);

export default staffAuth;
