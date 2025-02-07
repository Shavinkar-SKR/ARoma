"use strict";
exports.__esModule = true;
// db.ts
var pg_1 = require("pg");
// Create a new pool connection to PostgreSQL
var pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'food_delivery',
    password: 'your_password',
    port: 5432
});
// Check connection to the database
pool.query('SELECT NOW()', function (err, res) {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
    else {
        console.log('Connected to PostgreSQL:', res.rows[0]);
    }
});
exports["default"] = pool; // Export the pool for use in other files
