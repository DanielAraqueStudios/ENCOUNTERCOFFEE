<?php
/**
 * Encounter Coffee Reviews API
 * Pure PHP backend (no npm/Node.js required)
 * Runs on any shared hosting with PHP support
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle OPTIONS requests (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Data directory and file
$dataDir = dirname(__DIR__) . '/data';
$reviewsFile = $dataDir . '/reviews.json';

// Ensure data directory exists
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Initialize reviews file if it doesn't exist
if (!file_exists($reviewsFile)) {
    file_put_contents($reviewsFile, json_encode([]));
}

/**
 * Read reviews from file
 */
function getReviews() {
    global $reviewsFile;
    try {
        $data = file_get_contents($reviewsFile);
        return json_decode($data, true) ?: [];
    } catch (Exception $e) {
        error_log('Error reading reviews: ' . $e->getMessage());
        return [];
    }
}

/**
 * Save reviews to file
 */
function saveReviews($reviews) {
    global $reviewsFile;
    try {
        $json = json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return file_put_contents($reviewsFile, $json) !== false;
    } catch (Exception $e) {
        error_log('Error saving reviews: ' . $e->getMessage());
        return false;
    }
}

/**
 * GET /api/reviews - Fetch reviews with pagination
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $page = max(1, isset($_GET['page']) ? intval($_GET['page']) : 1);
        $perPage = max(1, isset($_GET['perPage']) ? intval($_GET['perPage']) : 3);

        $reviews = getReviews();

        // Sort by date (newest first)
        usort($reviews, function($a, $b) {
            $dateA = isset($a['date']) ? strtotime($a['date']) : 0;
            $dateB = isset($b['date']) ? strtotime($b['date']) : 0;
            return $dateB - $dateA;
        });

        $total = count($reviews);
        $totalPages = max(1, ceil($total / $perPage));
        $validPage = min($page, $totalPages);

        $start = ($validPage - 1) * $perPage;
        $paginated = array_slice($reviews, $start, $perPage);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'reviews' => $paginated,
            'currentPage' => $validPage,
            'totalPages' => $totalPages,
            'totalReviews' => $total,
            'perPage' => $perPage
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching reviews',
            'error' => $e->getMessage()
        ]);
    }
    exit();
}

/**
 * POST /api/reviews - Submit new review or manage reviews (admin)
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        // Check if this is an admin action (delete or reorder)
        if (isset($input['sessionId'])) {
            $dataDir = dirname(__DIR__) . '/data';
            $sessionsFile = $dataDir . '/sessions.json';
            $sessions = json_decode(file_get_contents($sessionsFile), true) ?? [];

            if (!isset($sessions[$input['sessionId']])) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid session'
                ]);
                exit();
            }

            // Admin delete review
            if (isset($input['action']) && $input['action'] === 'delete' && isset($input['reviewId'])) {
                $reviews = getReviews();
                $reviews = array_filter($reviews, function($r) use ($input) {
                    return $r['id'] !== $input['reviewId'];
                });
                $reviews = array_values($reviews);

                if (!saveReviews($reviews)) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Failed to delete review']);
                    exit();
                }

                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Review deleted']);
                exit();
            }

            // Admin reorder reviews
            if (isset($input['action']) && $input['action'] === 'reorder' && isset($input['reviews'])) {
                if (!saveReviews($input['reviews'])) {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Failed to reorder reviews']);
                    exit();
                }

                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Reviews reordered']);
                exit();
            }
        }

        // Regular review submission (public)
        $name = isset($input['name']) ? trim($input['name']) : null;
        $review = isset($input['review']) ? trim($input['review']) : null;
        $rating = isset($input['rating']) ? $input['rating'] : null;

        if (empty($name) || empty($review) || $rating === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Missing required fields: name, review, rating'
            ]);
            exit();
        }

        $ratingNum = intval($rating);
        if ($ratingNum < 1 || $ratingNum > 5) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Rating must be between 1 and 5'
            ]);
            exit();
        }

        $reviews = getReviews();

        $newReview = [
            'id' => 'review_' . time() . '_' . substr(md5(rand()), 0, 9),
            'name' => substr(trim(strval($name)), 0, 100),
            'review' => substr(trim(strval($review)), 0, 1000),
            'rating' => $ratingNum,
            'date' => date('c')
        ];

        $reviews[] = $newReview;
        if (!saveReviews($reviews)) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save review'
            ]);
            exit();
        }

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Review submitted successfully',
            'review' => $newReview
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error submitting review',
            'error' => $e->getMessage()
        ]);
    }
    exit();
}

// Invalid request method
http_response_code(405);
echo json_encode([
    'success' => false,
    'message' => 'Method not allowed'
]);
?>
