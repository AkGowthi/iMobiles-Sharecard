
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function check() {
    console.log("--- Checking Database Connection ---");
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, User: ${DB_USER}, DB: ${DB_NAME}`);

    try {
        // 1. Test Raw Connection
        console.log("1. Testing raw mysql2 connection...");
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD || '',
            port: DB_PORT || 3306
        });
        console.log("   ✅ Raw connection successful.");
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`   ✅ Database ${DB_NAME} ensured.`);
        await connection.end();

        // 2. Test Sequelize Connection
        console.log("2. Testing Sequelize connection...");
        const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || undefined, {
            host: DB_HOST,
            port: parseInt(DB_PORT || '3306'),
            dialect: 'mysql',
            logging: false,
            dialectModule: require('mysql2') // Explicitly provide mysql2
        });

        await sequelize.authenticate();
        console.log("   ✅ Sequelize authentication successful.");

        // 3. List Tables
        console.log("3. Listing tables...");
        const [results] = await sequelize.query("SHOW TABLES;");
        const tables = results.map(r => Object.values(r)[0]);
        console.log("   Tables found:", tables.join(", "));

        // 4. Check specific columns
        if (tables.includes('UserProfiles')) {
            console.log("4. Checking UserProfiles columns...");
            const [columns] = await sequelize.query("DESCRIBE UserProfiles;");
            const columnNames = columns.map(c => c.Field);
            console.log("   UserProfiles columns:", columnNames.join(", "));

            const required = ['contact_suffix_prefix', 'contact_id_counter'];
            const missing = required.filter(c => !columnNames.includes(c));
            if (missing.length > 0) {
                console.error("   ❌ Missing columns in UserProfiles:", missing.join(", "));
            } else {
                console.log("   ✅ UserProfiles has required suffix columns.");
            }
        } else {
            console.error("   ❌ UserProfiles table not found!");
        }

        if (tables.includes('SavedContacts')) {
            console.log("   ✅ SavedContacts table exists.");
        } else {
            console.error("   ❌ SavedContacts table missing!");
        }

    } catch (error) {
        console.error("❌ Error encountered:", error);
    }
}

check();
