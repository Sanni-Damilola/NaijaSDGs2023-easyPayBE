import staffAuth from "../../../model/staff/staffAuth";
import houseModel from "../../../model/staff/staffDashboard/StaffHouse";
import feesModel from "../../../model/staff/staffDashboard/staffFees";
import investModel from "../../../model/staff/staffDashboard/staffInvestment";
import mongoose from "mongoose";
import { Request, Response } from "express";
import travelModel from "../../../model/staff/staffDashboard/staffTravel";

//create house plan

export const HousePlan = async (req: Request, res: Response) => {
  try {
    const { percentageRate, totalBal, subscribe } = req.body;
    const getStaff = await staffAuth.findById(req.params.staffId);
    // const getStaff =
    const createHousePlan = await houseModel.create({
      percentageRate,
      totalBal :0.00,
      subscribe,
      _id:getStaff?._id
    });
    await getStaff?.houseRentPlan?.push(
      new mongoose.Types.ObjectId(createHousePlan?._id)
    );
    getStaff?.save();

    return res.status(201).json({
      message: "created house plan",
      data: createHousePlan,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occured",
      data: error.message,
      err: error,
    });
  }
};
export const FeesPlan = async (req: Request, res: Response) => {
  try {
    const { percentageRate, totalBal, subscribe } = req.body;
    const getStaff = await staffAuth.findById(req.params.staffId);
  
    const createFeesPlan = await feesModel.create({
      percentageRate,
      totalBal :0.00,
      subscribe,
      _id:getStaff?._id
    });
    

    await getStaff?.schoolFeesPlan?.push(
      new mongoose.Types.ObjectId(createFeesPlan?._id)
    );
    getStaff?.save();
    return res.status(201).json({
      message: "created fees plan",
      data: createFeesPlan,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occured",
      data: error.message,
      err: error,
    });
  }
};
export const travelPlan = async (req: Request, res: Response) => {
  try {
    const { percentageRate, totalBal, subscribe } = req.body;
    const getStaff = await staffAuth.findById(req.params.staffId);
    if (subscribe === true ) {
      // const getStaff =
      const createTravelPlan = await travelModel.create({
        percentageRate,
        totalBal :0.00,
        subscribe,
        _id:getStaff?._id
      });

     

      await getStaff?.travelAndTour?.push(
        new mongoose.Types.ObjectId(createTravelPlan?._id)
      );
      getStaff?.save();

      return res.status(201).json({
        message: "created travel plan",
        data: createTravelPlan,
      });
    }else {
      return res.status(404).json({
        message: "cant create plan because you are not subscribed",
      });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occured",
      data: error.message,
      err: error,
    });
  }
};
