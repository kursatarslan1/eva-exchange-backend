const { connectToDatabase } = require('./middleware/database');
const express = require('express');
const app = express();
const managerRoutes = require('./routes/manager_routes');
const apartmentRoutes = require('./routes/apartment_routes');
const residentRoutes = require('./routes/resident_routes');
const addressRoutes = require('./routes/address_routes');
const racRoutes = require('./routes/rac_routes');
const announcementRoutes = require('./routes/announcement_routes');

require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.set('trust proxy', true);

app.use('/steyon/manager', managerRoutes);
app.use('/steyon/apartment', apartmentRoutes);
app.use('/steyon/resident', residentRoutes);
app.use('/steyon/address', addressRoutes);
app.use('/steyon/rac', racRoutes);
app.use('/steyon/announcement', announcementRoutes);

const PORT = 3000;

connectToDatabase();

app.listen(PORT, () => {
    console.log('Application Up!');
});