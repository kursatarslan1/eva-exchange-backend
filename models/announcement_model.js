const { client } =  require('../middleware/database');

class Announcement{
    constructor(announcement_id, title, content, created_at, apartment_id){
        this.announcement_id = announcement_id;
        this.title = title;
        this.content = content;
        this.created_at = created_at;
        this.apartment_id = apartment_id;
    }

    static async create(title, content, apartment_id){
        const queryText = 'INSERT INTO announcements (title, content, apartment_id) VALUES($1,$2,$3)';
        const values = [title, content, apartment_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error creating announcement: ', error);
        }
    }

    static async getAnnouncements(apartment_id){
        const queryText = "SELECT * FROM announcements WHERE apartment_id = $1";
        const values = [apartment_id];

        try{
            const announcements = await client.query(queryText, values);
            return announcements.rows;
        } catch (error) {
            console.error('Error getting announcements: ', error);
        }
    }

    static async deleteAnnouncement(announcement_id){
        const queryText = 'DELETE FROM announcements WHERE announcement_id = $1';
        const values = [announcement_id];

        try{
            await client.query(queryText, values);
            return true;
        } catch (error){
            console.error('Error executing delete announcement: ', error);
        }
    }
}

module.exports = { Announcement };