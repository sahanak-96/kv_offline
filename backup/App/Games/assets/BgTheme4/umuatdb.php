<?php
$servername = "localhost";
$username = "umbeta";
$password = "umbeta";

// Create connection
$conn = new mysqli($servername, $username, $password,"umbeta","3306");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
