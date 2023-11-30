import mongoose from "mongoose";

export interface adminSignUp extends mongoose.Document {
  viewUser: mongoose.Types.Array<mongoose.Types.ObjectId>;
   // companyName: string;
   companyname: string;
   companyEmail: string;
   yourName: string;
   password: string;
   wallet: {}[];
   transactionHistory: {}[];
   
   walletNumber: number;
   companyCode: string
  // ... other fields ...
}

export interface staffSignUp {
  yourName: string;
  email: string;
  password: string;
  plans:boolean;
  amount:Number;
  // companyName: string;
  companyname: string;
  position: string;
  walletNumber: number;
  subscribe :boolean,
  companyCode: string
  wallet: {}[];
  transactionHistory: {}[];
  savingsPlan: {}[];
  houseRentPlan: {}[];
  schoolFeesPlan: {}[];
  investmentPlan: {}[];
  travelAndTour: {}[];
  other: {}[];
}
