<?php

require_once 'site.inc.php';

if(isset($_POST['first']) && isset($_POST['second'])) {
    mysql_start();
    $sum_id = addLeftAndRight($_POST['first'], $_POST['second']);
    $numbers = getLeftAndRight($sum_id);
    $left = $numbers[0];
    $right = $numbers[1];
    mysql_stop();
    echo sum($left, $right);
}

function sum($first, $second){
    return $first + $second;
}