const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement_controller');
const isAuthenticated = require('../middleware/auth');

router.use(express.json());

router.post('/create', isAuthenticated, announcementController.createAnnouncement);
router.get('/getAnnouncementList', announcementController.getAnnouncementList);
router.delete('/deleteAnnouncement', announcementController.deleteAnnouncement);

module.exports = router;