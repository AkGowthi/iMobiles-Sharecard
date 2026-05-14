
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fixCols() {
    console.log("--- Fixing Column Names ---");
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

    const connection = await mysql.createConnection({
        host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });

    try {
        console.log("1. Fixing Users table (camelCase -> snake_case)...");

        // Check if columns exist before renaming
        const [cols] = await connection.query("DESCRIBE Users;");
        const colNames = cols.map(c => c.Field);

        if (colNames.includes('emailVerified') && !colNames.includes('email_verified')) {
            console.log("   Renaming emailVerified -> email_verified");
            await connection.query("ALTER TABLE Users CHANGE emailVerified email_verified datetime;");
        } else {
            console.log("   email_verified already set or source missing.");
        }

        if (colNames.includes('isBanned') && !colNames.includes('is_banned')) {
            console.log("   Renaming isBanned -> is_banned");
            await connection.query("ALTER TABLE Users CHANGE isBanned is_banned tinyint(1);");
        } else {
            console.log("   is_banned already set or source missing.");
        }

        console.log("✅ Done.");

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await connection.end();
    }
}
fixCols();
