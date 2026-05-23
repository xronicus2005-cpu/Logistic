import pool from "../config/db.js"

export const addProduct = async (req, res) =>{
    try{
        const sellerId = req.user.id
        const role = req.user.role

        const { productData } = req.body

        const {name, price, category, quantity, description} = productData
        
        if(!sellerId || !name || !price || !category || !quantity || !description){
            return res.status(400).json({message: "Missing Property"})

        }

        if(role !== "Sotuvchi"){
            return res.status(401).json({message: "You can not add a pruduct!"})
        }

        const result = await pool.query(
            `INSERT INTO products (seller_id, name, cost, amount, category, title)
             VALUES ($1, $2, $3, $4, $5, $6)
            `, [sellerId, name, price, quantity, category, description]
        )

        return res.status(201).json({
            success: true
        })
    
    }
    catch(err){
        console.log("Error when creating new pruduct", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const giveAllPruducts = async (req, res) => {
    try{
        const role = req.user.role

        if(role !== "Sotuvchi"){
            return res.status(400).json({message: "Wrong Person"})
        }

        const result = await pool.query(
            `SELECT id, name, cost, amount, category, title FROM products `
        )

        return res.status(200).json({
            success: true,
            product: result.rows
        })
    
    }
    catch(err){
        console.log("Error when giving pruducts", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getOrders = async(req, res) =>{
    try{
        const role = req.user.role
        const seller_id = req.user.id

        if(role !== "Sotuvchi" || !seller_id){
            return res.status(400).json({message: "Missing properties!"})
        }

        const result = await pool.query(
            `SELECT * FROM orders WHERE seller_id = $1`, [seller_id]
        )

        return res.status(200).json({
            success: true,
            orders: result.rows
        })
    }
    catch(err){
        console.log("Error when giving orders", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const changeStatus = async(req, res) => {
    try{
        const role = req.user.role
        const {id} = req.body
        
        if(!id || role !== "Sotuvchi"){
            return res.status(400).json({message: "Missing Property!"})
        }

        const result = await pool.query(
            `UPDATE orders SET status = 'onRoad' WHERE id = $1`, [id]
        )

        return res.status(201).json({success: true})
    
    }
    catch(err){
        console.log("Error when changing status", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}