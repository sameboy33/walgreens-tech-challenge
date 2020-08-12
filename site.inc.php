<?php
$conn = null;
$practice_table = "Green_Street_Practice";
$table_sum_left = "Green_Street_Practice_Sum_Left";
$table_sum_right = "Green_Street_Practice_Sum_Right";

function mysql_start($servername = "localhost", $username = "root", $password = "skvdelta1", $db = "mysql"){
    // Create connection
    global $conn;
    $conn = new mysqli($servername, $username, $password, $db);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function mysql_stop(){
    global $conn;
    $conn->close();
}

function insertGreenStreetData(){
    global $conn, $practice_table;
    $sql = "INSERT INTO $practice_table (ID) VALUES (NULL)";
    echo "<p id='insert-result'>";
    if ($conn->query($sql) === TRUE) {
        echo "Last Insert ID Is: " . $conn->insert_id;
    } 
    else {
        echo "Error (Failed to Insert): " . $sql . "<br>" . $conn->error;
    }
    echo "</p>";
}

function getAllGreenStreetData(){
    global $conn, $practice_table;
    $sql = "SELECT ID FROM $practice_table";
    $result = $conn->query($sql);

    echo "<p id='select-result'>";
    if ($result->num_rows > 0) {
        // output each row's data
        while($row = $result->fetch_assoc()) {
            echo nl2br("Selected ID is: " . $row["ID"] . "\n");  // Note: nl2br()
        }
    } else {
        echo "0 results";
    }
    echo "</p>";
}

function deleteAllGreenStreetData(){
    global $conn, $practice_table, $table_sum_left, $table_sum_right;
    $sql = "DELETE FROM $practice_table";
    $sql2 = "DELETE FROM $table_sum_left";
    $sql3 = "DELETE FROM $table_sum_right";
    $result = $conn->query($sql);
    $result2 = $conn->query($sql2);
    $result3 = $conn->query($sql3);

    echo "<p id='delete-result'>";
    if ($result === TRUE && $result2 === TRUE && $result3 === TRUE) {
        echo "Successfully Cleared Tables";
    } 
    else {
        echo "Error (Failed to Delete): " . $sql . "<br>" . $conn->error;
    }
    echo "</p>";
}

function addLeftAndRight($left, $right){
    global $conn, $table_sum_left, $table_sum_right;
    $sql = "INSERT INTO $table_sum_left (sum_id, value) VALUES (NULL, $left)";
    if ($conn->query($sql) === TRUE) {
        $sum_id = $conn->insert_id;
        $sql = "INSERT INTO $table_sum_right (sum_id, value) VALUES ($sum_id, $right)";
        if ($conn->query($sql) === TRUE) {
            return $conn->insert_id;
        } 
        else {
            echo "Error (Failed to Insert Right Sum Value): " . $sql . "<br>" . $conn->error;
        }
    } 
    else {
        echo "Error (Failed to Insert Left Sum Value): " . $sql . "<br>" . $conn->error;
    }
}

function getLeftAndRight($id){
    global $conn, $table_sum_left, $table_sum_right;
    $sql = <<<SQL
    SELECT $table_sum_left.value AS 'left', $table_sum_right.value AS 'right' 
    FROM $table_sum_left 
    JOIN $table_sum_right 
    ON $table_sum_left.sum_id = $table_sum_right.sum_id
SQL;
    $result = $conn->query($sql);
    // echo "<script>console.log(" . $result . ")</script>";
    // $row = $result->fetch_assoc();
    // var_dump($row);

    if ($result->num_rows > 0) {
        // output each row's data
        while($row = $result->fetch_assoc()) {
            return array($row['left'], $row['right']);
        }
    } else {
        echo "Select-Join Failed";
    }
}
