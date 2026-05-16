
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function resetData() {
    console.log("--- Resetting Auth Data ---");
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

    const connection = await mysql.createConnection({
        host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });

    try {
        // Disable FK checks to allow truncation
        await connection.query("SET FOREIGN_KEY_CHECKS = 0;");

        const tables = ['Users', 'Accounts', 'Sessions', 'VerificationTokens', 'UserProfiles', 'SavedContacts'];

        for (const t of tables) {
            console.log(`   Deleting data from ${t}...`);
            await connection.query(`TRUNCATE TABLE \`${t}\`;`);
        }

        await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
        console.log("✅ Auth data reset complete.");

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await connection.end();
    }
}
resetData();
