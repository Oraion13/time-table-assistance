<?php

// Operations for 'timetable_subject_allocations' is handeled here
class Subject_allocation
{
    private $conn;
    private $table = 'timetable_subject_allocations';
    private $timetables = 'timetable_timetables';
    private $subjects = 'timetable_subjects';
    private $faculties = 'timetable_faculties';

    public $subject_allocation_id = 0;
    public $timetable_id = 0;
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
        $columns = $this->table . '.subject_allocation_id, ' . $this->table . '.timetable_id, '
            . $this->table . '.subject_id, ' . $this->subjects . '.subject_code, ' . $this->subjects . '.category_id, ' . $this->subjects . '.contact_periods, '
            . $this->subjects . '.subject, ' . $this->table . '.faculty_id, ' . $this->faculties . '.faculty_code, ' 
            . $this->faculties . '.faculty, ' . $this->faculties . '.department_id';
        $query = 'SELECT ' . $columns . ' FROM ((' . $this->table . ' INNER JOIN ' . $this->subjects . ' ON '
            . $this->table . '.subject_id = ' . $this->subjects . '.subject_id) INNER JOIN '
            . $this->faculties . ' ON ' . $this->table . '.faculty_id = '
            . $this->faculties . '.faculty_id)';

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // Read all data of a time table by ID
    public function read_row()
    {
        $columns = $this->table . '.subject_allocation_id, ' . $this->table . '.timetable_id, '
            . $this->table . '.subject_id, ' . $this->subjects . '.subject_code, ' . $this->subjects . '.category_id, ' . $this->subjects . '.contact_periods, '
            . $this->subjects . '.subject, ' . $this->table . '.faculty_id, ' . $this->faculties . '.faculty_code, ' 
            . $this->faculties . '.faculty, ' . $this->faculties . '.department_id';
        $query = 'SELECT ' . $columns . ' FROM ((' . $this->table . ' INNER JOIN ' . $this->subjects . ' ON '
            . $this->table . '.timetable_id = :timetable_id AND ' . $this->table . '.subject_id = '
            . $this->subjects . '.subject_id) INNER JOIN ' . $this->faculties . ' ON '
            . $this->table . '.faculty_id = ' . $this->faculties . '.faculty_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));

        $stmt->bindParam(':timetable_id', $this->timetable_id);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // read only the row
    public function read_only_row()
    {
        $columns = $this->table . '.faculty_id, ' . $this->faculties . '.faculty, ' . $this->faculties . '.department_id';
        $query = 'SELECT ' . $columns . ' FROM (' . $this->table . ' INNER JOIN '
            . $this->faculties . ' ON ' . $this->table . '.subject_allocation_id = :subject_allocation_id AND '
            . $this->table . '.faculty_id =' . $this->faculties . '.faculty_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->subject_allocation_id = htmlspecialchars(strip_tags($this->subject_allocation_id));

        $stmt->bindParam(':subject_allocation_id', $this->subject_allocation_id);

        if ($stmt->execute()) {
            // Fetch the data
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // If data exists, return the data
            if ($row) {
                return $row;
            }
        }

        return false;
    }

    // Insert a new subject - faculty
    public function post()
    {
        $query = 'INSERT INTO ' . $this->table
            . ' SET timetable_id = :timetable_id, subject_id = :subject_id, 
                faculty_id = :faculty_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));
        $this->subject_id = htmlspecialchars(strip_tags($this->subject_id));
        $this->faculty_id = htmlspecialchars(strip_tags($this->faculty_id));

        $stmt->bindParam(':timetable_id', $this->timetable_id);
        $stmt->bindParam(':subject_id', $this->subject_id);
        $stmt->bindParam(':faculty_id', $this->faculty_id);

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
        $query = 'UPDATE ' . $this->table . ' SET ' . $to_set . ' WHERE subject_allocation_id = :subject_allocation_id';

        $stmt = $this->conn->prepare($query);

        $this->$to_update = htmlspecialchars(strip_tags($this->$to_update));
        $this->subject_allocation_id = htmlspecialchars(strip_tags($this->subject_allocation_id));

        $stmt->bindParam(':' . $to_update, $this->$to_update);
        $stmt->bindParam(':subject_allocation_id', $this->subject_allocation_id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete a field in positions_prev
    public function delete_row()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE subject_allocation_id = :subject_allocation_id';

        $stmt = $this->conn->prepare($query);

        $this->subject_allocation_id = htmlspecialchars(strip_tags($this->subject_allocation_id));

        $stmt->bindParam(':subject_allocation_id', $this->subject_allocation_id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
