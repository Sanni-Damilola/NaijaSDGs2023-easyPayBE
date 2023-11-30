import staffAuth from "../../model/staff/staffAuth";
import staffWalletModel from "../../model/staff/staffDashboard/StaffWallet";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import feesModel from "../../model/staff/staffDashboard/staffFees";
import houseModel from "../../model/staff/staffDashboard/StaffHouse";
import investModel from "../../model/staff/staffDashboard/staffInvestment";
import adminAuth from "../../model/admin/adminAuth";
import otpgenerator from "otp-generator";

export const staffSignup = async (req: Request, res: Response) => {
  try {
    const { companyname, email, yourName, password, position, walletNumber } =
      req.body;

    const getAdmin = await adminAuth.findOne({ companyname });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const dater = Date.now();

    const generateNumber = Math.floor(Math.random() * 78) + dater;

    const genCode = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });

    const staff = await staffAuth.create({
      companyCode: getAdmin?.companyCode,
      companyname,
      email,
      yourName,
      password: hash,
      position,
      walletNumber: generateNumber,
      amount: 0,
    });

    if (getAdmin?.companyname === staff?.companyname) {
      getAdmin.viewUser.push(new mongoose.Types.ObjectId(staff?._id));
      getAdmin.save();

      const createWallet = await staffWalletModel.create({
        _id: staff?._id,
        balance: 15000,
        credit: 0,
        debit: 0,
      });

      staff?.wallet.push(new mongoose.Types.ObjectId(createWallet?._id));

      staff.save();

      return res.status(200).json({
        status: 200,
        message: "Staff created successfully",
        data: staff,
      });
    } else {
      return res.status(400).json({
        message: "unable to create staff under this company name",
      });
    }

    const house = await houseModel.create({});

    const fees = await feesModel.create({});

    const invest = await investModel.create({});
  } catch (error: any) {
    console.log("error", error);

    return res.status(400).json({
      message: "an error occurred while creating staff",
      data: error.message,
    });
  }
};

export const staffSignin = async (req: Request, res: Response) => {
  try {
    const { companyname, email, password } = req.body;

    const staff = await staffAuth.findOne({ email });

    if (staff?.companyname! !== companyname) {
      return;
    } else {
      const check = await bcrypt.compare(password, staff?.password!);

      if (check) {
        res.status(201).json({
          message: "welcome",
          data: staff,
        });
      } else {
        console.log("bad");
        return res.status(400).json({
          message: "login failed",
        });
      }
    }

    return res.status(200).json({
      message: "Success , staff is logged in",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "an error occurred while logging in staff",
      data: error.message,
    });
  }
};

//get all admins
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.find();

    return res.status(200).json({
      message: "get all staff",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get staff",
      data: error,
      err: error.message,
    });
  }
};

export const getOneStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffAuth.findById(req.params.staffId).populate([
      {
        path: "wallet",
      },
      {
        path: "transactionHistory",
      },
      {
        path: "houseRentPlan",
      },
      {
        path: "schoolFeesPlan",
      },
      {
        path: "travelAndTour",
      },
    ]);

    return res.status(200).json({
      message: "gotten one staff",
      data: staff,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to get staff",
      data: error,
      err: error.message,
    });
  }
};

//update staff details


export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const getAdmin = await adminAuth.findById(req.params.adminId)

    const getStaffDetails = await staffAuth.findById(req.params.staffId);

    const update = await staffAuth.findByIdAndUpdate(
      getStaffDetails?._id,
      { amount: getStaffDetails?.amount + amount },
      { new: true }
    );

    getAdmin?.viewUser.push(new mongoose.Types.ObjectId(update?._id))
       getAdmin?.save();


    return res.status(201).json({
      message : "updated staff amount successfully",
      data : update
    })
  } catch (error:any) {
    return res.status(400).json({
      message: "couldn't update staff",
      data : error,
      error : error.message
    });
  }
};


//deactivate a staff
export const deactivateStaff = async(req:Request , res:Response)=>{
  try {
    const getStaff = await staffAuth.findById(req.params.staffId)

    const getAdmin = await adminAuth.findById(req.params.adminId)

    await getAdmin?.viewUser.pull(new mongoose.Types.ObjectId(getStaff!._id));
    await getAdmin?.save()

    return res.status(200).json({
      message : "deactivated Staff successfully",
      data : getStaff
    })
  } catch (error:any) {
    return res.status(400).json({
      message: "couldn't deactivate staff",
      data : error,
      error : error.message
    });
  }
}

/**const staffMonthlySalary = [
  {
    name: "Peter",
    salary: 500,
  },
  {
    name: "Okus",
    salary: 1500,
  },
  {
    name: "Vicy",
    salary: 2500,
  },
];

const staff = [
  {
    name: "Peter",
    salary: 5,
  },
  {
    name: "Okus",
    salary: 15,
  },
  {
    name: "Vicy",
    salary: 25,
  },
];


const dataPay = monthlySalary.map((el) => {
  return staff.map((props) => {
    return props.name === el.name
      ? (props.salary = props.salary + el.salary)
      : null;
  });
});

console.log(dataPay.flat().filter((el) => el !== null));
console.log(staff); */