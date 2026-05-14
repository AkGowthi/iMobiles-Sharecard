const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

async function addMapUrlColumn() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        const queryInterface = sequelize.getQueryInterface();

        // Check if column exists
        const tableDescription = await queryInterface.describeTable('UserProfiles');

        if (!tableDescription.map_url) {
            console.log('Adding map_url column...');
            await queryInterface.addColumn('UserProfiles', 'map_url', {
                type: DataTypes.STRING,
                allowNull: true
            });
            console.log('✓ map_url column added successfully');
        } else {
            console.log('✓ map_url column already exists');
        }

        await sequelize.close();
        console.log('✓ Migration completed successfully');
    } catch (error) {
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
}

addMapUrlColumn();
