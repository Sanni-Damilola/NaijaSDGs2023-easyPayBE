import mongoose from "mongoose";
import { adminWalletProps } from "./adminModel";

interface Admin extends adminWalletProps, mongoose.Document {}

const adminWalletSchema = new mongoose.Schema<adminWalletProps>({
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

const adminWalletModel = mongoose.model<Admin>(
  "adminWallet",
  adminWalletSchema
);

export default adminWalletModel;
