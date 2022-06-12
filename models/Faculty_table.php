<?php

// fetch faculty's time table
class Faculty_table
{
    private $conn;

    private $departments = 'timetable_departments';
    private $faculties = 'timetable_faculties';
    private $subjects = 'timetable_subjects';
    private $timetables = 'timetable_timetables';
    private $subject_allocations = 'timetable_subject_allocations';
    private $time_day = 'timetable_time_day';

    public $faculty_id = 0;

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {
        $columns = $this->faculties . '.faculty, ' . $this->departments . '.department, ' . $this->subjects . '.subject, '
            . $this->subjects . '.contact_periods, '
            . $this->timetables . '.timetable_id, ' . $this->timetables . '.academic_year_from, '
            . $this->timetables . '.academic_year_to, ' . $this->timetables . '.semester, '
            . $this->subject_allocations . '.subject_allocation_id, ' . $this->time_day . '.time_day_id, '
            . $this->time_day . '.day, ' . $this->time_day . '.time';

        $query = 'SELECT ' . $columns . ' FROM (((((' . $this->faculties . ' INNER JOIN '
            . $this->subject_allocations . ' ON ' . $this->faculties . '.faculty_id = :faculty_id AND '
            . $this->faculties . '.faculty_id = ' . $this->subject_allocations . '.faculty_id ) INNER JOIN '
            . $this->timetables . ' ON ' . $this->timetables . '.timetable_id = '
            . $this->subject_allocations . '.timetable_id ) INNER JOIN ' . $this->time_day . ' ON '
            . $this->time_day . '.subject_allocation_id = ' . $this->subject_allocations . '.subject_allocation_id ) INNER JOIN '
            . $this->departments . ' ON ' . $this->departments . '.department_id = '
            . $this->timetables . '.department_id ) INNER JOIN ' . $this->subjects . ' ON '
            . $this->subjects . '.subject_id = ' . $this->subject_allocations . '.subject_id ) ORDER BY '
            . $this->time_day . '.day, ' . $this->time_day . '.time';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->faculty_id = htmlspecialchars(strip_tags($this->faculty_id));

        $stmt->bindParam(':faculty_id', $this->faculty_id);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }
}
