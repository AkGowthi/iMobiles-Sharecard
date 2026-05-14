const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize(
    process.env.DB_NAME || 'sharecard',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: console.log,
    }
);

async function addBookingUrlColumn() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        console.log('🔄 Adding booking_url column to UserProfile table...');

        await sequelize.query(`
            ALTER TABLE UserProfiles 
            ADD COLUMN booking_url VARCHAR(255) DEFAULT NULL
        `);

        console.log('✅ Successfully added booking_url column');

        // Verify the column was added
        const [results] = await sequelize.query(`
            SHOW COLUMNS FROM UserProfiles LIKE 'booking_url'
        `);

        if (results.length > 0) {
            console.log('✅ Verified: booking_url column exists');
            console.log(results[0]);
        }

    } catch (error) {
        if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️  Column booking_url already exists');
        } else {
            console.error('❌ Error adding column:', error.message);
            throw error;
        }
    } finally {
        await sequelize.close();
        console.log('🔌 Database connection closed');
    }
}

addBookingUrlColumn();
