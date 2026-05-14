import { Sequelize } from 'sequelize';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'sharecard';
const DB_SYNC_ENV = process.env.DB_SYNC;

export const DB_SYNC = DB_SYNC_ENV === 'true';

// Clean password - remove quotes if present and handle empty strings
const cleanPassword = DB_PASSWORD 
    ? DB_PASSWORD.replace(/^["']|["']$/g, '').trim() 
    : '';

// Log database configuration (without password for security)
console.log('📊 Database Configuration:');
console.log('   DB_HOST:', DB_HOST);
console.log('   DB_PORT:', DB_PORT || '3306');
console.log('   DB_USER:', DB_USER);
console.log('   DB_NAME:', DB_NAME);
console.log('   DB_PASSWORD:', cleanPassword ? '✓ Set' : '⚠️ Empty (may cause connection issues)');
console.log('   DB_SYNC:', DB_SYNC);

const sequelize = new Sequelize(DB_NAME, DB_USER, cleanPassword || undefined, {
    host: DB_HOST,
    port: parseInt(DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    dialectModule: require('mysql2'),
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 60000,
    },
});

export default sequelize;
