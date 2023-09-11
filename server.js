const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();


const app = express();
const PORT = 3000;
const path = require('path');


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// API Endpoints

// POST /spin: Accepts a result and a set of options
app.post('/spin', async (req, res) => {
  try {
    const { result, options } = req.body;
    const newSpin = await pool.query(
      "INSERT INTO spins (result, options) VALUES ($1, $2) RETURNING *",
      [result, options]
    );
    res.json(newSpin.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /spins: Retrieves all past spins from the spins table
app.get('/spins', async (req, res) => {
  try {
    const allSpins = await pool.query("SELECT * FROM spins");
    res.json(allSpins.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
