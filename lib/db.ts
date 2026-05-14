import { Sequelize } from 'sequelize';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SYNC: DB_SYNC_ENV } = process.env;

export const DB_SYNC = DB_SYNC_ENV === 'true';

// Validate required environment variables
if (!DB_HOST) {
    throw new Error('Invalid/Missing environment variable: "DB_HOST"');
}

if (!DB_NAME) {
    throw new Error('Invalid/Missing environment variable: "DB_NAME"');
}

if (!DB_USER) {
    throw new Error('Invalid/Missing environment variable: "DB_USER"');
}

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
