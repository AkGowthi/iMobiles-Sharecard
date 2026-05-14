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
        logging: false,
    }
);

async function checkBookingUrl() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database\n');

        const [results] = await sequelize.query(`
            SELECT id, f_name, l_name, booking_url, display_name 
            FROM UserProfiles 
            LIMIT 5
        `);

        console.log('📋 UserProfiles with booking_url:\n');
        results.forEach(profile => {
            console.log(`Name: ${profile.f_name} ${profile.l_name}`);
            console.log(`Display Name: ${profile.display_name}`);
            console.log(`Booking URL: ${profile.booking_url || '(not set)'}`);
            console.log('---');
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkBookingUrl();
