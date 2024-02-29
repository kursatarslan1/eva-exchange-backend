const express = require('express');
const router = express.Router();
const knowledgeAndRules = require('../controllers/knowledge_and_rules_controller');

router.use(express.json());

router.post('/create', knowledgeAndRules.create);
router.get('/getKnowledgeAndRules', knowledgeAndRules.getKnowledgeAndRules);
router.delete('/deleteKnowledgeAndRules', knowledgeAndRules.deleteKnowledgeAndRules);

module.exports = router;