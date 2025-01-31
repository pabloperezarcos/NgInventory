<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Query para obtener los registros de `inventario_temporal`
$sql = "SELECT * FROM inventario_temporal ORDER BY fecha_ingreso DESC";
$result = $conn->query($sql);

$inventario = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $inventario[] = $row;
    }
}

// Devolver los datos en formato JSON
echo json_encode(["success" => true, "data" => $inventario]);

$conn->close();
