<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../utils/send.php';
require_once '../../models/Faculty_table.php';

class Faculty_table_api extends Faculty_table
{
    private $Faculty;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object to do operations
        $this->Faculty = new Faculty_table($db);

    }

    // Get all data
    public function get($id)
    {
        $this->Faculty->faculty_id = $id;
        // Get the subjects from DB
        $all_data = $this->Faculty->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no faculty time table found');
            die();
        }
    }
}

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Faculty_table_api = new Faculty_table_api();
    if (isset($_GET['faculty'])) {
        $Faculty_table_api->get($_GET['faculty']);
    }else{
        send(400, 'error', 'provide a faculty ID');
    }
}
