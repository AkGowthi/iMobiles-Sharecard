
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkCols() {
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    const connection = await mysql.createConnection({
        host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });

    const tables = ['Users', 'Accounts', 'Sessions'];
    for (const t of tables) {
        try {
            const [cols] = await connection.query(`DESCRIBE \`${t}\`;`);
            console.log(`\n${t} Table Columns:`);
            cols.forEach(c => console.log(`- ${c.Field} (${c.Type})`));
        } catch (e) {
            console.log(`\n${t} Table not found or error:`, e.message);
        }
    }

    await connection.end();
}
checkCols();
