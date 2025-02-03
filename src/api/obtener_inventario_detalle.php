<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Consulta con JOIN para obtener los detalles del inventario con la categoría
$sql = "SELECT 
            inventario_detalle.id,
            inventario_detalle.existencia_id,
            EXISTENCIA.NOMBRE AS producto_nombre,
            CATEGORIA.ID_CATEGORIA,
            CATEGORIA.NOMBRE AS categoria_nombre,
            inventario_detalle.cantidad_cajas,
            inventario_detalle.cantidad_kilos,
            inventario_detalle.peso_cajas,
            inventario_detalle.fecha_ingreso,
            inventario_detalle.usuario
        FROM inventario_detalle
        JOIN EXISTENCIA ON inventario_detalle.existencia_id = EXISTENCIA.ID_EXISTENCIA
        JOIN CATEGORIA ON EXISTENCIA.CATEGORIA_ID_CATEGORIA = CATEGORIA.ID_CATEGORIA
        ORDER BY CATEGORIA.NOMBRE ASC, EXISTENCIA.NOMBRE ASC";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["success" => true, "data" => $data]);
} else {
    echo json_encode(["success" => false, "message" => "No hay registros disponibles"]);
}

$conn->close();
