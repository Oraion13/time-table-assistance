<?php

// Operations for 'timetable_admin' is handeled here
class Admin
{
    private $conn;
    private $table = 'timetable_admin';

    public $admin_id;
    public $admin_name;
    public $password;
    

    // Connect to the DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read a single data using admin_name
    public function read_single()
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE admin_name = :admin_name';

        $stmt = $this->conn->prepare($query);

        // clean the data
        $this->admin_name = htmlspecialchars(strip_tags($this->admin_name));

        $stmt->bindParam(':admin_name', $this->admin_name);

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

    // Insert a new data
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table . ' SET admin_name = :admin_name, password = :password';

        $stmt = $this->conn->prepare($query);

        // clean the data
        $this->admin_name = htmlspecialchars(strip_tags($this->admin_name));
        $this->password = htmlspecialchars(strip_tags($this->password));

        $stmt->bindParam(':admin_name', $this->admin_name);
        $stmt->bindParam(':password', $this->password);

        // If data inserted successfully, return True
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
