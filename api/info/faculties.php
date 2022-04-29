<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../utils/send.php';
require_once '../../models/Info.php';

class Faculties_api extends Info
{
    private $Faculties;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for timetable_faculties table to do operations
        $this->Faculties = new Info($db);

        // Set table name
        $this->Faculties->table = "timetable_faculties";
    }

    // Get all data
    public function get()
    {
        // Get the faculties from DB
        $all_data = $this->Faculties->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no faculties found');
            die();
        }
    }

    // Get all the data by dept_id
    public function get_dept()
    {
        // Get the user info from DB
        $this->Faculties->department_id = $_GET['dept'];
        $all_data = $this->Faculties->read_by_dept();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no faculties found');
            die();
        }
    }
}

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Faculties_api = new Faculties_api();
    if (isset($_GET['dept'])) {
        $Faculties_api->get_dept();
    } else {
        $Faculties_api->get();
    }
}
