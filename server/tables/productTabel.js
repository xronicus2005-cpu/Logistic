import pool from "../config/db.js"


async function pruduct() {
    try{
        await pool.query(
            `CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                seller_id TEXT,
                name TEXT NOT NULL,
                cost TEXT NOT NULL,
                amount TEXT NOT NULL,
                category TEXT NOT NULL,
                title TEXT NOT NULL
            )`
        )

        console.log("pruducts table created!")
    }
    catch(err){
        console.log("Error when creting pruduct table", err)
    }
}

pruduct()