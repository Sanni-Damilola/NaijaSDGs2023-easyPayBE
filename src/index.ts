import express, { Application, Request, Response } from "express";
import cors from "cors";
import dbConfig from "../config/db";
import adminAuthRoutes from "../router/admin/adminAuth";
import staffAuthRoutes from "../router/staff/staffAuthRoutes";
import AdminRoutes from "../router/admin/adminRoutes";
import staffRoutes from "../router/staff/staffRoutes";

const PORT = process.env.PORT || 2023;

const app: Application = express();
dbConfig();
app.use(express.json());
app.use(cors());

//default get
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "api is available for consumption testing ",
  });
});

//routes

//admin authentication routes
app.use("/admin", adminAuthRoutes);

//staff authentication routes
app.use("/staff", staffAuthRoutes);

//admin dashboard routes
app.use("/pay" ,AdminRoutes)

//staff dashboard routes
app.use("/plans" , staffRoutes)

app.listen(PORT, () => {
  console.log(`server is up on port ${PORT}`);
});
