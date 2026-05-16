
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Clean password logic from lib/db.ts
const cleanPassword = DB_PASSWORD
    ? DB_PASSWORD.replace(/^["']|["']$/g, '').trim()
    : '';

const sequelize = new Sequelize(
    DB_NAME || 'sharecard',
    DB_USER || 'root',
    cleanPassword || 'password',
    {
        host: DB_HOST || 'localhost',
        port: parseInt(DB_PORT || '3306'),
        dialect: 'mysql',
        logging: false,
        dialectModule: require('mysql2'),
    }
);

async function inspect() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');
        const tableInfo = await sequelize.getQueryInterface().describeTable('Users');
        console.log(JSON.stringify(tableInfo, null, 2));
    } catch (error) {
        console.error('Error inspecting table:', error);
    } finally {
        await sequelize.close();
    }
}

inspect();
