<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

$sql = "SELECT 
            d.id, 
            e.NOMBRE AS nombre, 
            e.CATEGORIA_ID_CATEGORIA, 
            c.NOMBRE AS categoria_nombre,
            d.cantidad_cajas, 
            d.cantidad_kilos, 
            d.peso_cajas, 
            d.fecha_ingreso, 
            d.usuario 
        FROM inventario_detalle d 
        JOIN EXISTENCIA e ON d.existencia_id = e.ID_EXISTENCIA
        JOIN CATEGORIA c ON e.CATEGORIA_ID_CATEGORIA = c.ID_CATEGORIA";

$result = $conn->query($sql);

$inventario = [];
while ($row = $result->fetch_assoc()) {
    $inventario[] = $row;
}

echo json_encode(["success" => true, "data" => $inventario]);

$conn->close();
