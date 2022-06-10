<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Time_day.php';
require_once '../../models/Subject_allocations.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Time_day_api extends Time_day
{
    private $Time_day;
    private $Subject_allocation;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for time_day table to do operations
        $this->Time_day = new Time_day($db);
        $this->Subject_allocation = new Subject_allocation($db);
    }


    // Get all data
    public function get()
    {
        // Get all the info from DB
        $all_data = $this->Time_day->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no periods allocated');
            die();
        }
    }

    // Get all the data by ID
    public function get_by_id($id)
    {
        // Get the user info from DB
        $this->Time_day->timetable_id = $id;
        $all_data = $this->Time_day->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no periods allocated for: ' . $id);
            die();
        }
    }

    // Ordinal conversion
    private function ordinal_suffix_of($i)
    {
        $j = $i % 10;
        $k = $i % 100;
        if ($j == 1 && $k != 11) {
            return $i . "st";
        }
        if ($j == 2 && $k != 12) {
            return $i . "nd";
        }
        if ($j == 3 && $k != 13) {
            return $i . "rd";
        }
        return $i . "th";
    }

    // Check for collision
    private function collosion($subject_allocation_id, $day, $time)
    {
        $days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        // Get faculty id from subject allocations table
        $this->Subject_allocation->subject_allocation_id = $subject_allocation_id;
        $faculty_id = $this->Subject_allocation->read_only_row();

        // $this->Time_day->faculty_id = $faculty['faculty_id'];
        $all_day = $this->Time_day->read_single();

        $faculty_ids = array();
        while ($row = $all_day->fetch(PDO::FETCH_ASSOC)) {
            $this->Subject_allocation->subject_allocation_id = $row['subject_allocation_id'];
            $faculty = $this->Subject_allocation->read_only_row();

            array_push($faculty_ids, $faculty['faculty_id']);
        }

        
        if (in_array($faculty_id['faculty_id'], $faculty_ids)) {
            // send(400, "error", $faculty['faculty'] . ' already had a period at '
            //     . $days[$day] . ': ' . $this->ordinal_suffix_of($time) . ' hour');
            // die();
            return  ' <i class="fa-solid fa-triangle-exclamation"></i> Warning: ' . $faculty['faculty'] . ' already had a period at '
                . $days[$day] . ': ' . $this->ordinal_suffix_of($time) . ' hour<br>';
        }

        return "";

        // return true;
    }

    // POST a new period
    public function post()
    {
        if (!$this->Time_day->post()) {
            // If can't post the data, throw an error message
            send(400, 'error', 'unable to allocate period');
            die();
        }
    }

    // PUT a period
    public function update_by_id($DB_data, $to_update, $update_str)
    {
        if (strcmp($DB_data, $to_update) !== 0) {
            if (!$this->Time_day->update_row($update_str)) {
                // If can't update_row the data, throw an error message
                send(400, 'error', $update_str . ' cannot be updated');
                die();
            }
        }
    }

    // DELETE a period
    public function delete_by_id()
    {
        if (!$this->Time_day->delete_row()) {
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

        // Get all the period info from DB
        $this->Time_day->timetable_id = $id;
        $all_data = $this->Time_day->read_row();

        // Store all time_day_id's in an array
        $DB_data = array();
        $data_IDs = array();
        while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
            array_push($DB_data, $row);
        }

        // Store the IDs from data
        $count = 0;
        while ($count < count($data)) {
            if ($data[$count]->time_day_id !== 0) {
                array_push($data_IDs, $data[$count]->time_day_id);
            }

            ++$count;
        }

        // Delete the data which is abandoned
        $count = 0;
        while ($count < count($DB_data)) {
            if (!in_array($DB_data[$count]['time_day_id'], $data_IDs)) {
                $this->Time_day->time_day_id = (int)$DB_data[$count]['time_day_id'];
                $this->delete_by_id();
            }

            ++$count;
        }

        // update all time_day_id's in the array
        $all_data = $this->Time_day->read_row();
        $DB_data = array();
        while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
            array_push($DB_data, $row);
        }

        // Update the data which is available
        $count = 0;
        $message = "";
        while ($count < count($data)) {
            // Clean the data
            foreach ($DB_data as $key => $element) {
                if ($data[$count]->time_day_id !== 0 && $element['time_day_id'] == $data[$count]->time_day_id) {
                    $this->Time_day->time_day_id = $element['time_day_id'];
                    $this->Time_day->day = $data[$count]->day;
                    $this->Time_day->time = $data[$count]->time;
                    $this->Time_day->subject_allocation_id = $data[$count]->subject_allocation_id;

                    if (strcmp($element['day'], $data[$count]->day) !== 0) {
                        // if (
                            if($message .= $this->collosion($data[$count]->subject_allocation_id, $data[$count]->day, $data[$count]->time)){
                                
                            }else{
                                $this->Time_day->update_row('day');
                            }
                        // ) {
                            // If can't update_row the data, throw an error message
                            // send(400, 'error', 'day' . ' cannot be updated');
                            // die();
                        // }
                    }

                    if (strcmp($element['time'], $data[$count]->time) !== 0) {
                        // if (
                            if($message .= $this->collosion($data[$count]->subject_allocation_id, $data[$count]->day, $data[$count]->time)){

                            }else{
                                $this->Time_day->update_row('time');
                            }
                            
                        // ) {
                            // If can't update_row the data, throw an error message
                            // send(400, 'error', 'time' . ' cannot be updated');
                            // die();
                        // }
                    }

                    if (strcmp($element['subject_allocation_id'], $data[$count]->subject_allocation_id) !== 0) {
                        // if (
                            if($message .= $this->collosion($data[$count]->subject_allocation_id, $data[$count]->day, $data[$count]->time)){

                            }else{
                                $this->Time_day->update_row('subject_allocation_id');
                            }
                            
                        // ) {
                            // If can't update_row the data, throw an error message
                            // send(400, 'error', 'subject_allocation_id' . ' cannot be updated');
                            // die();
                        // }
                    }
                    break;
                }
            }


            ++$count;
        }

        // Insert the data which has no ID
        $count = 0;
        while ($count < count($data)) {
            // Clean the data
            $this->Time_day->time_day_id = $data[$count]->time_day_id;
            $this->Time_day->day = $data[$count]->day;
            $this->Time_day->time = $data[$count]->time;
            $this->Time_day->subject_allocation_id = $data[$count]->subject_allocation_id;

            if ($data[$count]->time_day_id == 0) {
                // Check for collision
                // if (
                    if($message .= $this->collosion($data[$count]->subject_allocation_id, $data[$count]->day - 1, $data[$count]->time)){

                    }else{
                       // If no collision
                    $this->post(); 
                    }
                    // ) {
                    
                    array_splice($data, $count, 1);
                    continue;
                }
            // }
            ++$count;
        }

        if($message){
            send(400, 'error', $message);
            die();
        }

        $this->get_by_id($id);
    }
}

// GET all the user's previous positions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Time_day_api = new Time_day_api();
    if (isset($_GET['ID'])) {
        $Time_day_api->get_by_id($_GET['ID']);
    } else {
        $Time_day_api->get();
    }
}

// To check if an user is logged in and verified
loggedin();

// If a user logged in ...

// POST/UPDATE (PUT) a user's previous positions
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Time_day_api = new Time_day_api();
    $Time_day_api->put($_GET['ID']);
}