
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function fix() {
    console.log("--- Fixing Database Schema ---");
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD || '',
            database: DB_NAME,
            port: DB_PORT || 3306
        });
        console.log("   ✅ Connected to database.");

        const [tables] = await connection.query("SHOW TABLES;");
        const tableNames = tables.map(r => Object.values(r)[0]);
        console.log("   Existing tables:", tableNames.join(", "));

        // 1. Rename Tables
        const renames = [
            { oldT: 'accounts', newT: 'Accounts' },
            { oldT: 'sessions', newT: 'Sessions' },
            { oldT: 'verification_tokens', newT: 'VerificationTokens' }
        ];

        for (const { oldT, newT } of renames) {
            try {
                // Determine if we need to act
                // Note: tableNames might contain 'accounts' OR 'Accounts' depending on how MySQL reports it
                // We normalize for checking existence
                const existsOld = tableNames.find(t => t.toLowerCase() === oldT.toLowerCase());
                const existsNew = tableNames.find(t => t === newT); // Exact match check

                if (existsOld) {
                    if (existsOld === newT) {
                        console.log(`      ℹ️ ${newT} already correctly named.`);
                        continue;
                    }

                    // It exists but name is different (e.g. accounts vs Accounts)
                    if (existsOld.toLowerCase() === newT.toLowerCase()) {
                        console.log(`   🔄 Renaming ${existsOld} to ${newT} (Case fix)...`);
                        await connection.query(`RENAME TABLE \`${existsOld}\` TO \`${existsOld}_temp\`;`);
                        await connection.query(`RENAME TABLE \`${existsOld}_temp\` TO \`${newT}\`;`);
                        console.log(`      ✅ Renamed via temp.`);
                    } else {
                        // Different names (snake to camel)
                        console.log(`   🔄 Renaming ${existsOld} to ${newT}...`);
                        await connection.query(`RENAME TABLE \`${existsOld}\` TO \`${newT}\`;`);
                        console.log(`      ✅ Renamed.`);
                    }
                } else {
                    console.log(`      ⚠️ ${oldT} not found.`);
                }
            } catch (err) {
                console.error(`      ❌ Failed to rename to ${newT}:`, err.message);
            }
        }

        // 2. Fix UserProfiles Columns
        if (tableNames.includes('UserProfiles')) {
            console.log("   🛠 Checking UserProfiles columns...");
            const [columns] = await connection.query("DESCRIBE UserProfiles;");
            const colNames = columns.map(c => c.Field);

            if (!colNames.includes('contact_suffix_prefix')) {
                console.log("      ➕ Adding contact_suffix_prefix...");
                await connection.query("ALTER TABLE `UserProfiles` ADD COLUMN `contact_suffix_prefix` VARCHAR(255) DEFAULT 'C';");
            }
            if (!colNames.includes('contact_id_counter')) {
                console.log("      ➕ Adding contact_id_counter...");
                await connection.query("ALTER TABLE `UserProfiles` ADD COLUMN `contact_id_counter` INT DEFAULT 1000;");
            }
            console.log("      ✅ UserProfiles columns verified.");
        }

        await connection.end();
        console.log("--- Fix Complete ---");

    } catch (error) {
        console.error("❌ Error encountered:", error);
    }
}

fix();
