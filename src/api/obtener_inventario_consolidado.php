<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Consulta con JOIN para obtener los datos consolidados con la categoría
$sql = "SELECT 
            inventario_consolidado.id,
            inventario_consolidado.existencia_id,
            EXISTENCIA.NOMBRE AS producto_nombre,
            CATEGORIA.ID_CATEGORIA,
            CATEGORIA.NOMBRE AS categoria_nombre,
            inventario_consolidado.total_cajas,
            inventario_consolidado.total_kilos,
            inventario_consolidado.total_peso,
            inventario_consolidado.fecha_consolidacion,
            inventario_consolidado.usuario,
            inventario_consolidado.mes_consolidacion
        FROM inventario_consolidado
        JOIN EXISTENCIA ON inventario_consolidado.existencia_id = EXISTENCIA.ID_EXISTENCIA
        JOIN CATEGORIA ON EXISTENCIA.CATEGORIA_ID_CATEGORIA = CATEGORIA.ID_CATEGORIA
        ORDER BY EXISTENCIA.NOMBRE ASC, CATEGORIA.NOMBRE ASC";

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
