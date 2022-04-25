<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Admin.php';
require_once '../../utils/send.php';

class Login_api extends Admin
{
    private $Admin;

    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for Admin table to do operations
        $this->Admin = new Admin($db);
    }

    // POST to login
    public function post()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        // Do some data cleaning
        $this->Admin->admin_name = $data->admin_name;

        // Check if the email is verified for the user
        $validate = $this->Admin->read_single();

        if ($validate) {
            // If the user has given correct crediantials, they will be logged in and a new SESSION will be started
            if (password_verify($data->password, $validate['password'])) {
                $_SESSION['admin_id'] = $validate['admin_id'];
                $_SESSION['admin_name'] = $validate['admin_name'];
                echo json_encode(
                    array(
                        'admin_id' => $validate['admin_id'],
                        'admin_name' => $validate['admin_name']
                    )
                );
            } else {
                // header('X-PHP-Response-Code: 400', true, 400);
                // header("HTTP/1.1 404 Not Found");
                send(400, 'error', 'Incorrect password');
            }
        } else {
            send(400, 'error', 'incorrect admin_name');
        }
    }
}

// To check if admin already logged in
if (isset($_SESSION['admin_id'])) {
    send(400, 'error', $_SESSION['admin_name'] . ' already logged in');
    die();
}

// POST to login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $Login_api = new Login_api();
    $Login_api->post();
}
