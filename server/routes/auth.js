import express from "express"
import { register, giveMe, login } from "../controller/authController.js"
import { checkToken } from "../middleware/tokenChecker.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", checkToken, giveMe)


export default router