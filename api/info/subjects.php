<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../utils/send.php';
require_once '../../models/Info.php';

class Subjects_api extends Info
{
    private $Subjects;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for timetable_subjects table to do operations
        $this->Subjects = new Info($db);

        // Set table name
        $this->Subjects->table = "timetable_subjects";
    }

    // Get all data
    public function get()
    {
        // Get the subjects from DB
        $all_data = $this->Subjects->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no subjects found');
            die();
        }
    }

    // Get all the data by dept_id
    public function get_dept()
    {
        // Get the user info from DB
        $this->Subjects->department_id = $_GET['dept'];
        $all_data = $this->Subjects->read_by_dept();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no subjects found');
            die();
        }
    }

    // Get all the data by semester
    public function get_sem()
    {
        // Get the user info from DB
        $this->Subjects->semester = $_GET['sem'];
        $all_data = $this->Subjects->read_by_sem();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no subjects found');
            die();
        }
    }

    // Get all the data by dept_id and semester
    public function get_dept_sem()
    {
        // Get the user info from DB
        $this->Subjects->department_id = $_GET['dept'];
        $this->Subjects->semester = $_GET['sem'];
        $all_data = $this->Subjects->read_by_dept_sem();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no subjects found');
            die();
        }
    }
}

// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Subjects_api = new Subjects_api();
    if (isset($_GET['dept']) && isset($_GET['sem']) && $_GET['dept'] != 0 && $_GET['sem'] != 0) {
        $Subjects_api->get_dept_sem();
    } else if(isset($_GET['sem']) && $_GET['sem'] != 0) {
        $Subjects_api->get_sem();
    }else if(isset($_GET['dept']) && $_GET['dept'] != 0) {
        $Subjects_api->get_dept();
    }else{
        $Subjects_api->get();
    }
}
