
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixConfig() {
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    const connection = await mysql.createConnection({
        host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });

    try {
        console.log("--- Fixing MySQL Config ---");
        console.log("Current max_allowed_packet: 1 MB");
        console.log("Attempting to set to 64 MB...");

        await connection.query("SET GLOBAL max_allowed_packet = 67108864;");

        console.log("✅ Command sent. Verifying...");

        // Need a new connection to see GLOBAL change effect usually, 
        // or just check the global variable explicitly
        const [rows] = await connection.query("SHOW VARIABLES LIKE 'max_allowed_packet';");
        // SHOW VARIABLES usually shows SESSION value, which inherits from GLOBAL at connect.
        // So we might need to reconnect to see it, or check GLOBAL specifically.

        const [globalRows] = await connection.query("SHOW GLOBAL VARIABLES LIKE 'max_allowed_packet';");
        const bytes = parseInt(globalRows[0].Value);
        const mb = bytes / (1024 * 1024);
        console.log(`New GLOBAL max_allowed_packet: ${mb.toFixed(2)} MB`);

    } catch (e) {
        console.error("❌ Failed to set max_allowed_packet:", e.message);
    } finally {
        await connection.end();
    }
}
fixConfig();
