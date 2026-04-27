<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$dataDir = __DIR__ . '/../../data';
$sessionsFile = $dataDir . '/sessions.json';

// Verify session (admin only)
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['sessionId']) || empty($input['sessionId'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Authentication required'
    ]);
    exit;
}

$sessions = json_decode(file_get_contents($sessionsFile), true) ?? [];

if (!isset($sessions[$input['sessionId']])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid session'
    ]);
    exit;
}

// Check if file was uploaded via multipart (this requires form-data, not JSON)
if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No image file provided'
    ]);
    exit;
}

$file = $_FILES['image'];
$uploadDir = __DIR__ . '/../../images/uploads/';

// Create uploads directory if doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Validate file
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP allowed'
    ]);
    exit;
}

$maxSize = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'File too large. Maximum 5MB allowed'
    ]);
    exit;
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'img_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'filename' => $filename,
        'url' => '/images/uploads/' . $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save uploaded file'
    ]);
}
