const db = require('../db.js');
const moment = require('moment');

exports.addByMealsId = async (req, res) => {
        try {
            const mealIds = req.query.mealId;  // Get the mealIds from the query
            if (!mealIds) {
                return res.status(400).json({ error: 'No meal ID provided' });
            }

            // Ensure mealIds is an array (if multiple IDs are passed)
            const mealIdsArray = Array.isArray(mealIds) ? mealIds : mealIds.split(',').map(id => id.trim());

            if (mealIdsArray.length === 0) {
                return res.status(400).json({ error: 'Invalid meal IDs provided' });
            }

            const query = `SELECT meals.*, GROUP_CONCAT(meal_categories.category_id) AS categoryIds 
                        FROM meals
                        LEFT JOIN meal_categories ON meals.id = meal_categories.meal_id 
                        WHERE meals.id IN (?)
                        GROUP BY meals.id`;

            db.query(query, [mealIdsArray], (err, results) => {
                if (err) {
                    console.error('Error fetching meal by ID:', err);
                    return res.status(500).json({ error: 'Error fetching meal' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Meal not found' });
                }
                const meals = results.map(meal => {
                    meal.categoryIds = meal.categoryIds ? meal.categoryIds.split(',') : [];
                    return meal;
                });
                res.json(meals);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
};



    exports.saveCart = async (req, res) => {
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
