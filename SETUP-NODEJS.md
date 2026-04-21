# Node.js Backend Setup Guide - Encounter Coffee Reviews

## Quick Start

### 1. Install Node.js Modules
```bash
npm install
```

This will install:
- Express (web server)
- CORS (cross-origin requests)
- Body-parser (JSON parsing)

### 2. Start the Backend Server
```bash
npm start
```

Expected output:
```
✅ Encounter Coffee Reviews API running on http://127.0.0.1:3000
📁 Data saved to: C:\...\data\reviews.json
🌐 Open: http://127.0.0.1:3000/index.html
```

### 3. Test the API

**Option A: Browser Console (F12)**
```javascript
// Check API status
testReviewsAPI()

// Submit test review
testReviewsSubmit()
```

**Option B: Direct Browser Access**
- Health check: http://localhost:3000/api/health
- Get reviews: http://localhost:3000/api/reviews?page=1&perPage=3

### 4. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/reviews` | Submit new review |
| GET | `/api/reviews?page=1&perPage=3` | Get paginated reviews |
| GET | `/api/health` | Check API status |

### 5. Review Data Format

**POST Request:**
```json
{
  "name": "Customer Name",
  "review": "Review text here",
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "review": {
    "id": "review_1234567890_abc123",
    "name": "Customer Name",
    "review": "Review text here",
    "rating": 5,
    "date": "2024-04-20T10:30:00.000Z"
  }
}
```

### 6. File Structure

```
ENCOUNTERCOFFEE/
├── server.js                 # Node.js Express server
├── package.json              # Dependencies
├── data/
│   └── reviews.json          # Reviews storage (auto-created)
├── js/
│   └── reviews.js            # Frontend reviews logic
├── css/
│   └── reviews.css           # Reviews styling
├── index.html                # Main page with review form
└── other pages...
```

## Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### Server shows "Error: listen EADDRINUSE :::3000"
Port 3000 is already in use. Either:
- Kill the process using port 3000
- Change PORT in `server.js` to 3001, 3002, etc.

### Reviews not submitting?
1. Check browser console (F12) for errors
2. Run `testReviewsAPI()` to verify backend is running
3. Check that Node.js server is running: `npm start`
4. Ensure backend URL in `js/reviews.js` is correct: `http://localhost:3000/api`

### Reviews not persisting?
Check that `data/reviews.json` exists and is writable. The file is auto-created on first request.

## Development Notes

- **Port 3000**: Backend API (Node.js)
- **Port 5500**: Frontend (Live Server) if using separate server
- **Reviews stored in**: `data/reviews.json`
- **CORS enabled**: Allows requests from any origin
- **Validation**: Name/review text length limits (100/1000 chars)
- **Rating range**: 1-5 stars

## Optional Enhancements

- Add database (MongoDB, PostgreSQL, SQLite)
- Add authentication/admin panel
- Add email notifications
- Add spam filtering
- Add review moderation
- Add review search/filter
