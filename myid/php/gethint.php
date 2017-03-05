<?php
$a=  array(
 array(
    server_id => 000001, 
    id_browse => b668e10cd4e694f58786da5282ff316b, 
    user_name => LeonRomOld
    ),
 array(
    server_id => 000001, 
    id_browse => ea7fb41beb8223559a3dcee78b7cb585, 
    user_name => LeonRom
    ),
 array(
    server_id => 000002, 
    id_browse => b668e10cd4e694f58786da5282ff316b_1, 
    user_name => OlgaKh,
    )
); 

echo "\nPHP++++++++++++++++++++++\n";
$json = '{"a":1,"b":2,"c":3,"d":4,"e":5}';

var_dump(json_decode($json, true));


$rez = "?";
if (isset($_REQUEST['new'])) {
    $new = $_REQUEST["new"];
    foreach ($a as $user  ) { 
var_dump( "\n0: ------ $user[id_browse]");
        if ($user[id_browse] == $new){
//             $rez = '{' . 
//                 '"server_id":"'.$user[server_id].'",'.
//                 '"id_browse":"'.$user[id_browse].'",'.
//                 '"user_name":"'.$user[user_name].'",'.
//                 '"x":0}';
// var_dump( "\n$rez");
            $rez  = json_encode($user);
var_dump( "\n$rez");            
            break;
        } 
    } 
}
echo "\n=======================PHP<br/>\n";    
echo "=>" . $rez;

?>