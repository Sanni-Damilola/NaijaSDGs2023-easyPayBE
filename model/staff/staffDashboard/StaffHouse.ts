import mongoose from "mongoose"

import { plans } from "./staffModel"

interface housePlan extends plans , mongoose.Document{}

const houseSchema = new mongoose.Schema<plans>({
percentageRate :{
    type : Number,
},
totalBal : {
    type : Number,
},
subscribe : {
    type : Boolean,
    default : false
  },
} , {timestamps:true})

const houseModel = mongoose.model<housePlan>("staffHousePlan", houseSchema)

export default houseModel