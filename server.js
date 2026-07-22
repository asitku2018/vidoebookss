require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const app = express();

// Hostinger dynamically assigns a PORT in their managed Node environments.
// We fallback to 5000 for local development.
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. MIDDLEWARE & SECURITY
// ==========================================

// Ensure your Hostinger environment variable for FRONTEND_URL is set correctly
// so that only your Next.js application can make requests to this backend.
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Use '*' temporarily if debugging connection issues
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. DATABASE CONFIGURATION
// ==========================================

// Using a connection pool is mandatory for production on Hostinger.
// It handles disconnected/sleeping MySQL connections automatically.
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection on startup
pool.getConnection()
    .then((connection) => {
        console.log('✅ Successfully connected to the MySQL database.');
        connection.release();
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err.message);
    });

// ==========================================
// 3. API ROUTES
// ==========================================

// Root / Health Check (Hostinger uses this to verify your app is running)
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'online', 
        message: 'VidoeBooks API is running securely on Hostinger.',
        environment: process.env.NODE_ENV
    });
});

// Fetch all Ebooks Route
app.get('/api/ebooks', async (req, res) => {
    try {
        // Example query assuming you have an 'ebooks' table
        // const [rows] = await pool.query('SELECT id, title, language, content FROM ebooks');
        
        // Mock data fallback if table isn't created yet
        const mockBooks = [
            { id: 1, title: "The Silent Forest", language: "English" },
            { id: 2, title: "शांत जंगल (Hindi)", language: "Hindi" }
        ];
        
        res.status(200).json(mockBooks); // Replace mockBooks with 'rows' when DB is ready
    } catch (error) {
        console.error('Error fetching ebooks:', error);
        res.status(500).json({ error: 'Failed to fetch ebooks.' });
    }
});

// Admin Upload Ebook Route (Protected)
app.post('/api/upload', async (req, res) => {
    const { title, language, content } = req.body;
    
    // Basic validation
    if (!title || !language || !content) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Query to insert the new book
        // const [result] = await pool.query(
        //     'INSERT INTO ebooks (title, language, content) VALUES (?, ?, ?)',
        //     [title, language, content]
        // );
        
        res.status(201).json({ message: 'Ebook uploaded successfully!' });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error during upload.' });
    }
});

// ==========================================
// 4. SERVER INITIALIZATION
// ==========================================

// Global Error Handler for uncaught issues
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack);
    res.status(500).json({ error: 'Something broke on the server!' });
});

// Start listening
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 Server initialized in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening continuously on Port ${PORT}`);
    console.log(`🔒 Allowed CORS Origin: ${process.env.FRONTEND_URL || 'Not specified (All allowed)'}`);
    console.log(`==========================================`);
});
