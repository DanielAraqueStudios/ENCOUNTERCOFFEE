# Admin Panel Documentation

## Overview
Complete admin panel for managing Encounter Colombian Coffee website content, including reviews, videos, and site content.

## Access

### Login
- **URL**: `/admin/index.html`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`

**IMPORTANT**: Change the default password immediately in production!

### Dashboard
- **URL**: `/admin/dashboard.html`
- Available after successful login

## Features

### 1. Reviews Management
- View all customer reviews with ratings and dates
- See statistics: total reviews, average rating
- Delete individual reviews if needed
- Reviews are displayed in order from newest to oldest

**API Endpoint**: `GET /api/reviews.php`, `POST /api/reviews.php`

### 2. Content Management
- Edit hero section title and description
- Update mission statement
- Manage feature descriptions
- Save changes to `data/content.json`

**API Endpoint**: `POST /api/content.php`

### 3. Videos Management
- View all featured videos
- Manage video titles and descriptions
- Upload video links
- Videos stored in `data/videos.json`

**API Endpoint**: `GET /api/videos.php`, `POST /api/videos.php`

### 4. Image Upload
- Upload images via admin panel
- Supports: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Images stored in `images/uploads/`

**API Endpoint**: `POST /api/upload/image.php`

## Authentication APIs

### Login
```bash
POST /api/auth/login.php
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "sessionId": "abc123...",
  "admin": {
    "username": "admin",
    "email": "admin@encountercoffee.com"
  }
}
```

### Verify Session
```bash
POST /api/auth/verify.php
Content-Type: application/json

{
  "sessionId": "abc123..."
}
```

### Logout
```bash
POST /api/auth/logout.php
Content-Type: application/json

{
  "sessionId": "abc123..."
}
```

## Session Management

- Sessions stored in `data/sessions.json`
- Session duration: 24 hours
- Sessions automatically cleaned up on login/verify
- Expired sessions removed after 24 hours
- Session IDs are secure 64-character hex strings

## Data Files

### `/data/admin.json`
Contains admin credentials (password is bcrypt-hashed)
```json
{
  "username": "admin",
  "password": "$2y$10$...",
  "email": "admin@encountercoffee.com"
}
```

### `/data/sessions.json`
Active admin sessions
```json
{
  "sessionId": {
    "id": "sessionId",
    "username": "admin",
    "email": "admin@encountercoffee.com",
    "createdAt": "2024-01-01T12:00:00+00:00",
    "lastActivity": "2024-01-01T12:30:00+00:00",
    "expiresAt": "2024-01-02T12:00:00+00:00"
  }
}
```

### `/data/content.json`
Website content (hero, mission, features)

### `/data/videos.json`
Featured videos list

### `/data/reviews.json`
Customer reviews

## Security

### Password Hashing
- Admin password stored using bcrypt (PASSWORD_BCRYPT)
- Passwords never transmitted in plain text
- HTTPS recommended for production

### Session Protection
- Session IDs are cryptographically random (32 bytes = 64 hex chars)
- Sessions expire after 24 hours
- Session verification prevents unauthorized access

### File Upload Security
- Only allowed file types: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Files stored outside web root (in `images/uploads/`)
- Unique filenames prevent conflicts and traversal attacks

### CORS Headers
- Configured in `.htaccess`
- Allows admin panel to make API requests
- Restricts to same-origin in production

## Deployment Checklist

- [ ] Change admin password from `admin123` to secure password
- [ ] Verify `/data/` directory has write permissions (755 or 777)
- [ ] Verify `/images/uploads/` directory has write permissions
- [ ] Set PHP error logging (don't display errors to users)
- [ ] Enable HTTPS/SSL
- [ ] Test login and all admin features
- [ ] Backup `data/` directory regularly
- [ ] Monitor `/data/sessions.json` for growth (auto-cleaned)

## API Response Format

All APIs follow standard JSON response format:

Success (200, 201):
```json
{
  "success": true,
  "message": "Action successful",
  "data": {}
}
```

Error (400, 401, 500):
```json
{
  "success": false,
  "message": "Error description"
}
```

## Troubleshooting

### "Login page loops to dashboard"
- Session is still valid. Clear browser localStorage.

### "Permission denied when uploading"
- Verify `/images/uploads/` directory exists and has write permissions (777).

### "Can't access /api endpoints"
- Verify Apache has `mod_headers` enabled
- Check `.htaccess` CORS headers are being applied

### "Session expires too quickly"
- Session duration is 24 hours. Log in again if needed.
- For longer sessions, modify `strtotime('+24 hours')` in `api/auth/login.php`

## Future Enhancements

- [ ] Change admin password interface
- [ ] Email notifications for new reviews
- [ ] Review approval workflow
- [ ] Analytics dashboard
- [ ] Bulk review export (CSV/Excel)
- [ ] Two-factor authentication
- [ ] Audit logs for admin actions
