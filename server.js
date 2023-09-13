const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();


const app = express();
const PORT = 3000;
const path = require('path');
const cors = require('cors');
app.use(cors());


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './dist')));

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// API Endpoints

app.post('/spin', async (req, res) => {
  try {
      const newSpin = req.body;
      const { result, options, spin_name } = newSpin;

      const savedSpin = await pool.query(
          "INSERT INTO spins (result, options, spin_name) VALUES ($1, $2, $3) RETURNING *",
          [result, options, spin_name]
      );

      res.json(savedSpin.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});


app.get('/spins', async (req, res) => {
  try {
    const allSpins = await pool.query("SELECT * FROM spins");
    res.json(allSpins.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.put('/spin/:id/option/:optionIndex', async (req, res) => {
  try {
      const { id, optionIndex } = req.params;
      const { option: newText } = req.body;

      //retrieve the existing options for the provided spin id
      const spin = await pool.query(
          "SELECT options FROM spins WHERE id = $1",
          [id]
      );

      if (spin.rowCount === 0) {
          return res.status(404).json({ message: 'Spin not found' });
      }

      //replace the option at the given index with the new text
      const existingOptions = spin.rows[0].options;
      if (optionIndex >= 0 && optionIndex < existingOptions.length) {
          existingOptions[optionIndex] = newText;
      } else {
          return res.status(400).json({ message: 'Invalid option index' });
      }

      //save the modified options back to the database
      const updatedSpin = await pool.query(
          "UPDATE spins SET options = $1 WHERE id = $2 RETURNING *",
          [existingOptions, id]
      );

      res.json(updatedSpin.rows[0]);

  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

//delete entire spin
app.delete('/spin/:spinId', async (req, res) => {
  console.log(`Attempting to delete spin with ID: ${req.params.spinId}`);
  const spinId = req.params.spinId;

  try {
      const result = await pool.query('DELETE FROM spins WHERE id = $1', [spinId]);
      res.status(200).json({ message: 'Spin deleted successfully!' });
  } catch(error) {
      console.error("Error deleting spin:", error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete options in spin
app.delete('/spin/:id/option/:optionIndex', async (req, res) => {
  try {
      const { id, optionIndex } = req.params;

      //retrieve the existing options for the provided spin ID
      const spin = await pool.query(
          "SELECT options FROM spins WHERE id = $1",
          [id]
      );

      if (spin.rowCount === 0) {
          return res.status(404).json({ message: 'Spin not found' });
      }

      //remove the option at the given index from the options array
      const existingOptions = spin.rows[0].options;
      if (optionIndex >= 0 && optionIndex < existingOptions.length) {
          existingOptions.splice(optionIndex, 1);
      } else {
          return res.status(400).json({ message: 'Invalid option index' });
      }

      const updatedSpin = await pool.query(
          "UPDATE spins SET options = $1 WHERE id = $2 RETURNING *",
          [existingOptions, id]
      );

      res.json(updatedSpin.rows[0]);

  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
