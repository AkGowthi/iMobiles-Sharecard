/**
 * Utility script to set or update a user's password in the MySQL database.
 * Usage: node scripts/set-user-password.js <email> <password>
 */

const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setUserPassword() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error("Usage: node scripts/set-user-password.js <email> <password>");
        process.exit(1);
    }

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
        }
    );

    try {
        const User = sequelize.define('User', {
            id: { type: DataTypes.UUID, primaryKey: true },
            email: { type: DataTypes.STRING, unique: true },
            password: { type: DataTypes.STRING },
            isAdmin: { type: DataTypes.BOOLEAN, field: 'is_admin' },
        }, {
            tableName: 'Users',
            timestamps: false,
        });

        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword, isAdmin: true });

        console.log(`✅ Success! Password updated for ${email}. User has also been granted Admin rights.`);
    } catch (error) {
        console.error("❌ Error updating password:", error.message);
    } finally {
        await sequelize.close();
    }
}

setUserPassword();
