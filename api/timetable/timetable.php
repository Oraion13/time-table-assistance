<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Timetables.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Timetable_api extends Timetables
{
    private $Timetable;

    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for timetables table to do operations
        $this->Timetable = new Timetables($db);
    }
    // Get all data
    public function get()
    {
        // Get the time table from DB
        $all_data = $this->Timetable->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no time tables found');
            die();
        }
    }

    // Get all data of a time table by ID
    public function get_by_id($id)
    {
        // Get the time table from DB
        $this->Timetable->timetable_id = $id;
        $all_data = $this->Timetable->read_row();

        if ($all_data) {
            echo json_encode($all_data);
            die();
        } else {
            send(400, 'error', 'no time table found');
            die();
        }
    }

    // POST a new time table
    public function post()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        // Clean the data
        $this->Timetable->academic_year_from = $data->academic_year_from;
        $this->Timetable->academic_year_to = $data->academic_year_to;
        $this->Timetable->department_id = $data->department_id;
        $this->Timetable->semester = $data->semester;

        // Get the time table from DB
        $all_data = $this->Timetable->read_single();

        // If no time table exists
        if (!$all_data) {
            // If no time table exists, insert and get_by_id the data
            if ($this->Timetable->post()) {
                $row = $this->Timetable->read_single();

                echo json_encode(
                    array(
                        'timetable_id' => $row['timetable_id'],
                        'academic_year_from' => $row['academic_year_from'],
                        'academic_year_to' => $row['academic_year_to'],
                        'department_id' => $row['department_id'],
                        'semester' => $row['semester']
                    )
                );
            } else {
                send(400, 'error', 'time table cannot be created');
            }
        } else {
            send(400, 'error', 'time table already exists');
        }
    }

    // UPDATE existing time table
    public function update_by_id($DB_data, $to_update, $update_str)
    {
        if (strcmp($DB_data, $to_update) !== 0) {
            if (!$this->Timetable->update_row($update_str)) {
                // If can't update_by_id the data, throw an error message
                send(400, 'error', $update_str . ' cannot be updated');
                die();
            }
        }
    }

    // UPDATE (PUT) a existing user's info
    public function put()
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'pass a time table id');
            die();
        }

        // Clean the data
        $this->Timetable->timetable_id = $_GET['ID']; // should pass the time table id in URL
        $this->Timetable->academic_year_to = $data->academic_year_to;
        $this->Timetable->academic_year_from = $data->academic_year_from;
        $this->Timetable->department_id = $data->department_id;
        $this->Timetable->semester = $data->semester;

        // Get the time table from DB
        $all_data = $this->Timetable->read_row();

        // If time table already exists, update the time table that changed
        if ($all_data) {
            $this->update_by_id($all_data['academic_year_to'], $data->academic_year_to, 'academic_year_to');
            $this->update_by_id($all_data['academic_year_from'], $data->academic_year_from, 'academic_year_from');
            $this->update_by_id($all_data['department_id'], $data->department_id, 'department_id');
            $this->update_by_id($all_data['semester'], $data->semester, 'semester');

            // If updated successfully, get_by_id the data, else throw an error message 
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'no time table found for ID: ' . $_GET['ID']);
        }
    }

    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, 'error', 'pass a time table id');
            die();
        }
        $this->Timetable->timetable_id = $_GET['ID']; // should pass the time table id in URL

        // Check for time table existance
        $all_data = $this->Timetable->read_row();

        if(!$all_data){
            send(400, 'error', 'no time table found for ID: ' . $_GET['ID']);
            die();
        }

        if ($this->Timetable->delete_row()) {
            send(200, 'message', 'time table deleted successfully');
        } else {
            send(400, 'error', 'time table cannot be deleted');
        }
    }
}


// GET all the time table
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Timetable_api = new Timetable_api();
    if (isset($_GET['ID'])) {
        $Timetable_api->get_by_id($_GET['ID']);
    } else {
        $Timetable_api->get();
    }
}

// To check if admin is logged in
loggedin();

// If a admin logged in ...

// POST a new time table
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $Timetable_api = new Timetable_api();
    $Timetable_api->post();
}

// UPDATE (PUT) a existing time table
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Timetable_api = new Timetable_api();
    $Timetable_api->put();
}

// DELETE a existing time table
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Timetable_api = new Timetable_api();
    $Timetable_api->delete_by_id();
}
