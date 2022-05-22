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

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all data
    public function read()
    {
        $columns = $this->table . '.timetable_id, ' . $this->table . '.academic_year_from, '
            . $this->table . '.academic_year_to, ' . $this->table . '.department_id, '
            . $this->departments . '.department, ' . $this->table . '.semester';
        $query = 'SELECT ' . $columns . ' FROM (' . $this->table . ' INNER JOIN ' . $this->departments
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
        $columns = $this->table . '.timetable_id, ' . $this->table . '.academic_year_from, '
            . $this->table . '.academic_year_to, ' . $this->table . '.department_id, '
            . $this->departments . '.department, ' . $this->table . '.semester';
        $query = 'SELECT ' . $columns . ' FROM (' . $this->table . ' INNER JOIN ' . $this->departments
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
        $columns = $this->table . '.timetable_id, ' . $this->table . '.academic_year_from, '
            . $this->table . '.academic_year_to, ' . $this->table . '.department_id, '
            . $this->departments . '.department, ' . $this->table . '.semester';
        $query = 'SELECT ' . $columns . ' FROM (' . $this->table . ' INNER JOIN ' . $this->departments
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
        $columns = $this->table . '.timetable_id, ' . $this->table . '.academic_year_from, '
            . $this->table . '.academic_year_to, ' . $this->table . '.department_id, '
            . $this->departments . '.department, ' . $this->table . '.semester';
        $query = 'SELECT ' . $columns . ' FROM (' . $this->table . ' INNER JOIN ' . $this->departments
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
        $columns = $this->table . '.timetable_id, ' . $this->table . '.academic_year_from, '
            . $this->table . '.academic_year_to, ' . $this->table . '.department_id, '
            . $this->departments . '.department, ' . $this->table . '.semester';
        $query = 'SELECT ' . $columns . ' FROM (' . $this->table . ' INNER JOIN ' . $this->departments
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
            . ' academic_year_to = :academic_year_to, department_id = :department_id, semester = :semester';

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
