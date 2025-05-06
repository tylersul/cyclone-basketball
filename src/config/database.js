const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
    try {
        // Attempt to connect to the database using connection string from environment
        await mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
            useNewUrlParser: true,        // Use new URL parser
            useUnifiedTopology: true,     // Use new Server Discover and Monitoring engine
            // Optional: Additional connection options can be added here
            // useCreateIndex: true,      // Deprecated in newer Mongoose versions
            // useFindAndModify: false   // Deprecated in newer Mongoose versions
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Log detailed error and exit process with failure
        console.error('Connection Details:', {
            connectionString: process.env.DATABASE_CONNECTION_STRING ? 'Present' : 'Missing',
            nodeEnv: process.env.NODE_ENV
        });
        // Exit process with failure
        process.exit(1);
    }
};

// Optional: Add mongoose connection event listeners
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = connectDB;
