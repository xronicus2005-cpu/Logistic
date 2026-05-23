import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

//database confgi
import pool from "./config/db.js"

import authRouter from "./routes/auth.js"
import sellerRouter from "./routes/seller.js"
import customerRouter from "./routes/customer.js"
import driverRouter from "./routes/driver.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.MAIN_INTERFACE,
    credentials: true
}))
app.use(cookieParser())

app.use("/api", authRouter)
app.use("/api", sellerRouter)
app.use("/api", customerRouter)
app.use("/api", driverRouter)

const runServer = async () => {
    try{
        const clien = await pool.connect()
        console.log("DATABASE CONNECTED SUCCESFULLY!")

        const res = await clien.query("SELECT NOW()")
        console.log("DB TIME", res.rows[0])

        clien.release()

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT} port`)
        })
    }
    catch(err){
        console.log("Error When Running Server!", err)
    }
}

runServer()