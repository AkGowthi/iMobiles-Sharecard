
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkConfig() {
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    const connection = await mysql.createConnection({
        host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });

    console.log("--- MySQL Config Check ---");
    const [rows] = await connection.query("SHOW VARIABLES LIKE 'max_allowed_packet';");
    const bytes = parseInt(rows[0].Value);
    const mb = bytes / (1024 * 1024);
    console.log(`max_allowed_packet: ${bytes} bytes (${mb.toFixed(2)} MB)`);

    await connection.end();
}
checkConfig();
