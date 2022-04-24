<?php

// send the status code and message
function send($status, $notification, $message)
{
    header($_SERVER["SERVER_PROTOCOL"] . ' ' . $status, true, $status);
    echo json_encode(
        array($notification => $message)
    );
}
