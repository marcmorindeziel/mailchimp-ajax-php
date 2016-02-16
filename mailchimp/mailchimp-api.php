<?php
include './mailchimp-credentials.php';

//GET POST DATA
$data = json_decode(file_get_contents('php://input'), true);
$data['status'] = 'subscribed';

function syncMailchimp($apiKey, $listId, $data) {
    $memberId = md5(strtolower($data['email']));
    $dataCenter = substr($apiKey,strpos($apiKey,'-')+1);
    $url = 'https://' . $dataCenter . '.api.mailchimp.com/3.0/lists/' . $listId . '/members/'.$memberId;

    $json = json_encode([
        'email_address' => $data['email'],
        'status' => $data['status'], // "subscribed","unsubscribed","cleaned","pending"
        'merge_fields'  => $data

    ]);

    $headers[] = 'Content-Type: application/json';
    $headers[] = 'Content-Length: ' . strlen($json);

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");

    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlInfo = curl_getinfo($ch);

    curl_close($ch);

    return array(
        'status'=>$httpCode
//        'result'=>json_decode(stripslashes($result)),
//        'curlInfo'=> $curlInfo
    );
}

//EXECUTE
$ret = syncMailchimp($apiKey, $listId, $data);
header('Content-Type: application/json');
http_response_code(($ret['status']===0)?401:$ret['status']);

echo json_encode($ret);

die();