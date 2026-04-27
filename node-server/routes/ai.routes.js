const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth');

// Truth Audit & Hallucination Analysis
router.post('/analyze', auth, aiController.analyzeText);

// Multi-AI Comparison & Consensus
router.post('/compare', auth, aiController.compareModels);

module.exports = router;
