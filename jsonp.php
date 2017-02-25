<?php
header('Content-type: application/x-javascript');
header('Access-Control-Allow-Origin: *');  

echo $_GET['callback']."([".json_encode( $_GET['field'] . time() . " ==-> " . $_GET)."])";
?>