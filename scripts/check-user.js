
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkUsers() {
    console.log("--- Checking Users & Accounts ---");
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

    const connection = await mysql.createConnection({
        host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });

    try {
        const [users] = await connection.query("SELECT * FROM Users");
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}, Ver: ${u.email_verified}`));

        const [accounts] = await connection.query("SELECT * FROM Accounts");
        console.log(`Found ${accounts.length} accounts:`);
        accounts.forEach(a => console.log(`- UserID: ${a.userId}, Provider: ${a.provider}, Type: ${a.type}`));

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await connection.end();
    }
}
checkUsers();
