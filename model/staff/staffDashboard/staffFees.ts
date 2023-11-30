import mongoose from "mongoose"

import { plans } from "./staffModel"

interface feesPlan extends plans , mongoose.Document{}

const feesSchema = new mongoose.Schema<plans>({
percentageRate :{
    type : Number,
},
totalBal : {
    type : Number,
},
subscribe : {
    type : Boolean,
  },
})

const feesModel = mongoose.model<feesPlan>("staffSchoolFeesPlan", feesSchema)

export default feesModel