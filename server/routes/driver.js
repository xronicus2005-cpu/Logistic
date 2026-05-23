import express from "express"
import {checkToken} from "../middleware/tokenChecker.js"
import {giveOrders, acceptDelivery, complete} from "../controller/driverController.js"


const router = express.Router()

router.get("/get-delivery", checkToken, giveOrders)
router.post("/accept-delivery", checkToken, acceptDelivery)
router.post("/complete-delivery", checkToken, complete)

export default router