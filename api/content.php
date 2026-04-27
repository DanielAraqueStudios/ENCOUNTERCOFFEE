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
$contentFile = $dataDir . '/content.json';

$defaultContent = [
    'indexHero' => [
        'mode' => 'image',
        'text' => '',
        'backgroundImage' => 'images/Home/Fotos_a_usar/Frase2.jpg',
        'titleImage' => 'images/Home/Logos/Frase%20home.png'
    ],
    'indexProducts' => [
        ['id' => 'pods', 'name' => 'Pods', 'image' => 'images/products/10_pods.jpg', 'link' => 'shop.html'],
        ['id' => 'drips', 'name' => 'Drips', 'image' => 'images/products/drips.jpg', 'link' => 'shop.html'],
        ['id' => 'coffee-bag', 'name' => 'Coffee Bag', 'image' => 'images/products/grano_entero.jpg', 'link' => 'shop.html']
    ],
    'whatWeDo' => [
        'heroImages' => [
            'scene1_img1' => 'images/Home/Fotos_a_usar/Frase 3.jpg',
            'scene1_img2' => 'images/Home/Fotos_a_usar/Frase1.JPG',
            'scene2_bg' => 'images/Home/Fotos_a_usar/Frase 3.jpg',
            'scene2_panel1' => 'images/Home/Logos/Frase 2 - pagina web.png',
            'scene2_panel2' => 'images/Home/Logos/Frase home.png'
        ],
        'team' => [
            'victor' => ['image' => 'images/victor.jpg', 'bio' => ''],
            'johnBlanca' => ['image' => 'images/image00006.jpeg', 'bio' => ''],
            'camila' => ['image' => 'images/image00003.jpeg', 'bio' => ''],
            'nico' => ['image' => 'images/image00004.jpeg', 'bio' => '']
        ]
    ],
    'hero' => [
        'title' => 'We are not just a Coffee brand',
        'subtitle' => 'and the encounter between you and those who make it possible.',
        'cta' => 'BE PART OF THE CHANGE'
    ],
    'mission' => [
        'title' => 'Our Mission',
        'description' => 'We exist to transform the coffee industry—placing farmers first, and proving that exceptional quality can be achieved while doing things the right way.'
    ],
    'features' => [
        'sustainable' => 'Sustainable farming practices',
        'quality' => 'Premium quality coffee',
        'community' => 'Community focused'
    ]
];

if (!file_exists($contentFile)) {
    file_put_contents($contentFile, json_encode($defaultContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $content = json_decode(file_get_contents($contentFile), true) ?? $defaultContent;

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'content' => $content
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
    if (!file_exists($sessionsFile)) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid session'
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

    $currentContent = json_decode(file_get_contents($contentFile), true) ?? $defaultContent;

    if (isset($input['content'])) {
        $newContent = $input['content'];

        if (isset($newContent['indexHero'])) {
            $currentContent['indexHero'] = array_merge($currentContent['indexHero'] ?? [], $newContent['indexHero']);
        }

        if (isset($newContent['indexProducts'])) {
            $currentContent['indexProducts'] = $newContent['indexProducts'];
        }

        if (isset($newContent['whatWeDo'])) {
            if (!isset($currentContent['whatWeDo'])) {
                $currentContent['whatWeDo'] = [];
            }
            if (isset($newContent['whatWeDo']['heroImages'])) {
                $currentContent['whatWeDo']['heroImages'] = array_merge(
                    $currentContent['whatWeDo']['heroImages'] ?? [],
                    $newContent['whatWeDo']['heroImages']
                );
            }
            if (isset($newContent['whatWeDo']['team'])) {
                if (!isset($currentContent['whatWeDo']['team'])) {
                    $currentContent['whatWeDo']['team'] = [];
                }
                foreach ($newContent['whatWeDo']['team'] as $key => $teamMember) {
                    if (!isset($currentContent['whatWeDo']['team'][$key])) {
                        $currentContent['whatWeDo']['team'][$key] = [];
                    }
                    $currentContent['whatWeDo']['team'][$key] = array_merge(
                        $currentContent['whatWeDo']['team'][$key],
                        $teamMember
                    );
                }
            }
        }

        file_put_contents($contentFile, json_encode($currentContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Content updated',
        'content' => $currentContent
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
