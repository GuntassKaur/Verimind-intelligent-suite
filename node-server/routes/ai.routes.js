const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// Truth Audit & Hallucination Analysis
router.post('/analyze', aiController.analyzeText);

// Multi-AI Comparison & Consensus
router.post('/compare', aiController.compareModels);

module.exports = router;
