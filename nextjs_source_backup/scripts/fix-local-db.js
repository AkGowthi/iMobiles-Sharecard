/**
 * Utility script to fix the local database schema by adding missing columns.
 * Usage: node scripts/fix-local-db.js
 */

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fixLocalDb() {
    console.log("Connecting to database:", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
    });

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: console.log,
        }
    );

    try {
        await sequelize.authenticate();
        console.log("✅ Database connection successful.");

        // Add columns if they don't exist
        const [results] = await sequelize.query("DESCRIBE Users;");
        const columns = results.map(r => r.Field);

        if (!columns.includes('password')) {
            console.log("Adding 'password' column...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN password VARCHAR(255) NULL AFTER image;");
            console.log("✅ Column 'password' added.");
        } else {
            console.log("ℹ️ Column 'password' already exists.");
        }

        if (!columns.includes('is_admin')) {
            console.log("Adding 'is_admin' column...");
            await sequelize.query("ALTER TABLE Users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE AFTER password;");
            console.log("✅ Column 'is_admin' added.");
        } else {
            console.log("ℹ️ Column 'is_admin' already exists.");
        }

        // Add terms_accepted to UserProfiles
        const [profileResults] = await sequelize.query("DESCRIBE UserProfiles;");
        const profileColumns = profileResults.map(r => r.Field);

        if (!profileColumns.includes('terms_accepted')) {
            console.log("Adding 'terms_accepted' column to UserProfiles...");
            await sequelize.query("ALTER TABLE UserProfiles ADD COLUMN terms_accepted BOOLEAN DEFAULT TRUE;");
            console.log("✅ Column 'terms_accepted' added.");
        } else {
            console.log("ℹ️ Column 'terms_accepted' already exists.");
        }

        console.log("✨ database schema update complete.");
    } catch (error) {
        console.error("❌ Error updating database:", error.message);
    } finally {
        await sequelize.close();
    }
}

fixLocalDb();
