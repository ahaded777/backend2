import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Example connection error handling
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        // Handle the error appropriately
    } else {
        console.log('Connected to the database');
        // Release the connection when done with it
        connection.release();
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

app.post('/posts', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    const query = 'INSERT INTO post (title) VALUES (?)';
    const values = [title];

    // Example query error handling
    pool.query(query, values, (err, data) => {
        if (err) {
            console.error('Error executing the query:', err);
            // Handle the error appropriately
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.json({ message: 'Post created successfully.' });
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
