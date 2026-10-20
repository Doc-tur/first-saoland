<?php
declare(strict_types=1);

function config(): array {
    static $config;
    if ($config !== null) return $config;
    $file = __DIR__ . '/config.php';
    if (!is_file($file)) throw new RuntimeException('Copy config.example.php to config.php and set database credentials.');
    $config = require $file;
    return $config;
}
function db(): PDO {
    static $pdo;
    if ($pdo) return $pdo;
    $c = config();
    $pdo = new PDO("mysql:host={$c['db_host']};port={$c['db_port']};dbname={$c['db_name']};charset=utf8mb4", $c['db_user'], $c['db_password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}
function fail(string $message, int $status = 422): never { respond(['error' => $message], $status); }
function input(): array {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) fail('Request is too large.', 413);
    $raw = file_get_contents('php://input', false, null, 0, 32769);
    if (strlen($raw) > 32768) fail('Request is too large.', 413);
    try { $value = json_decode($raw, true, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException $e) { fail('Send a valid JSON request.', 400); }
    if (!is_array($value) || array_is_list($value)) fail('Send a JSON object.', 400);
    return $value;
}
function text(array $data, string $key, int $max, bool $required = true): string {
    $value = $data[$key] ?? '';
    if (!is_string($value)) fail("Invalid {$key}.");
    $value = trim($value);
    if (($required && $value === '') || strlen($value) > $max) fail("Check {$key}: " . ($required ? 'required, ' : '') . "maximum {$max} bytes.");
    return $value;
}
function choice(array $data, string $key, array $options, ?string $default = null): string {
    $v = $data[$key] ?? $default;
    if (!is_string($v) || !in_array($v, $options, true)) fail("Invalid {$key}.");
    return $v;
}
function email(array $data): string {
    $email = strtolower(text($data, 'email', 190));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Enter a valid email address.');
    return $email;
}
function number(array $data, string $key, float $max, bool $nullable = false, bool $integer = false): int|float|null {
    $v = $data[$key] ?? ($nullable ? null : 0);
    if ($nullable && ($v === '' || $v === null)) return null;
    if (!is_scalar($v) || !is_numeric($v) || !is_finite((float)$v) || (float)$v < 0 || (float)$v > $max || ($integer && (float)$v !== (float)(int)$v)) fail("Invalid {$key}.");
    return $integer ? (int)$v : (float)$v;
}
function csrf(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function verify_csrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$token || !hash_equals(csrf(), $token)) fail('Your session changed. Refresh the page and try again.', 419);
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') fail('Cross-site request denied.', 403);
}
function current_user(): ?array {
    if (empty($_SESSION['user_id'])) return null;
    $stmt = db()->prepare('SELECT id,name,email,role FROM users WHERE id=?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    if (!$user) { unset($_SESSION['user_id']); return null; }
    $user['id'] = (int)$user['id'];
    return $user;
}
function require_user(bool $admin = false): array {
    $user = current_user();
    if (!$user) fail('Please log in to continue.', 401);
    if ($admin && $user['role'] !== 'admin') fail('Administrator access required.', 403);
    return $user;
}
function throttle(string $scope, int $limit, int $seconds = 900): void {
    // Never trust a client-supplied forwarding header as the network identity.
    $key = hash('sha256', $scope . ':' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $now = time();
    $stmt = db()->prepare('INSERT INTO rate_limits(bucket,hits,expires_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE hits=IF(expires_at<=?,1,hits+1), expires_at=IF(expires_at<=?,?,expires_at)');
    $stmt->execute([$key,$now+$seconds,$now,$now,$now+$seconds]);
    $stmt = db()->prepare('SELECT hits FROM rate_limits WHERE bucket=?'); $stmt->execute([$key]);
    if ((int)$stmt->fetchColumn() > $limit) { header('Retry-After: ' . $seconds); fail('Too many attempts. Please try again later.',429); }
    if (random_int(1,100) === 1) db()->prepare('DELETE FROM rate_limits WHERE expires_at<?')->execute([$now]);
}
function property_row(array $p): array {
    $p['price'] = $p['price'] === null ? null : (float)$p['price'];
    foreach (['bedrooms','bathrooms'] as $k) $p[$k]=(int)$p[$k];
    $p['area_sqm'] = $p['area_sqm'] === null ? null : (float)$p['area_sqm'];
    foreach (['featured','is_example'] as $k) $p[$k]=(bool)$p[$k];
    $p['features'] = json_decode($p['features'],true) ?: [];
    $p['summary'] = $p['description'];
    $p['alt'] = $p['title'];
    unset($p['created_by']);
    return $p;
}
function property_values(array $d): array {
    $features = $d['features'] ?? [];
    if (!is_array($features) || !array_is_list($features) || count($features)>20) fail('Use up to 20 property features.');
    foreach ($features as &$f) { if (!is_string($f) || strlen($f)>120) fail('Invalid feature.'); $f=trim($f); } unset($f);
    $image=text($d,'image',2048,false) ?: '/assets/home.jpg';
    if (!preg_match('~^/assets/[a-zA-Z0-9._/-]+$~D',$image) && !(filter_var($image,FILTER_VALIDATE_URL) && in_array(strtolower((string)parse_url($image,PHP_URL_SCHEME)),['http','https'],true))) fail('Image must be an HTTP(S) URL or an /assets/ path.');
    foreach (['featured','is_example'] as $k) if (isset($d[$k]) && !is_bool($d[$k])) fail("Invalid {$k}.");
    return [text($d,'title',150),text($d,'description',10000),number($d,'price',99999999999999.99,true),choice($d,'price_period',['total','year','month'],'total'),choice($d,'type',['Residential','Commercial','Land']),choice($d,'purpose',['Buy','Rent']),text($d,'category',80),text($d,'location',200),$image,number($d,'bedrooms',1000,false,true),number($d,'bathrooms',1000,false,true),number($d,'area_sqm',9999999999.99,true),json_encode(array_values(array_filter($features,fn($v)=>$v!=='')),JSON_THROW_ON_ERROR),choice($d,'status',['available','sold','rented','draft'],'draft'),(int)($d['featured']??false),(int)($d['is_example']??false)];
}
