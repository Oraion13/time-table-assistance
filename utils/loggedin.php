<?php

function loggedin(){
    if (!isset($_SESSION['admin_id'])) {
        send(400, 'error', 'admin not logged in');
        die();
    }
}