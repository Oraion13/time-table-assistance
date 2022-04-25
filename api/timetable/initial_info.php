<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../utils/send.php';
require_once '../../models/Initial_info.php';

class Initial_info_api extends Initial_info{
    private $Initial_info;

    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for timetables table to do operations
        $this->Initial_info = new Initial_info($db);
    }
}
