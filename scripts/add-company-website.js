const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

async function addCompanyWebsiteColumn() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connection established');

        const queryInterface = sequelize.getQueryInterface();

        // Check if column exists
        const tableDescription = await queryInterface.describeTable('UserProfiles');

        if (!tableDescription.company_website) {
            console.log('Adding company_website column...');
            await queryInterface.addColumn('UserProfiles', 'company_website', {
                type: DataTypes.STRING,
                allowNull: true
            });
            console.log('✓ company_website column added successfully');
        } else {
            console.log('✓ company_website column already exists');
        }

        await sequelize.close();
        console.log('✓ Migration completed successfully');
    } catch (error) {
        console.error('✗ Migration failed:', error);
        process.exit(1);
    }
}

addCompanyWebsiteColumn();
