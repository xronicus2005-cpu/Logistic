import pool from "../config/db.js";

export const giveOrders = async(req, res) => {
    try{
        const role = req.user.role

        if(role !== "Kurer"){
            return res.status(400).json({message: "Wrong Person!"})
        }

        const result = await pool.query(
            `SELECT * FROM orders`
        )

        return res.status(200).json({
            success: true,
            orders: result.rows
        })
    }
    catch(err){
        console.log("Error when giving oreders to driver", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const acceptDelivery = async (req, res) =>{
    try{
        const role = req.user.role
        const userId = req.user.id
        const {orderId, driverName} = req.body

        if(role !== "Kurer" || !orderId || !driverName){
            return res.status(400).json({message: "Missing Property!"})
        }

        const result = await pool.query(
            `UPDATE orders SET progress = '50', driver = $1, driver_id = $2 WHERE id = $3`, [driverName, userId ,orderId]
        )

        return res.status(201).json({
            success: true
        })
        
    }
    catch(err){
        console.log("erroro when accepting delivery", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const complete = async (req, res) => {
    try{
        const role = req.user.role
        const { orderId } = req.body

        if(role !== "Kurer" || !orderId){
            return res.status(400).json({message: "Missing property"})
        }

        const result = await pool.query(
            `UPDATE orders SET progress = 100, status = 'completed' WHERE id = $1`, [orderId]
        )

        return res.status(201).json({
            success: true
        })

    }
    catch(err){
        console.log("error when compliting delivery", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}