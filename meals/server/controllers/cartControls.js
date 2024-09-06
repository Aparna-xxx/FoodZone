const db = require('../db.js');

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
