<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') {http_response_code(404);exit;}
require __DIR__.'/bootstrap.php';
try {
 $admin=db()->query("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1")->fetchColumn();
 if (!$admin) throw new RuntimeException('Create an administrator first.');
 $rows=json_decode(file_get_contents(__DIR__.'/demo-properties.json'),true,512,JSON_THROW_ON_ERROR);
 $sql='INSERT IGNORE INTO properties(id,title,description,price,price_period,type,purpose,category,location,image,bedrooms,bathrooms,area_sqm,features,status,featured,is_example,created_by) VALUES ('.implode(',',array_fill(0,18,'?')).')';
 foreach($rows as $row) db()->prepare($sql)->execute([$row['id'],...property_values($row),$admin]);
 echo "Illustrative properties added. Existing IDs are left unchanged.\n";
} catch(Throwable $e) {fwrite(STDERR,"Seed failed: ".$e->getMessage()."\n");exit(1);}
