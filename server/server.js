const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server and connect to database
const startServer = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

startServer();