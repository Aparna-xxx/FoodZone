const db = require('../db.js');

exports.meals = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        const query = categoryId
            ? 'SELECT meals.*, GROUP_CONCAT(meal_categories.category_id) AS categoryIds FROM meals LEFT JOIN meal_categories ON meals.id = meal_categories.meal_id WHERE FIND_IN_SET(?, meal_categories.category_id) > 0 GROUP BY meals.id'
            : 'SELECT meals.*, GROUP_CONCAT(meal_categories.category_id) AS categoryIds FROM meals LEFT JOIN meal_categories ON meals.id = meal_categories.meal_id GROUP BY meals.id';

        db.query(query, [categoryId], (err, results) => {
            if (err) {
                console.error('Error fetching meals:', err);
                return res.status(500).json({ error: 'Error fetching meals' });
            }
            results.forEach((meal) => {
                meal.categoryIds = meal.categoryIds ? meal.categoryIds.split(',') : [];
            });
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
