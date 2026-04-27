<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/../../data';
$adminFile = $dataDir . '/admin.json';
$sessionsFile = $dataDir . '/sessions.json';

// Default admin credentials (change in production!)
$defaultAdmin = [
    'username' => 'admin',
    'password' => password_hash('admin123', PASSWORD_BCRYPT), // Hash: admin123
    'email' => 'admin@encountercoffee.com'
];

// Initialize admin file if doesn't exist
if (!file_exists($adminFile)) {
    file_put_contents($adminFile, json_encode($defaultAdmin, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Username and password required'
    ]);
    exit;
}

$username = trim($input['username']);
$password = trim($input['password']);

// Read admin credentials
$admin = json_decode(file_get_contents($adminFile), true) ?? $defaultAdmin;

// Verify credentials
if ($username !== $admin['username'] || !password_verify($password, $admin['password'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid credentials'
    ]);
    exit;
}

// Create session
$sessionId = bin2hex(random_bytes(32));
$sessionData = [
    'id' => $sessionId,
    'username' => $admin['username'],
    'email' => $admin['email'],
    'createdAt' => date('c'),
    'lastActivity' => date('c'),
    'expiresAt' => date('c', strtotime('+24 hours'))
];

// Save session
$sessions = [];
if (file_exists($sessionsFile)) {
    $existingSessions = json_decode(file_get_contents($sessionsFile), true) ?? [];
    // Remove expired sessions
    $sessions = array_filter($existingSessions, function($s) {
        return strtotime($s['expiresAt']) > time();
    });
}
$sessions[$sessionId] = $sessionData;
file_put_contents($sessionsFile, json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'sessionId' => $sessionId,
    'admin' => [
        'username' => $admin['username'],
        'email' => $admin['email']
    ]
]);
