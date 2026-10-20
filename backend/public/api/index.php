<?php 
declare(strict_types=1);
require dirname(__DIR__,2) . '/server/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
ini_set('display_errors','0');
try {
    $c=config();
    ini_set('session.use_strict_mode','1');
    ini_set('session.use_only_cookies','1');
    session_name('saoland_session');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>(bool)$c['secure_cookies'],'httponly'=>true,'samesite'=>'Lax']);
    session_start();
    $method=$_SERVER['REQUEST_METHOD'];
    $route=trim((string)($_GET['route']??''),'/');
    if ($method==='GET' && $route==='session') respond(['user'=>current_user(),'csrf'=>csrf()]);
    if (in_array($method,['POST','PUT','PATCH','DELETE'],true)) verify_csrf();
    if ($method==='POST' && in_array($route,['auth/signup','auth/login'],true)) {
        throttle($route, $route==='auth/login'?15:5);
        $d=input(); $mail=email($d); $password=$d['password']??'';
        if (!is_string($password) || strlen($password)<10 || strlen($password)>72) fail('Use a password between 10 and 72 bytes.');
        if ($route==='auth/signup') {
            $name=text($d,'name',100);
            try { db()->prepare('INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,\'customer\')')->execute([$name,$mail,password_hash($password,PASSWORD_DEFAULT)]); }
            catch (PDOException $e) { if ($e->getCode()==='23000') fail('An account with that email already exists.',409); throw $e; }
            $id=(int)db()->lastInsertId();
        } else {
            $stmt=db()->prepare('SELECT id,password_hash FROM users WHERE email=?');$stmt->execute([$mail]);$row=$stmt->fetch();
            // Fixed valid hash keeps an unknown account on the password verification path.
            $hash=$row['password_hash']??'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
            if (!password_verify($password,$hash) || !$row) fail('Email or password is incorrect.',401);
            $id=(int)$row['id'];
            if (password_needs_rehash($row['password_hash'],PASSWORD_DEFAULT)) db()->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([password_hash($password,PASSWORD_DEFAULT),$id]);
        }
        session_regenerate_id(true); $_SESSION=['user_id'=>$id];
        respond(['user'=>current_user(),'csrf'=>csrf()],$route==='auth/signup'?201:200);
    }
    if ($method==='POST' && $route==='auth/logout') {
        $_SESSION=[];session_regenerate_id(true);respond(['user'=>null,'csrf'=>csrf()]);
    }
    if ($method==='GET' && in_array($route,['properties','admin/properties'],true)) {
        $admin=$route==='admin/properties'; if ($admin) require_user(true);
        $where=[];$args=[];
        if (!$admin) $where[]="status<>'draft'";
        foreach (['type','purpose'] as $key) if (isset($_GET[$key]) && $_GET[$key]!=='') { $where[]="{$key}=?";$args[]=(string)$_GET[$key]; }
        $q=trim((string)($_GET['q']??''));if (strlen($q)>200) fail('Search text is too long.');
        if ($q!=='') { $where[]='(title LIKE ? OR location LIKE ? OR category LIKE ?)';array_push($args,"%{$q}%","%{$q}%","%{$q}%"); }
        if (array_key_exists('ids',$_GET)) {
            $ids=array_values(array_filter(explode(',',(string)$_GET['ids'])));
            if(count($ids)>200) fail('Too many saved properties.');
            if($ids){$where[]='id IN ('.implode(',',array_fill(0,count($ids),'?')).')';array_push($args,...$ids);}else{$where[]='0=1';}
        }
        $order=match((string)($_GET['sort']??'')){'az'=>'title ASC,id ASC','za'=>'title DESC,id DESC',default=>'featured DESC,created_at DESC,id DESC'};
        $limit=max(1,min(100,(int)($_GET['limit']??24)));$page=max(1,min(1000000,(int)($_GET['page']??1)));$offset=($page-1)*$limit;
        $sql=$where?' WHERE '.implode(' AND ',$where):'';
        $stmt=db()->prepare('SELECT COUNT(*) FROM properties'.$sql);$stmt->execute($args);$total=(int)$stmt->fetchColumn();
        $stmt=db()->prepare('SELECT * FROM properties'.$sql.' ORDER BY '.$order.' LIMIT '.$limit.' OFFSET '.$offset);$stmt->execute($args);
        respond(['data'=>array_map('property_row',$stmt->fetchAll()),'total'=>$total,'page'=>$page,'limit'=>$limit]);
    }
    if ($method==='GET' && preg_match('~^properties/([a-zA-Z0-9-]{1,80})$~D',$route,$m)) {
        $stmt=db()->prepare("SELECT * FROM properties WHERE id=? AND status<>'draft'");$stmt->execute([$m[1]]);$p=$stmt->fetch();if(!$p) fail('Property not found.',404);respond(['data'=>property_row($p)]);
    }
    if ($method==='POST' && $route==='admin/properties') {
        $user=require_user(true);$values=property_values(input());$id=bin2hex(random_bytes(12));
        $sql='INSERT INTO properties(id,title,description,price,price_period,type,purpose,category,location,image,bedrooms,bathrooms,area_sqm,features,status,featured,is_example,created_by) VALUES ('.implode(',',array_fill(0,18,'?')).')';
        db()->prepare($sql)->execute([$id,...$values,$user['id']]);respond(['id'=>$id],201);
    }
    if (preg_match('~^admin/properties/([a-zA-Z0-9-]{1,80})$~D',$route,$m) && in_array($method,['PUT','DELETE'],true)) {
        require_user(true);$stmt=db()->prepare('SELECT id FROM properties WHERE id=?');$stmt->execute([$m[1]]);if(!$stmt->fetch()) fail('Property not found.',404);
        if($method==='DELETE') {db()->prepare('DELETE FROM properties WHERE id=?')->execute([$m[1]]);respond(['success'=>true]);}
        $values=property_values(input());db()->prepare('UPDATE properties SET title=?,description=?,price=?,price_period=?,type=?,purpose=?,category=?,location=?,image=?,bedrooms=?,bathrooms=?,area_sqm=?,features=?,status=?,featured=?,is_example=? WHERE id=?')->execute([...$values,$m[1]]);respond(['success'=>true]);
    }
    if ($method==='POST' && $route==='inquiries') {
        $user=require_user();throttle('inquiries',20);$d=input();$property=$d['property_id']??null;
        if($property!==null) {if(!is_string($property))fail('Invalid property.');$stmt=db()->prepare("SELECT id FROM properties WHERE id=? AND status<>'draft'");$stmt->execute([$property]);if(!$stmt->fetch()) fail('Property not found.',404);}
        $interest=choice($d,'interest',['Residential','Commercial','Land','Sell or let a property','General property enquiry']);
        db()->prepare('INSERT INTO inquiries(user_id,property_id,name,email,phone,interest,location,budget,message) VALUES (?,?,?,?,?,?,?,?,?)')->execute([$user['id'],$property,text($d,'name',100),email($d),text($d,'phone',40,false),$interest,text($d,'location',200,false),text($d,'budget',100,false),text($d,'message',3000)]);respond(['id'=>(int)db()->lastInsertId()],201);
    }
    if ($method==='GET' && in_array($route,['inquiries','admin/inquiries'],true)) {
        $admin=$route==='admin/inquiries';$user=require_user($admin);$page=max(1,min(1000000,(int)($_GET['page']??1)));$limit=20;$offset=($page-1)*$limit;
        $where=$admin?'':' WHERE user_id=?';$args=$admin?[]:[$user['id']];
        $stmt=db()->prepare('SELECT COUNT(*) FROM inquiries'.$where);$stmt->execute($args);$total=(int)$stmt->fetchColumn();
        $stmt=db()->prepare('SELECT * FROM inquiries'.$where.' ORDER BY id DESC LIMIT 20 OFFSET '.$offset);$stmt->execute($args);respond(['data'=>$stmt->fetchAll(),'total'=>$total,'page'=>$page,'limit'=>$limit]);
    }
    if ($method==='PATCH' && preg_match('~^admin/inquiries/([0-9]+)$~D',$route,$m)) {
        require_user(true);$status=choice(input(),'status',['new','contacted','closed']);$stmt=db()->prepare('UPDATE inquiries SET status=? WHERE id=?');$stmt->execute([$status,$m[1]]);respond(['success'=>true]);
    }
    fail('Endpoint not found.',404);
} catch (Throwable $e) {
    error_log((string)$e);
    respond(['error'=>'Server unavailable. Check the PHP/database setup or try again later.'],500);
}
?>