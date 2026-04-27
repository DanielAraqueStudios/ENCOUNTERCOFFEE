<?php
/**
 * Health check endpoint
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$reviewsFile = dirname(dirname(__FILE__)) . '/data/reviews.json';

echo json_encode([
    'status' => 'ok',
    'message' => 'Encounter Coffee Reviews API is running',
    'backend' => 'PHP',
    'reviewsFile' => 'data/reviews.json',
    'fileExists' => file_exists($reviewsFile),
    'timestamp' => date('c')
]);
?>
