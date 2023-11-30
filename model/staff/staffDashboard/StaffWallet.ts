import mongoose from "mongoose";
import { staffWalletProps } from "./staffModel";

interface staff extends staffWalletProps, mongoose.Document {}

const staffWalletSchema = new mongoose.Schema<staffWalletProps>({
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

const staffWalletModel = mongoose.model<staff>(
  "staffWallet",
  staffWalletSchema
);

export default staffWalletModel;
