<?php

// Operations for '
// timetable_departments
// timetable_faculties
// timetable_subjects
// ' is handeled here
class Info
{
    private $conn;

    public $table = '';

    public $dept_id = 0;
    public $semester = 0;

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {
        $query = 'SELECT * FROM ' . $this->table;

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Read by department
    public function read_by_dept(){
        $query = 'SELECT * FROM ' . $this->table . ' WHERE dept_id = :dept_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->dept_id = htmlspecialchars(strip_tags($this->dept_id));

        $stmt->bindParam(':dept_id', $this->dept_id);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Read by semester
    public function read_by_sem(){
        $query = 'SELECT * FROM ' . $this->table . ' WHERE semester = :semester';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->semester = htmlspecialchars(strip_tags($this->semester));

        $stmt->bindParam(':semester', $this->semester);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Read by department and semester
    public function read_by_dept_sem(){
        $query = 'SELECT * FROM ' . $this->table . ' WHERE dept_id = :dept_id AND semester = :semester';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->dept_id = htmlspecialchars(strip_tags($this->dept_id));
        $this->semester = htmlspecialchars(strip_tags($this->semester));

        $stmt->bindParam(':dept_id', $this->dept_id);
        $stmt->bindParam(':semester', $this->semester);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }
}
