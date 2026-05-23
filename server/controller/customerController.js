import pool from "../config/db.js"

export const giveAvailabe = async (req, res) =>{
    try{
        const role = req.user.role

        if(role !== "Xaridor"){
            return res.status(400).json({message: "Wrong Person"})
        }

        const result = await pool.query(
            `SELECT * FROM products`
        )

        return res.status(200).json({
            success: true,
            product: result.rows
        })
    }
    catch(err){
        console.log("Error when giving available pruducts", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const order = async(req, res) => {
    try{
        const customer_id = req.user.id
        const role = req.user.role


        if(!customer_id || role !== "Xaridor"){
            return res.status(400).json({message: "Missing property"})
        }

        const {product, amount, payment, location, seller_id, price} = req.body
        const {lat, lng, city} = location

        if(!product || !amount || !payment || !location || !seller_id || !price){
            return res.status(401).json({message: "Missing property"})
        }

        const result = await pool.query(
            `INSERT INTO orders (customer_id, seller_id, product, amount, payment, lat, lng, city, price)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [customer_id, seller_id, product, amount, payment, lat, lng, city, price]
        )

        return res.status(201).json({
            success: true
        })


    }
    catch(err){
        console.log("Error when ordering new product", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const giveOrders = async (req, res) => {
    try{
        const role = req.user.role
        const customer_id = req.user.id

        if(role !== "Xaridor"){
            return res.status(400).json({message: "Wrong Person"})
        }

        const result = await pool.query(
            `SELECT * FROM orders WHERE customer_id = $1`, [customer_id]
        )

        return res.status(200).json({
            success: true,
            orders: result.rows
        })
    }
    catch(err){
        console.log("Error when giving oreders info", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}