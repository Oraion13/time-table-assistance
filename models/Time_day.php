<?php

// Operations for 'timetable_time_day' is handeled here
class Time_day
{
    private $conn;
    private $table = 'timetable_time_day';
    private $subject_allocations = 'timetable_subject_allocations';
    private $timetables = 'timetable_timetables';
    private $subjects = 'timetable_subjects';
    private $faculties = 'timetable_faculties';

    public $time_day_id = 0;
    public $timetable_id = 0;
    public $day = 0;
    public $time = 0;
    public $subject_allocation_id = 0;
    public $subject_id = 0;
    public $faculty_id = 0;

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {
        $columns = $this->table . '.time_day_id, ' . $this->table . '.timetable_id, '
            . $this->table . '.day, ' . $this->table . '.time, ' . $this->table . '.subject_allocation_id, '
            . $this->subject_allocations . '.subject_id, ' . $this->subjects . '.subject, ' . $this->subjects . '.subject_code, '
            . $this->subject_allocations . '.faculty_id, ' . $this->faculties . '.faculty';
        $query = 'SELECT ' . $columns . ' FROM (((' . $this->table . ' INNER JOIN ' . $this->subject_allocations . ' ON '
            . $this->table . '.subject_allocation_id = ' . $this->subject_allocations . '.subject_allocation_id) INNER JOIN '
            . $this->subjects . ' ON ' . $this->subject_allocations . '.subject_id = '
            . $this->subjects . '.subject_id) INNER JOIN ' . $this->faculties . ' ON ' . $this->subject_allocations
            . '.faculty_id = ' . $this->faculties . '.faculty_id ) ORDER BY '
            . $this->table . '.day, ' . $this->table . '.time';

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // Read all data of a time table by ID
    public function read_row()
    {
        $query = 'SELECT * FROM (((' . $this->table . ' INNER JOIN ' . $this->subject_allocations . ' ON '
            . $this->table . '.timetable_id = :timetable_id AND '
            . $this->table . '.subject_allocation_id = ' . $this->subject_allocations . '.subject_allocation_id) INNER JOIN '
            . $this->subjects . ' ON ' . $this->subject_allocations . '.subject_id = '
            . $this->subjects . '.subject_id) INNER JOIN ' . $this->faculties . ' ON ' . $this->subject_allocations
            . '.faculty_id = ' . $this->faculties . '.faculty_id ) ORDER BY '
            . $this->table . '.day, ' . $this->table . '.time';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));

        $stmt->bindParam(':timetable_id', $this->timetable_id);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // read a particular entry to check for collision
    public function read_single()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE '
            . $this->table . '.day = :day AND '
            . $this->table . '.time = :time';

        $stmt = $this->conn->prepare($query);

        // clean the data
        $this->day = htmlspecialchars(strip_tags($this->day));
        $this->time = htmlspecialchars(strip_tags($this->time));

        $stmt->bindParam(':day', $this->day);
        $stmt->bindParam(':time', $this->time);

        if ($stmt->execute()) {
            // Fetch the data

            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Insert a new subject - faculty
    public function post()
    {
        $query = 'INSERT INTO ' . $this->table
            . ' SET timetable_id = :timetable_id, day = :day, time = :time, subject_allocation_id = :subject_allocation_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));
        $this->day = htmlspecialchars(strip_tags($this->day));
        $this->time = htmlspecialchars(strip_tags($this->time));
        $this->subject_allocation_id = htmlspecialchars(strip_tags($this->subject_allocation_id));

        $stmt->bindParam(':timetable_id', $this->timetable_id);
        $stmt->bindParam(':day', $this->day);
        $stmt->bindParam(':time', $this->time);
        $stmt->bindParam(':subject_allocation_id', $this->subject_allocation_id);

        // If data inserted successfully, return True
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update a field in positions_prev
    public function update_row($to_update)
    {
        $to_set = $to_update . ' = :' . $to_update;
        $query = 'UPDATE ' . $this->table . ' SET ' . $to_set . ' WHERE time_day_id = :time_day_id';

        $stmt = $this->conn->prepare($query);

        $this->$to_update = htmlspecialchars(strip_tags($this->$to_update));
        $this->time_day_id = htmlspecialchars(strip_tags($this->time_day_id));

        $stmt->bindParam(':' . $to_update, $this->$to_update);
        $stmt->bindParam(':time_day_id', $this->time_day_id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete a field in positions_prev
    public function delete_row()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE time_day_id = :time_day_id';

        $stmt = $this->conn->prepare($query);

        $this->time_day_id = htmlspecialchars(strip_tags($this->time_day_id));

        $stmt->bindParam(':time_day_id', $this->time_day_id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
