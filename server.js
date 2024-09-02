const express = require('express');
const app = express();
const mysql = require('mysql2');
const port = 3000;

const stockItemsRouter = require('./routes/stockItems');
const clothesRouter = require('./routes/cloths');

// Create a MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',  
    user: 'root',  
    password: 'Abdal@880',  
    database: 'STOCK_ITEMS'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});

// Make the database connection available to your routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use(express.json()); 
app.use('/api', stockItemsRouter);
app.use('/api', clothesRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
