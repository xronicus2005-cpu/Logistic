import pool from "../config/db.js";

async function orders() {
    try{
        await pool.query(
            `CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                customer_id TEXT NOT NULL,
                seller_id TEXT NOT NULL,
                product TEXT NOT NULL,
                amount TEXT NOT NULL,
                price TEXT NOT NULL,
                payment TEXT NOT NULL,
                lat TEXT NOT NULL,
                lng TEXT NOT NULL,
                city TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                driver TEXT,
                driver_id INTEGER, 
                progress TEXT DEFAULT '0',
                created_at TIMESTAMP DEFAULT NOW()
            )`
        )

        console.log("orders table has been created!")
    }
    catch(err){
        console.log("Error when creating orders table", err)
    }
}

orders()