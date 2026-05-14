const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Connected to database at', dbPath);

db.serialize(() => {
    // 1. Drop backup table if it exists (cleanup from failed sync)
    db.run("DROP TABLE IF EXISTS UserProfiles_backup", (err) => {
        if (err) console.error("Error dropping backup:", err.message);
        else console.log("Dropped UserProfiles_backup (if existed)");
    });

    // 2. Add positions column if missing
    // SQLite doesn't support IF NOT EXISTS for columns in all versions easily, 
    // so we just try and ignore error if it exists.
    db.run("ALTER TABLE UserProfiles ADD COLUMN positions TEXT", (err) => {
        if (err) {
            if (err.message.includes("duplicate column name")) {
                console.log("Column 'positions' already exists.");
            } else {
                console.error("Error adding positions column:", err.message);
            }
        } else {
            console.log("Added 'positions' column successfully.");
        }
    });
});

db.close(() => {
    console.log('Database connection closed.');
});
