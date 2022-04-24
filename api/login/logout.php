<?php

session_start();

require_once '../../utils/send.php';

class Logout_api
{
    // GET for logout
    public function get()
    {
        $username = $_SESSION['admin_name'];

        // destroy the SESSION after logging out
        session_unset();
        session_destroy();

        send(200, 'message', $username . ' logged out');
    }
}

// To check if an user is already logged in
if (!isset($_SESSION['admin_name'])) {
    send(400, 'error', 'no user logged in');
    die();
}

// GET for logout
$Logout_api = new Logout_api();
$Logout_api->get();
