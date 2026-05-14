const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

async function addEmailColumn() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        const queryInterface = sequelize.getQueryInterface();

        // Check if column exists
        const tableDescription = await queryInterface.describeTable('UserProfiles');

        if (!tableDescription.email) {
            console.log('Adding email column...');
            await queryInterface.addColumn('UserProfiles', 'email', {
                type: DataTypes.STRING,
                allowNull: true
            });
            console.log('✓ email column added successfully');
        } else {
            console.log('✓ email column already exists');
        }

        await sequelize.close();
        console.log('✓ Migration completed successfully');
    } catch (error) {
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
}

addEmailColumn();
