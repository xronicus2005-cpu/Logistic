import pool from "../config/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try{

        const { formData } = req.body
        const {firstName, lastName, email, password, phone, role, region} = formData

        if(!firstName || !lastName || !email || !password || !phone || !role || !region){
            return res.status(400).json({message: "Missing Property!"})
        }

        const hash_pass = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (name, last_name, email_address, password, phone, role, region)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
            `, [firstName, lastName, email, hash_pass, phone, role, region]
        )

        const userId = result.rows[0].id

        const token = jwt.sign({id: userId, role: role}, process.env.MY_SECRET, {expiresIn: "30d"})

        res.cookie("accessToken", token, {
            maxAge: 30 * 60 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true
        })

        return res.status(201).json({
            success: true
        })

    }
    catch(err){
        console.log("error when registering new user", err)
        return res.status(500).json("Internal Server Error")
    }
}


export const login = async (req, res) => {
    try{
        const { formData } = req.body

        const { email, password } = formData

        if(!email || !password){
            return res.status(400).json({message: "Missing Property"})
        }

        const result = await pool.query(
            `SELECT password, id, role FROM users WHERE email_address = $1`, [email]
        )

        const hash_pass = result.rows[0].password

        if(result.rows.length === 0){
            return res.status(404).json({message: "User not found!"})
        }

        const isValid = await bcrypt.compare(password, hash_pass)

        if(!isValid){
            return res.status(401).json({message: "Password is wrong"})
        }

        const token = jwt.sign({id: result.rows[0].id, role: result.rows[0].role}, process.env.MY_SECRET, {expiresIn: "30d"})
    
        res.cookie("accessToken", token, {
            maxAge: 30 * 60 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true
        })

        return res.status(201).json({
            success: true
        })
    }   
    catch(err){
        console.log("error when logging in", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const giveMe = async (req, res) => {
    try{
        const userId = req.user.id

        if(!userId){
            return res.status(400).json({message: "Missing Property"})
        }

        const result = await pool.query(
            `SELECT id, name, last_name, phone, region, email_address, role FROM users WHERE id = $1`, [userId]
        )

        if(result.rows.length === 0){
            return res.status(404).json({message: "User not found!"})
        }

        const user = result.rows[0]

        return res.status(200).json({
            success: true,
            user: user
        })
    }
    catch(err){
        console.log("Error when giving user info", err)
        return res.status(500).json({message: "Internal Server Error"})
    }
}
