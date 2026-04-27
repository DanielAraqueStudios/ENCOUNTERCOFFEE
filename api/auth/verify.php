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
$sessionsFile = $dataDir . '/sessions.json';

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['sessionId'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Session ID required'
    ]);
    exit;
}

$sessionId = $input['sessionId'];

// Verify session
if (!file_exists($sessionsFile)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid session'
    ]);
    exit;
}

$sessions = json_decode(file_get_contents($sessionsFile), true) ?? [];

if (!isset($sessions[$sessionId])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Session not found'
    ]);
    exit;
}

$session = $sessions[$sessionId];

// Check if session expired
if (strtotime($session['expiresAt']) < time()) {
    unset($sessions[$sessionId]);
    file_put_contents($sessionsFile, json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Session expired'
    ]);
    exit;
}

// Update last activity
$session['lastActivity'] = date('c');
$sessions[$sessionId] = $session;
file_put_contents($sessionsFile, json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Session valid',
    'admin' => [
        'username' => $session['username'],
        'email' => $session['email']
    ]
]);
