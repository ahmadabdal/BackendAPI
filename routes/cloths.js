const express = require('express');
const router = express.Router();

router.get('/clothes', (req, res) => {
    const clothes = [
        { itemName: 'Shirt', size: 'M', color: 'Blue', price: 20 },
        { itemName: 'Pants', size: 'L', color: 'Black', price: 30 }
    ];
    res.json(clothes);
});

module.exports = router;
