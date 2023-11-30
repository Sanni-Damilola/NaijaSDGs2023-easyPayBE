import mongoose from "mongoose"

import { plans } from "./staffModel"

interface travelPlan extends plans , mongoose.Document{}

const travelSchema = new mongoose.Schema<plans>({
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
})

const travelModel = mongoose.model<travelPlan>("staffTravelAndTour", travelSchema)

export default travelModel