import { Router } from "express";
import {
  adminSignin,
  adminSignup,
  getAllAdmin,
  getOneAdmin,
} from "../../controller/admin/adminAuthController";

const adminAuthRoutes = Router();

adminAuthRoutes.post("/login", adminSignin);
adminAuthRoutes.post("/register", adminSignup);
adminAuthRoutes.get("/", getAllAdmin);
adminAuthRoutes.get("/:adminId", getOneAdmin);
export default adminAuthRoutes;
