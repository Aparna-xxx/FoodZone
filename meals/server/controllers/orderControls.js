const db = require('../db.js');
const moment = require('moment');
const crypto = require('crypto');
const util = require('util');

// Promisify the db.query to use async/await
const query = util.promisify(db.query).bind(db);

// Function to generate a 6-character alphanumeric order ID
function generateOrderId() {
    return crypto.randomBytes(3).toString('hex'); // Generates a 6-character string
}

exports.saveOrder = async (req, res) => {
    try {
        const { user_id, cartItems } = req.body;

        if (!user_id || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Format the current date/time for MySQL
        const added_at = moment().format('YYYY-MM-DD HH:mm:ss');

        // Generate a unique order_id
        let order_id = generateOrderId();
        let orderExists = true;

        // Ensure the order_id is unique
        while (orderExists) {
            const rows = await query(`SELECT order_id FROM orders WHERE order_id = ?`, [order_id]);

            if (rows.length === 0) {
                orderExists = false; // No collision, we can use this ID
            } else {
                order_id = generateOrderId(); // Regenerate if collision occurs
            }
        }

        for (const item of cartItems) {
            const { meal_id, category_id, title, price, quantity } = item;
        
            // Insert order into the orders table
            const insertQuery = `
                INSERT INTO orders (order_id, user_id, meal_id, category_id, title, price, quantity, added_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                title = VALUES(title), price = VALUES(price), added_at = VALUES(added_at)
            `;
        
            await query(insertQuery, [order_id, user_id, meal_id, category_id, title, price, quantity, added_at]);
        
            // Reduce stock in meals table for each meal ordered
            const updateStockQuery = `
                UPDATE meals
                SET stock = stock - ?
                WHERE id = ?
            `;
        
            // Reduce the stock by the quantity of the ordered meal
            await query(updateStockQuery, [quantity, meal_id]);
        }
        

        return res.status(200).json({ response : 'Success', order_id });
    } catch (error) {
        console.error('Error in saveOrder:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
