import {cp,mkdir,rm} from 'node:fs/promises';
await rm('deploy',{recursive:true,force:true});
await mkdir('deploy',{recursive:true});
await cp('dist','deploy/public',{recursive:true});
await cp('backend/public/api','deploy/public/api',{recursive:true});
await cp('backend/server','deploy/server',{recursive:true,filter:path=>!path.endsWith('/config.php')});
await cp('backend/database','deploy/database',{recursive:true});
console.log('Created deploy/public (web root), deploy/server and deploy/database. Copy config.example.php to config.php and set credentials on the server.');
