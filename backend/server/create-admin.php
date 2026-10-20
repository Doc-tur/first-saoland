<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') {http_response_code(404);exit;}
require __DIR__.'/bootstrap.php';
echo "Create a First Saoland administrator (does not promote an existing customer).\nName: ";$name=trim(fgets(STDIN));
echo 'Email: ';$email=strtolower(trim(fgets(STDIN)));
echo "Password (input is visible in this CLI; use a private terminal): ";$password=rtrim(fgets(STDIN),"\r\n");
if (!$name || strlen($name)>100 || strlen($email)>190 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($password)<10 || strlen($password)>72) {fwrite(STDERR,"Invalid details. Password must be 10–72 bytes.\n");exit(1);}
try {db()->prepare("INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,'admin')")->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT)]);echo "Administrator created. Log in through the website.\n";}
catch(Throwable $e) {fwrite(STDERR,"Could not create administrator. Check database settings and whether the email is already registered.\n");exit(1);}
?>