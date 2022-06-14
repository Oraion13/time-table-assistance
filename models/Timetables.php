<?php

// Operations for '
// timetable_timetables
// ' is handeled here
class Timetables
{
    private $conn;

    private $table = 'timetable_timetables';
    private $departments = 'timetable_departments';

    public $timetable_id = 0;
    public $academic_year_from = "";
    public $academic_year_to = "";
    public $department_id = 0;
    public $semester = 0;
    public $regulation = 0;
    public $room_no = 0;
    public $period = 0;
    public $with_effect_from = 0;
    public $class_advisor = 0;
    public $class_committee_chairperson = 0;

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {
        $query = 'SELECT * FROM (' . $this->table . ' INNER JOIN ' . $this->departments
            . ' ON ' . $this->table . '.department_id = ' . $this->departments . '.department_id)';

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            // If data exists, return the data
            if ($stmt) {
                return $stmt;
            }
        }

        return false;
    }

    // read a particular entry
    public function read_single()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE academic_year_from = :academic_year_from AND'
            . ' academic_year_to = :academic_year_to AND department_id = :department_id AND semester = :semester';

        $stmt = $this->conn->prepare($query);

        // clean the data
        $this->academic_year_from = htmlspecialchars(strip_tags($this->academic_year_from));
        $this->academic_year_to = htmlspecialchars(strip_tags($this->academic_year_to));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->semester = htmlspecialchars(strip_tags($this->semester));

        $stmt->bindParam(':academic_year_from', $this->academic_year_from);
        $stmt->bindParam(':academic_year_to', $this->academic_year_to);
        $stmt->bindParam(':department_id', $this->department_id);
        $stmt->bindParam(':semester', $this->semester);

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

    // read a particular entry
    public function read_by_dept_sem()
    {
        $query = 'SELECT * FROM (' . $this->table . ' INNER JOIN ' . $this->departments
            . ' ON ' . $this->table . '.department_id = :department_id AND '
            . $this->table . '.semester = :semester AND  '
            . $this->table . '.department_id = '
            . $this->departments . '.department_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->semester = htmlspecialchars(strip_tags($this->semester));

        $stmt->bindParam(':department_id', $this->department_id);
        $stmt->bindParam(':semester', $this->semester);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // read a particular entry
    public function read_by_dept()
    {
        $query = 'SELECT * FROM (' . $this->table . ' INNER JOIN ' . $this->departments
            . ' ON ' . $this->table . '.department_id = :department_id AND '
            . $this->table . '.department_id = '
            . $this->departments . '.department_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));

        $stmt->bindParam(':department_id', $this->department_id);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // read a particular entry
    public function read_by_sem()
    {
        $query = 'SELECT * FROM (' . $this->table . ' INNER JOIN ' . $this->departments
            . ' ON '
            . $this->table . '.semester = :semester AND  '
            . $this->table . '.department_id = '
            . $this->departments . '.department_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->semester = htmlspecialchars(strip_tags($this->semester));

        $stmt->bindParam(':semester', $this->semester);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // Read data by ID
    public function read_row()
    {
        $query = 'SELECT * FROM (' . $this->table . ' INNER JOIN ' . $this->departments
            . ' ON timetable_id = :timetable_id AND ' . $this->table . '.department_id = '
            . $this->departments . '.department_id)';

        $stmt = $this->conn->prepare($query);

        // Clean the data
        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));

        $stmt->bindParam(':timetable_id', $this->timetable_id);

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

    // Insert data
    public function post()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET academic_year_from = :academic_year_from,'
            . ' academic_year_to = :academic_year_to, department_id = :department_id, semester = :semester, '
            . 'regulation = :regulation, room_no = :room_no, period = :period, with_effect_from = :with_effect_from, class_advisor = :class_advisor, class_committee_chairperson = :class_committee_chairperson, ';

        $stmt = $this->conn->prepare($query);

        // clean the data
        $this->academic_year_from = htmlspecialchars(strip_tags($this->academic_year_from));
        $this->academic_year_to = htmlspecialchars(strip_tags($this->academic_year_to));
        $this->department_id = htmlspecialchars(strip_tags($this->department_id));
        $this->semester = htmlspecialchars(strip_tags($this->semester));
        $this->regulation = htmlspecialchars(strip_tags($this->regulation));
        $this->room_no = htmlspecialchars(strip_tags($this->room_no));
        $this->period = htmlspecialchars(strip_tags($this->period));
        $this->with_effect_from = htmlspecialchars(strip_tags($this->with_effect_from));
        $this->class_advisor = htmlspecialchars(strip_tags($this->class_advisor));
        $this->class_committee_chairperson = htmlspecialchars(strip_tags($this->class_committee_chairperson));

        $stmt->bindParam(':academic_year_from', $this->academic_year_from);
        $stmt->bindParam(':academic_year_to', $this->academic_year_to);
        $stmt->bindParam(':department_id', $this->department_id);
        $stmt->bindParam(':semester', $this->semester);
        $stmt->bindParam(':regulation', $this->regulation);
        $stmt->bindParam(':room_no', $this->room_no);
        $stmt->bindParam(':period', $this->period);
        $stmt->bindParam(':with_effect_from', $this->with_effect_from);
        $stmt->bindParam(':class_advisor', $this->class_advisor);
        $stmt->bindParam(':class_committee_chairperson', $this->class_committee_chairperson);

        // If data inserted successfully, return True
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update a field
    public function update_row($to_update)
    {
        $to_set = $to_update . ' = :' . $to_update;
        $query = 'UPDATE ' . $this->table . ' SET ' . $to_set . ' WHERE timetable_id = :timetable_id';

        $stmt = $this->conn->prepare($query);

        $this->$to_update = htmlspecialchars(strip_tags($this->$to_update));
        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));

        $stmt->bindParam(':' . $to_update, $this->$to_update);
        $stmt->bindParam(':timetable_id', $this->timetable_id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete a field
    public function delete_row()
    {
        $query = 'DELETE FROM ' . $this->table . ' WHERE timetable_id = :timetable_id';

        $stmt = $this->conn->prepare($query);

        $this->timetable_id = htmlspecialchars(strip_tags($this->timetable_id));

        $stmt->bindParam(':timetable_id', $this->timetable_id);

        // If data updated successfully, return True
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
