import {Router} from "express"
import { checkOutToBank, checkPayment, fundWalletFromBank, MakeTransfer, staffWithPlans } from "../../controller/admin/admindashboard/adminWalletLogics"

const AdminRoutes = Router()

AdminRoutes.post("/paysalary/:UserId", MakeTransfer)
AdminRoutes.post("/paysalarywithhouseplan/:adminId", staffWithPlans)
AdminRoutes.post("/fundwallet/:userId/:walletId",fundWalletFromBank )
AdminRoutes.route("/pay/:adminid").patch(checkPayment);
AdminRoutes.route("/pay-out/:staffid").post(checkOutToBank);

export default AdminRoutes
