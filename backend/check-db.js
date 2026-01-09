require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDb() {
    console.log('Checking database connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'redes_db'
        });

        console.log('Successfully connected to database!');

        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in database:');
        console.log(rows);

        if (rows.length > 0) {
            console.log('\nChecking "usuarios" table structure:');
            try {
                const [columns] = await connection.query('DESCRIBE usuarios');
                console.log(columns);
            } catch (err) {
                console.error('Error describing "usuarios" table (maybe it does not exist):', err.message);
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

checkDb();
