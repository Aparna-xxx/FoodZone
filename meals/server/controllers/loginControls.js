const db = require("../db.js");

exports.signup = async (req, res) => {
    const {regno, pwd} = req.body;
    console.log(regno + " " + pwd);
    try {
        db.query('SELECT * FROM users WHERE regno = ?', [regno], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error' });
            }

            if(results.length > 0) {
                return res.json({ response : 'exists' });
            }

            const email = `${regno}@psgtech.ac.in`;

            if(results.length == 0) {
                db.query('INSERT INTO users (regno, email, password_hash) VALUES (? , ?, ?)', [regno, email, pwd], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query error' });
                    }
                    res.json({ response : true });
                })
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const check = () => {
    db.query('SELECT * from users', (err, results) => {
        console.log(results)
    })
}

exports.signin = async (req,res) => {
    const {regno, pwd} = req.query;
    const trimmedRegno = regno.trim();
    try {
        db.query('SELECT regno, password_hash FROM users WHERE regno = ?', [trimmedRegno], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error' });
            }

            if( results.length == 0) {
                return res.json({ response : false });
            }

            if(results.length > 0){
                if(results[0].password_hash != pwd){
                    return res.json({ response : 'invlaidPWD' });
                }
            }

            return res.json({ response : true });
        });
    } catch (error) {
        console.log(error);
    }
}