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
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Session ID required'
    ]);
    exit;
}

$sessionId = $input['sessionId'];

// Remove session
if (file_exists($sessionsFile)) {
    $sessions = json_decode(file_get_contents($sessionsFile), true) ?? [];
    unset($sessions[$sessionId]);
    file_put_contents($sessionsFile, json_encode($sessions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Logout successful'
]);
