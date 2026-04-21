const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Reviews file path
const dataDir = path.join(__dirname, 'data');
const reviewsFile = path.join(dataDir, 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize reviews file if it doesn't exist
if (!fs.existsSync(reviewsFile)) {
    fs.writeFileSync(reviewsFile, JSON.stringify([]));
}

// Helper function to read reviews
function getReviews() {
    try {
        const data = fs.readFileSync(reviewsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading reviews:', error);
        return [];
    }
}

// Helper function to save reviews
function saveReviews(reviews) {
    try {
        fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving reviews:', error);
        return false;
    }
}

// GET /api/reviews - Fetch reviews with pagination
app.get('/api/reviews', (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = parseInt(req.query.perPage) || 3;

        const reviews = getReviews();

        // Sort by date (newest first)
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        const total = reviews.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        const validPage = Math.min(page, totalPages);

        const start = (validPage - 1) * perPage;
        const paginated = reviews.slice(start, start + perPage);

        res.json({
            success: true,
            reviews: paginated,
            currentPage: validPage,
            totalPages: totalPages,
            totalReviews: total,
            perPage: perPage
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews'
        });
    }
});

// POST /api/reviews - Submit new review
app.post('/api/reviews', (req, res) => {
    try {
        const { name, review, rating } = req.body;

        // Validate input
        if (!name || !review || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, review, rating'
            });
        }

        const ratingNum = parseInt(rating);
        if (ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Get existing reviews
        const reviews = getReviews();

        // Create new review
        const newReview = {
            id: 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: String(name).substring(0, 100),
            review: String(review).substring(0, 1000),
            rating: ratingNum,
            date: new Date().toISOString()
        };

        // Add and save
        reviews.push(newReview);
        if (!saveReviews(reviews)) {
            return res.status(500).json({
                success: false,
                message: 'Failed to save review'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: newReview
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting review'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Encounter Coffee Reviews API is running',
        port: PORT,
        reviewsFile: reviewsFile,
        fileExists: fs.existsSync(reviewsFile)
    });
});

// Serve static files from current directory
app.use(express.static(__dirname));

// Start server
app.listen(PORT, () => {
    console.log(`✅ Encounter Coffee Reviews API running on http://127.0.0.1:${PORT}`);
    console.log(`📁 Data saved to: ${reviewsFile}`);
    console.log(`🌐 Open: http://127.0.0.1:${PORT}/index.html`);
});
