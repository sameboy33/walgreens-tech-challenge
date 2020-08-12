<?php 
    require_once './site.inc.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="stylesheet.css">
    <link rel="icon" 
      type="image/png" 
      href="Apache-favicon.png">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="jquery-3.5.1.js"></script>
    <script src="script.js"></script>
    <title>Walgreens Technical Assessment</title>
</head>
<body>
    <?php
        mysql_start();
        deleteAllGreenStreetData();
        insertGreenStreetData();
        getAllGreenStreetData();
        mysql_stop();
        echo "<div id='after-query-results'></div>";
    ?>
    <div class="content">
        <div class="btn-group">
            <button type="button" onclick="addNewParagraph()">Add Paragraph</button>
            <button type="button" onclick="toggleJSON()">Toggle Countries</button>
        </div>
        <button id="toggle-button" type="button">Toggle Logo</button>
        <img id="logo" src="green-street-logo.png" alt="Green Street Advisors">
    </div>
    <span id="centered"><p>This is centered with flexbox</p></span>
    <div id="centered-2">
        <p id="centered-2">This is centered with a div container and 'text-align: center'</p>
    </div>
    <p id="centered-3">This is centered using a width and 'margin: 0 auto' (imperfect border fit because it's a block element)</p>
    <div class="two-sum-input">
        <h2>Input Two Numbers (Space Separated):</h2>
        <input id="text-input" type="text">
        <input id="form-submit" type="submit">
    </div>
    <div class="country-widgets">
        <ul class="widget" id="widget-1"> </ul>
        <div class="widget-buttons">
        <button type="button" onclick="sendAllRight()">>></button>
        <button type="button" onclick="sendSelectedRight()">></button>
        <button type="button" onclick="sendSelectedLeft()"><</button>
        <button type="button" onclick="sendAllLeft()"><<</button>
        </div>
        <ul class="widget" id="widget-2"> </ul>
    </div>
</body>
</html>