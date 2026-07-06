const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/practice', require('./routes/practice'));
app.use('/api/mock', require('./routes/mock'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/interview-plans', require('./routes/interviewPlans'));

// Serve uploads from external temp directory to prevent hot reload loops
const os = require('os');
const fs = require('fs');
const externalUploadsDir = path.join(os.tmpdir(), 'interview-portal-uploads');
if (!fs.existsSync(externalUploadsDir)) {
    fs.mkdirSync(externalUploadsDir, { recursive: true });
}
app.use('/uploads', express.static(externalUploadsDir));

// Redirect root path to login.html
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database with retry logic
        await connectDB();
        
        // Start listening
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err, promise) => {
            console.log(`Error: ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();