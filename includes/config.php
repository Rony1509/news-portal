<!--  Author Name: MH RONY.
                        GigHub Link: https://github.com/dev-mhrony
                        Facebook Link:https://www.facebook.com/dev.mhrony
                        Youtube Link: https://www.youtube.com/channel/UChYhUxkwDNialcxj-OFRcDw
                        for any PHP, Laravel, Python, Dart, Flutter work contact me at developer.mhrony@gmail.com  
                        Visit My Website : developerrony.com -->
<?php
$db_server = getenv('DB_SERVER') ?: 'localhost';
$db_user   = getenv('DB_USER')   ?: 'root';
$db_pass   = getenv('DB_PASS')   ?: '';
$db_name   = getenv('DB_NAME')   ?: 'livenews';

define('DB_SERVER', $db_server);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);
define('DB_NAME', $db_name);

$con = mysqli_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
// Check connection
if (mysqli_connect_errno())
{
 echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
?>
<!--  Author Name: MH RONY.
GigHub Link: https://github.com/dev-mhrony
Facebook Link:https://www.facebook.com/dev.mhrony
Youtube Link: https://www.youtube.com/channel/UChYhUxkwDNialcxj-OFRcDw
for any PHP, Laravel, Python, Dart, Flutter work contact me at developer.mhrony@gmail.com  
Visit My Website : developerrony.com -->