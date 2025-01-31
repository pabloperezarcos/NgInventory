<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['inventario']) || !is_array($data['inventario'])) {
    echo json_encode(["success" => false, "message" => "Datos incorrectos"]);
    exit();
}

$conn = getDatabaseConnection("carnesag_productos");

$stmt = $conn->prepare("INSERT INTO inventario_temporal (existencia_id, nombre, categoria_id, categoria_nombre, cantidad_cajas, cantidad_kilos, peso_cajas, usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($data['inventario'] as $producto) {
    $stmt->bind_param(
        "isissdds",
        $producto['existencia_id'],
        $producto['nombre'],
        $producto['categoria_id'],
        $producto['categoria_nombre'],
        $producto['cantidad_cajas'],
        $producto['cantidad_kilos'],
        $producto['peso_cajas'],
        $producto['usuario']
    );
    $stmt->execute();
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "message" => "Inventario cargado correctamente"]);
