<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Subject_allocations.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Positions_prev_api extends Subject_allocation
{
    private $Subject_allocation;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for users table to do operations
        $this->Subject_allocation = new Subject_allocation($db);
    }


    // Get all data
    public function get()
    {
        // Get all the info from DB
        $all_data = $this->Subject_allocation->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no subjects allocated');
            die();
        }
    }

    // Get all the data by ID
    public function get_by_id($id)
    {
        // Get the user info from DB
        $this->Subject_allocation->timetable_id = $id;
        $all_data = $this->Subject_allocation->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no subjects allocated for: ' . $id);
            die();
        }
    }

    // POST a new subject allocation
    public function post()
    {
        if (!$this->Subject_allocation->post()) {
            // If can't post the data, throw an error message
            send(400, 'error', 'unable to allocate subject');
            die();
        }
    }

    // PUT a subject allocation
    public function update_by_id($DB_data, $to_update, $update_str)
    {
        if (strcmp($DB_data, $to_update) !== 0) {
            if (!$this->Subject_allocation->update_row($update_str)) {
                // If can't update_row the data, throw an error message
                send(400, 'error', $update_str . ' cannot be updated');
                die();
            }
        }
    }

    // DELETE a subject allocation
    public function delete_by_id()
    {
        if (!$this->Subject_allocation->delete_row()) {
            // If can't delete the data, throw an error message
            send(400, 'error', 'data cannot be deleted');
            die();
        }
    }

    // POST/UPDATE (PUT)/DELETE a allocated subject
    public function put($id)
    {
        // Get input data as json
        $data = json_decode(file_get_contents("php://input"));

        // Get all the subject allocation info from DB
        $this->Subject_allocation->timetable_id = $id;
        $all_data = $this->Subject_allocation->read_row();

        // Store all subject_allocation_id's in an array
        $DB_data = array();
        $data_IDs = array();
        while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
            array_push($DB_data, $row);
        }

        // Insert the data which has no ID
        $count = 0;
        while ($count < count($data)) {
            // Clean the data
            $this->Subject_allocation->subject_allocation_id = $data[$count]->subject_allocation_id;
            $this->Subject_allocation->subject_id = $data[$count]->subject_id;
            $this->Subject_allocation->faculty_id = $data[$count]->faculty_id;

            if ($data[$count]->subject_allocation_id === 0) {
                $this->post();
                array_splice($data, $count, 1);
                continue;
            }

            // Store the IDs
            array_push($data_IDs, $data[$count]->subject_allocation_id);

            ++$count;
        }

        // Delete the data which is abandoned
        $count = 0;
        while ($count < count($DB_data)) {
            if (!in_array($DB_data[$count]['subject_allocation_id'], $data_IDs)) {
                $this->Subject_allocation->subject_allocation_id = (int)$DB_data[$count]['subject_allocation_id'];
                $this->delete_by_id();
            }

            ++$count;
        }

        // Update the data which is available
        $count = 0;
        while ($count < count($data)) {
            // Clean the data
            // print_r($row);
            foreach ($DB_data as $key => $element) {
                if ($element['subject_allocation_id'] == $data[$count]->subject_allocation_id) {
                    $this->Subject_allocation->subject_allocation_id = $element['subject_allocation_id'];
                    $this->Subject_allocation->subject_id = $data[$count]->subject_id;
                    $this->Subject_allocation->faculty_id = $data[$count]->faculty_id;

                    $this->update_by_id($element['subject_id'], $data[$count]->subject_id, 'subject_id');
                    $this->update_by_id($element['faculty_id'], $data[$count]->faculty_id, 'faculty_id');

                    break;
                }
            }


            ++$count;
        }

        $this->get_by_id($id);
    }
}

// GET all the user's previous positions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Positions_prev_api = new Positions_prev_api();
    if (isset($_GET['ID'])) {
        $Positions_prev_api->get_by_id($_GET['ID']);
    } else {
        $Positions_prev_api->get();
    }
}

// To check if an user is logged in and verified
loggedin();

// If a user logged in ...

// POST/UPDATE (PUT) a user's previous positions
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Positions_prev_api = new Positions_prev_api();
    if (isset($_SESSION['timetable_id'])) {
        $Positions_prev_api->put($_SESSION['timetable_id']);
    } else {
        $Positions_prev_api->put($_GET['ID']);
    }
}
