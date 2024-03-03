const { Announcement } = require('../models/announcement_model');

async function createAnnouncement(req, res){
    const { title, content, apartment_id } = req.body;

    try{
        const announcementRes = await Announcement.create(title, content, apartment_id);
        if(!announcementRes){
            console.error('Announcement creation failed!');
        }
        res.json({ success: 'true' });
    }catch (error){
        console.error('Unexpected error: ', error);
    }
}

async function getAnnouncementList(req, res) {
    const { apartment_id } = req.query;

    try{
        const announcementList = await Announcement.getAnnouncements(apartment_id);
        res.json({announcementList});
    } catch (error){
        console.error('Cannot get announcement list: ', error);
    }
}

async function deleteAnnouncement(req, res){
    const { announcement_id } = req.query;

    try{
        const deleteAnnouncement = await Announcement.deleteAnnouncement(announcement_id);
        if(!deleteAnnouncement){
            console.error('Deleting announcemnet unsuccessful: ', error);
        }
        res.json({ success: 'true' });
    } catch (error) {
        console.error('Cannot delete announcement: ', error);
    }
}

module.exports = { createAnnouncement, getAnnouncementList, deleteAnnouncement};