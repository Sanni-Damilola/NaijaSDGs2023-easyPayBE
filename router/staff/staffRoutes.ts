import { Router } from "express";
import { HousePlan,FeesPlan,travelPlan } from "../../controller/staff/staffDashboard/createPlans";


const staffRoutes = Router()

staffRoutes.post("/houseplan/:staffId" , HousePlan)
staffRoutes.post("/travel/:staffId" , travelPlan)
staffRoutes.post("/schoolplan/:staffId" , FeesPlan)

export default staffRoutes