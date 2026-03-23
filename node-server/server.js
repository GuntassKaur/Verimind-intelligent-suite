require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Global Middleware ---
app.use(helmet({
    contentSecurityPolicy: false, // For easier client-side visual testing
}));
app.use(cors({
    origin: '*', // For production, replace with Vercel URL
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined')); // Structured Logging

// --- Base Routes ---
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'operational',
            system: 'VeriMind Core v2.0 (NodeJS)',
            timestamp: new Date().toISOString()
        }
    });
});

// --- API Router Injections ---
app.use('/api/ai', require('./routes/ai.routes'));
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/process', require('./routes/process.routes'));

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(`[Neural Synapse Failure]: ${err.stack}`);
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal Neural Sync Failure' 
            : err.message
    });
});

app.listen(PORT, () => {
    console.log(`[VeriMind Node Core]: Intelligence established on port ${PORT}`);
    console.log(`[Neural Link]: Access http://localhost:${PORT}/api/health`);
});
