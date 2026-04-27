# Encounter Coffee - PHP Backend Setup

## Overview
Your backend is now **100% PHP**. No Node.js, no npm — just pure PHP files that work on any shared hosting.

## Files
- `api/reviews.php` — Main API endpoint (GET for fetching, POST for submitting reviews)
- `api/health.php` — Health check endpoint
- `data/reviews.json` — Review storage (auto-created)

## Deployment Steps

### 1. Upload to Your Server
Upload these files to your web hosting via FTP/File Manager:
```
/
├── api/
│   ├── reviews.php          ← Main endpoint
│   └── health.php           ← Health check
├── data/
│   └── (created auto)
├── js/
│   ├── reviews.js           ← Already updated
│   ├── content-loader.js    ← Already updated
│   └── (other JS files)
├── index.html
├── shop.html
└── (other HTML files)
```

### 2. Check Permissions
Make sure the `/data/` directory is **writable**:
- Via FTP: Right-click → Properties → Permissions → Set to **755** or **777**
- Via cPanel: File Manager → Right-click `/data/` → Change Permissions → 755

### 3. Verify PHP Version
- **Minimum PHP 5.6+** (preferably 7.4+)
- Check: Ask your hosting provider or check via cPanel → PHP Info

### 4. Test It Works
1. Open your browser and navigate to: `https://yoursite.com/api/health.php`
2. You should see JSON response like:
```json
{
  "status": "ok",
  "message": "Encounter Coffee Reviews API is running",
  "backend": "PHP",
  "fileExists": true
}
```

### 5. Test Review Submission
1. Open any page with the review form (e.g., `index.html`)
2. Submit a test review
3. Check if it appears in the list

## Endpoints

### GET `/api/reviews.php`
Fetch paginated reviews.
```
GET /api/reviews.php?page=1&perPage=3
```

**Response:**
```json
{
  "success": true,
  "reviews": [...],
  "currentPage": 1,
  "totalPages": 2,
  "totalReviews": 5,
  "perPage": 3
}
```

### POST `/api/reviews.php`
Submit a new review.

**Request:**
```json
{
  "name": "John Doe",
  "review": "Great coffee!",
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
    "name": "John Doe",
    "review": "Great coffee!",
    "rating": 5,
    "date": "2024-04-23T14:30:00+00:00"
  }
}
```

### GET `/api/health.php`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Encounter Coffee Reviews API is running",
  "backend": "PHP",
  "fileExists": true
}
```

## Troubleshooting

### Problem: "404 Not Found"
- Make sure files are uploaded to the correct path
- Check that `/api/reviews.php` exists
- Verify file paths in JavaScript are correct (should be `/api/reviews.php`)

### Problem: "Error submitting review"
- Check `/data/` directory permissions (should be 755 or 777)
- Create `/data/` folder manually if it doesn't exist
- Check PHP error logs in your hosting control panel

### Problem: "data/reviews.json not found"
- The file is created automatically on first review submission
- If it's not created: check directory write permissions
- You can manually create it with content: `[]`

### Problem: CORS errors in console
- This is normal in development
- On production (same domain), it won't happen
- PHP sets CORS headers automatically

## Local Testing (Windows)

If you want to test locally before uploading:

### Option 1: Use PHP Built-in Server
```bash
cd ENCOUNTERCOFFEE
php -S localhost:8000
# Open: http://localhost:8000/index.html
```

### Option 2: Use xampp/Wamp
1. Copy `ENCOUNTERCOFFEE` folder to `htdocs/` (xampp) or `www/` (wamp)
2. Start Apache & PHP
3. Open: `http://localhost/ENCOUNTERCOFFEE/index.html`

## Security Notes

✅ **Already Implemented:**
- Input validation (name, review, rating)
- XSS prevention (data sanitization)
- String length limits (name: 100, review: 1000)
- CORS headers for cross-origin requests
- JSON error handling

⚠️ **For Production:**
- Use HTTPS (encrypted connection)
- Consider adding spam protection (rate limiting)
- Regular backups of `data/reviews.json`
- Monitor error logs

## Migration from Node.js

If you were previously using Node.js:
1. ✅ Delete `server.js` (optional, can keep as reference)
2. ✅ Delete `package.json` (optional, can keep as reference)
3. ✅ Delete `node_modules/` (optional)
4. ✅ Keep `/api/` folder with PHP files
5. ✅ JavaScript files (`reviews.js`, `content-loader.js`) already updated

## Questions?

Test the API: Open browser console (`F12`) and run:
```javascript
window.testReviewsAPI()
window.testReviewsSubmit()
```

Both should work without errors.
