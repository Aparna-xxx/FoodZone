const db = require('../db.js');
const moment = require('moment');


exports.saveOrder = async (req, res) => {
    try {
    const { user_id, cartItems } = req.body; // Assuming cartItems is an array

    if (!user_id || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    // Format the current date/time in the correct format for MySQL
    const added_at = moment().format('YYYY-MM-DD HH:mm:ss');

    // Map through cartItems and generate values for each item
    const queries = cartItems.map(item => {
        return new Promise((resolve, reject) => {
        const { meal_id, category_id, title, price, quantity } = item;

        const query = `
            INSERT INTO cart (user_id, meal_id, category_id, title, price, quantity, added_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            title = VALUES(title), price = VALUES(price), added_at = VALUES(added_at)
        `;

        db.query(query, [user_id, meal_id, category_id, title, price, quantity, added_at], (error, results) => {
            if (error) {
            return reject(error);
            }
            resolve(results);
        });
        });
    });

    // Execute all queries
    await Promise.all(queries);

    res.status(200).json({ message: 'Cart saved successfully' });
    } catch (error) {
    console.error('Error in saveCart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
};