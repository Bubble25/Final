const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Final',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------------------------
//        HEALTH CHECK
// ---------------------------
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ---------------------------
//        FRUITS API
// ---------------------------

// Get all fruits
app.get('/fruits', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fruits');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch fruits' });
  }
});

// Get fruit by ID
app.get('/fruits/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM fruits WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Fruit not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new fruit
app.post('/fruits', async (req, res) => {
  const { name, description, quantity, image, origin, price_per_kg } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO fruits 
      (name, description, quantity, image, origin, price_per_kg) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, quantity, image, origin, price_per_kg]
    );

    res.json({ 
      id: result.insertId, 
      name, 
      description, 
      quantity, 
      image, 
      origin, 
      price_per_kg 
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create fruit' });
  }
});

// Update fruit
app.put('/fruits/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, image, origin, price_per_kg } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE fruits 
      SET name=?, description=?, quantity=?, image=?, origin=?, price_per_kg=? 
      WHERE id=?`,
      [name, description, quantity, image, origin, price_per_kg, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Fruit not found' });

    res.json({ message: 'Fruit updated' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update fruit' });
  }
});

// Delete fruit
app.delete('/fruits/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM fruits WHERE id=?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Fruit not found' });

    res.json({ message: 'Fruit deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete fruit' });
  }
});

// Server
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
