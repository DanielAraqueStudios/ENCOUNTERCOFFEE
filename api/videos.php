<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/../data';
$videosFile = $dataDir . '/videos.json';

// Default videos structure
$defaultVideos = [
    'featured' => [
        [
            'id' => 1,
            'title' => 'Our Story',
            'description' => 'How Encounter Colombian Coffee started',
            'url' => 'https://youtube.com/embed/dQw4w9WgXcQ',
            'thumbnail' => 'images/Home/Fotos_a_usar/video-thumb-1.jpg'
        ],
        [
            'id' => 2,
            'title' => 'Farming Process',
            'description' => 'From farm to cup',
            'url' => 'https://youtube.com/embed/dQw4w9WgXcQ',
            'thumbnail' => 'images/Home/Fotos_a_usar/video-thumb-2.jpg'
        ]
    ]
];

// Initialize videos file if doesn't exist
if (!file_exists($videosFile)) {
    file_put_contents($videosFile, json_encode($defaultVideos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $videos = json_decode(file_get_contents($videosFile), true) ?? $defaultVideos;
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'videos' => $videos
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['sessionId'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required'
        ]);
        exit;
    }

    $sessionsFile = $dataDir . '/sessions.json';
    $sessions = json_decode(file_get_contents($sessionsFile), true) ?? [];

    if (!isset($sessions[$input['sessionId']])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid session'
        ]);
        exit;
    }

    $currentVideos = json_decode(file_get_contents($videosFile), true) ?? $defaultVideos;

    // Delete video
    if (isset($input['action']) && $input['action'] === 'delete' && isset($input['videoId'])) {
        $currentVideos['featured'] = array_filter($currentVideos['featured'], function($v) use ($input) {
            return $v['id'] !== $input['videoId'];
        });
        $currentVideos['featured'] = array_values($currentVideos['featured']);
        file_put_contents($videosFile, json_encode($currentVideos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Video deleted',
            'videos' => $currentVideos
        ]);
        exit;
    }

    // Add new video
    if (isset($input['action']) && $input['action'] === 'add' && isset($input['video'])) {
        $newId = 1;
        if (!empty($currentVideos['featured'])) {
            $newId = max(array_map(function($v) { return $v['id']; }, $currentVideos['featured'])) + 1;
        }

        $newVideo = [
            'id' => $newId,
            'title' => $input['video']['title'] ?? 'New Video',
            'description' => $input['video']['description'] ?? '',
            'url' => $input['video']['url'] ?? '',
            'thumbnail' => $input['video']['thumbnail'] ?? ''
        ];

        $currentVideos['featured'][] = $newVideo;
        file_put_contents($videosFile, json_encode($currentVideos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Video added',
            'videos' => $currentVideos
        ]);
        exit;
    }

    // Reorder videos
    if (isset($input['action']) && $input['action'] === 'reorder' && isset($input['videos'])) {
        $currentVideos['featured'] = $input['videos'];
        file_put_contents($videosFile, json_encode($currentVideos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Videos reordered',
            'videos' => $currentVideos
        ]);
        exit;
    }

    // Update all videos
    if (isset($input['videos'])) {
        $currentVideos = $input['videos'];
        file_put_contents($videosFile, json_encode($currentVideos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Videos updated',
        'videos' => $currentVideos
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
