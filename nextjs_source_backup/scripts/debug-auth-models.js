
const { Sequelize } = require('sequelize');
const SequelizeAdapter = require('@auth/sequelize-adapter').default;
// Note: @auth/sequelize-adapter might export default or just function. 
// CommonJS import interaction with current setup might need check.
// Trying normal require first.
const AdapterFn = require('@auth/sequelize-adapter');

require('dotenv').config({ path: '.env.local' });

async function debugModels() {
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

    console.log("Connecting to", DB_NAME, "at", DB_HOST);

    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
        logging: false,
        dialectModule: require('mysql2')
    });

    try {
        await sequelize.authenticate();
        console.log("Connected.");

        // Init adapter
        // Adapter returns an object with methods, but side-effect is defined models on sequelize
        const adapter = (AdapterFn.default || AdapterFn)(sequelize);

        const models = sequelize.models;
        console.log("Models loaded:", Object.keys(models));

        ['User', 'user', 'Account', 'account'].forEach(name => {
            const model = models[name];
            if (model) {
                console.log(`\n--- Model: ${name} ---`);
                console.log(`Table Name: ${model.tableName}`);
                console.log(`Attributes:`);
                Object.keys(model.rawAttributes).forEach(attr => {
                    const def = model.rawAttributes[attr];
                    // field is the DB column name. If undefined, it uses attr name.
                    console.log(`  - ${attr} -> DB Field: ${def.field || attr} (Type: ${def.type.constructor.name})`);
                });
            }
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await sequelize.close();
    }
}

debugModels();
