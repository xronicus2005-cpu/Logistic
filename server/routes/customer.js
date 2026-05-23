import express from "express"
import {checkToken} from "../middleware/tokenChecker.js"
import { giveAvailabe, order, giveOrders } from "../controller/customerController.js"

const router = express.Router()

router.get("/get-availabe", checkToken, giveAvailabe)
router.post("/order", checkToken, order)
router.get("/my-orders", checkToken, giveOrders)

export default router