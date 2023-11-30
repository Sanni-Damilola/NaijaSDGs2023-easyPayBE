import mongoose from "mongoose"

import { plans } from "./staffModel"

interface investPlan extends plans , mongoose.Document{}

const investSchema = new mongoose.Schema<plans>({
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

const investModel = mongoose.model<investPlan>("staffInvestmentPlan", investSchema)

export default investModel