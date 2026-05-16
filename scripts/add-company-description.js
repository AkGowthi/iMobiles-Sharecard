const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

async function addCompanyDescriptionColumn() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        const queryInterface = sequelize.getQueryInterface();

        // Check if column exists
        const tableDescription = await queryInterface.describeTable('UserProfiles');

        if (!tableDescription.company_description) {
            console.log('Adding company_description column...');
            await queryInterface.addColumn('UserProfiles', 'company_description', {
                type: DataTypes.TEXT,
                allowNull: true
            });
            console.log('✓ company_description column added successfully');
        } else {
            console.log('✓ company_description column already exists');
        }

        await sequelize.close();
        console.log('✓ Migration completed successfully');
    } catch (error) {
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
}

addCompanyDescriptionColumn();
