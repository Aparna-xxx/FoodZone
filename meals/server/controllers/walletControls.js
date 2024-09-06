const db = require('../db.js');

exports.walletAmount = async (req, res) => {
    try {
        const { userId } = req.query;
        const trimmedUserId = userId.trim();
        db.query('SELECT amount FROM wallet WHERE regno = ?', [trimmedUserId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        
        if (results.length === 0) {
            console.log('No wallet found for user:', userId);
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const balance = results[0].amount;
        console.log(`Wallet balance for ${userId}: ${balance}`);
        res.json({ balance });
    });
    } catch (error) {
        console.error(error);
    }
}

exports.addWalletAmount = async (req, res) => {
    try {
        const {userId, amount} = req.body;
        const trimmedUserId = userId.trim();
        
        db.query('UPDATE wallet set amount = ? WHERE regno = ?', [amount, trimmedUserId], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json({ amount });
        })

    } catch (error) {
        console.error(error);
    }
}