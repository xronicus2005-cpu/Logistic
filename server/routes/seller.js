import express from "express"
import {checkToken} from "../middleware/tokenChecker.js"
import {addProduct, giveAllPruducts, getOrders, changeStatus} from "../controller/sellerController.js"
const router = express.Router()


router.post("/create-product", checkToken, addProduct)
router.get("/get-pruducts", checkToken, giveAllPruducts)
router.get("/get-orders", checkToken, getOrders)
router.post("/change-status", checkToken, changeStatus)

export default router