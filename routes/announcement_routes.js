const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement_controller');

router.use(express.json());

router.post('/create', announcementController.createAnnouncement);
router.get('/getAnnouncementList', announcementController.getAnnouncementList);
router.delete('/deleteAnnouncement', announcementController.deleteAnnouncement);

module.exports = router;