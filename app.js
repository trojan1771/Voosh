const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const trackRoutes = require('./routes/trackRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(bodyParser.json());

// Define API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/favorites', favoriteRoutes);

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
