import mongoose from "mongoose"

import { plans } from "./staffModel"

interface otherPlan extends plans , mongoose.Document{}

const otherSchema = new mongoose.Schema<plans>({
percentageRate :{
    type : Number,
},
totalBal : {
    type : Number,
}
})

const otherModel = mongoose.model<otherPlan>("staffOther", otherSchema)

export default otherModel