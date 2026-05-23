import pool from "../config/db.js"

const initTable = async () => {

    try{
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT,
                last_name TEXT,
                email_address TEXT UNIQUE NOT NULL,
                password TEXT,
                phone TEXT,
                role VARCHAR(50),
                region TEXT
            )`
        )

        console.log("users table created!")
    }
    catch(err){
        console.log("Error when creating users table", err)
    }
}

initTable()