<?php

// fetch faculty's time table
class Lab_table
{
    private $conn;

    private $departments = 'timetable_departments';
    private $faculties = 'timetable_faculties';
    private $subjects = 'timetable_subjects';
    private $timetables = 'timetable_timetables';
    private $subject_allocations = 'timetable_subject_allocations';
    private $time_day = 'timetable_time_day';

    public $department_id = 0;
    public $category_id = 0;

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {

        $query = 'SELECT * FROM (((((' . $this->subjects . ' INNER JOIN ' . $this->departments . ' ON '
            . $this->subjects . '.department_id = :department_id AND ' . $this->subjects . '.category_id = :category_id) INNER JOIN '
            . $this->subject_allocations . ' ON '
            . $this->subjects . '.subject_id = ' . $this->subject_allocations . '.subject_id) INNER JOIN '
            . $this->time_day . ' ON ' . $this->subject_allocations . '.subject_allocation_id = '
            . $this->time_day . '.subject_allocation_id) INNER JOIN ' . $this->timetables
            . ' ON ' . $this->time_day . '.timetable_id = ' . $this->timetables . '.timetable_id) INNER JOIN '
            . $this->faculties . ' ON ' . $this->faculties . '.faculty_id = ' . $this->subject_allocations
            . '.faculty_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));

        $stmt->bindParam(':department_id', $this->department_id);
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
