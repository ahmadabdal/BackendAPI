const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const upload = multer({ dest: './uploads/' });

// GET endpoint to retrieve all stock items
router.get('/stockitems', (req, res) => {
    const db = req.db;

    db.query('SELECT * FROM stock_items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ Stockitems: results });
    });
});
router.post('/post/stockitems', (req, res) => {
    const db = req.db;

    const jsonFilePath = path.join(__dirname, '../uploads/uploadjson.json');
    console.log('Path to JSON file:', jsonFilePath);  

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read the file' });
        }

        let stockItemsData;
        console.log('stockItemsData before:', stockItemsData);
        try {
            stockItemsData = JSON.parse(data);
            console.log('stockItemsData after:', stockItemsData);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid JSON format' });
        }

        if (!stockItemsData.Stockitems || !Array.isArray(stockItemsData.Stockitems)) {
            return res.status(400).json({ error: 'Invalid JSON format. Expected an array under "Stockitems".' });
        }

        const errors = [];

        stockItemsData.Stockitems.forEach((item) => {
            const { StockItem, Unit, Igroup, ICategory, 'HSN OR SAC': hsn_or_sac, taxRate } = item;

            if (!StockItem || !Unit || !Igroup || !ICategory || !hsn_or_sac || !taxRate) {
                errors.push(`Invalid input or value missing for item: ${StockItem}`);
                return;
            }

            const newItem = {
                stock_item: StockItem,
                unit: Unit,
                igroup: Igroup,
                icategory: ICategory,
                hsn_or_sac: hsn_or_sac,
                tax_rate: taxRate,
            };

            db.query('INSERT INTO stock_items SET ?', newItem, (err, results) => {
                if (err) {
                    errors.push(`Failed to add item: ${StockItem} - Error: ${err.message}`);
                }
            });
        });

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        res.status(201).json({ message: 'Stock item(s) successfully added!' });
    });
});

module.exports = router;
