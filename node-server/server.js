require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/verifyai')
    .then(() => console.log('[VerifyAI DB]: Connection established'))
    .catch(err => console.error('[VerifyAI DB]: Connection error:', err));

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
            system: 'VerifyAI Core v1.0 (NodeJS)',
            timestamp: new Date().toISOString()
        }
    });
});

// --- API Router Injections ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
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
    console.log(`[VerifyAI Node Core]: Intelligence established on port ${PORT}`);
    console.log(`[Neural Link]: Access http://localhost:${PORT}/api/health`);
});
