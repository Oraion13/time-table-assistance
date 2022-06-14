<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../utils/send.php';
require_once '../../models/Lab_table.php';

class Lab_table_api extends Lab_table
{
    private $Lab;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object to do operations
        $this->Lab = new Lab_table($db);

    }

    // Get all data
    public function get($id, $id1)
    {
        $this->Lab->department_id = $id;
        $this->Lab->category_id = $id1;
        // Get the subjects from DB
        $all_data = $this->Lab->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no lab time table found');
            die();
        }
    }
}

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Lab_table_api = new Lab_table_api();
    if (isset($_GET['dept']) && isset($_GET['cat'])) {
        $Lab_table_api->get($_GET['dept'], $_GET['cat']);
    }else{
        send(400, 'error', 'provide a department and category ID');
    }
}
