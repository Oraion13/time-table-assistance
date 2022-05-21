<?php

// Operations for '
// timetable_departments
// timetable_faculties
// timetable_subjects
// timetable_subject_categories
// ' is handeled here
class Info
{
    private $conn;

    public $table = '';

    public $category_id = 0;
    public $department_id = 0;
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
        $query = 'SELECT * FROM ' . $this->table . ' WHERE department_id = :department_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));

        $stmt->bindParam(':department_id', $this->department_id);

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
        $query = 'SELECT * FROM ' . $this->table . ' WHERE department_id = :department_id AND semester = :semester';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->semester = htmlspecialchars(strip_tags($this->semester));

        $stmt->bindParam(':department_id', $this->department_id);
        $stmt->bindParam(':semester', $this->semester);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // Read by department, semester and category
    public function read_by_dept_sem_cat(){
        $query = 'SELECT * FROM ' . $this->table . ' WHERE department_id = :department_id AND semester = :semester AND category_id = :category_id';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->semester = htmlspecialchars(strip_tags($this->semester));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));

        $stmt->bindParam(':department_id', $this->department_id);
        $stmt->bindParam(':semester', $this->semester);
        $stmt->bindParam(':category_id', $this->category_id);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }
}
