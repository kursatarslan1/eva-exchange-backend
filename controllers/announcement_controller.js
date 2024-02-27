const { Announcement } = require('../models/announcement_model');

async function createAnnouncement(req, res){
    const { title, content, apartment_id } = req.body;

    try{
        const announcementRes = await Announcement.create(title, content, apartment_id);
        if(!announcementRes){
            throw new Error('Announcement creation failed!');
        }
        res.json({ success: 'true' });
    }catch (error){
        console.error('Unexpected error: ', error);
        throw error;
    }
}

async function getAnnouncementList(req, res) {
    const { apartment_id } = req.body;

    try{
        const announcementList = await Announcement.getAnnouncements(apartment_id);
        res.json({announcementList});
    } catch (error){
        console.error('Cannot get announcement list: ', error);
        throw error;
    }
}

async function deleteAnnouncement(req, res){
    const { announcement_id } = req.body;

    try{
        const deleteAnnouncement = await Announcement.deleteAnnouncement(announcement_id);
        if(!deleteAnnouncement){
            throw new Error('Deleting announcemnet unsuccessful: ', error);
        }
        res.json({ success: 'true' });
    } catch (error) {
        console.error('Cannot delete announcement: ', error);
        throw error;
    }
}

module.exports = { createAnnouncement, getAnnouncementList, deleteAnnouncement};