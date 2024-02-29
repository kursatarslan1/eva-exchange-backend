const { KnowledgeAndRules } = require('../models/knowledge_and_rules_model');

async function create(req, res){
    const { apartment_id, publisher_manager_id, publisher_name, content, publish_date } = req.body;

    try{
        await KnowledgeAndRules.create(apartment_id, publisher_manager_id, publisher_name, content, publish_date);
        res.json({success: 'true'});
    } catch (error) {
        console.error('Cannot delete requests or complaints: ', error);
    }
}

async function getKnowledgeAndRules(apartment_id){
    const { apartment_id } = req.body;

    try{
        const result = await KnowledgeAndRules.getKnowledgeAndRules(apartment_id);
        res.json({result});
    } catch (error) {
        console.error('Cannot delete requests or complaints: ', error);
    }
}

async function deleteKnowledgeAndRules(knowledge_and_rules_id){
    const { knowledge_and_rules_id } = req.body;

    try{
        await KnowledgeAndRules.deleteKnowledgeAndRules(knowledge_and_rules_id);
        res.json({success: 'true'});
    } catch (error) {
        console.error('Cannot delete requests or complaints: ', error);
    }
}

module.exports = { create, getKnowledgeAndRules, deleteKnowledgeAndRules }