const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const { readdirSync } = require('fs');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());

require("./routes/route");

app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'], // Allow only GET and POST requests
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
};

app.use(cors(corsOptions));

readdirSync('./routes').map((route) => app.use('/FOOD-ZONE', require('./routes/' + route)));

app.listen(PORT, ()=> {
    console.log(`server is listening to http://localhost:${PORT} `);
});

db;