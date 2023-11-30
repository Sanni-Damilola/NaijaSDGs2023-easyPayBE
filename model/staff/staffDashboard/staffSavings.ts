import mongoose from "mongoose"

import { plans } from "./staffModel"

interface savingsPlan extends plans , mongoose.Document{}

const savingsSchema = new mongoose.Schema<plans>({
percentageRate :{
    type : Number,
},
totalBal : {
    type : Number,
}
})

const savingsModel = mongoose.model<savingsPlan>("staffSavingsPlan", savingsSchema)

export default savingsModel