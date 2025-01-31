<?php
include 'db_config.php';

header("Content-Type: application/json; charset=utf-8");

// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");

// Permitir métodos HTTP específicos (GET, POST, OPTIONS)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Permitir las cabeceras necesarias
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Consulta de productos
$sql = "SELECT
    EXISTENCIA.ID_EXISTENCIA,
    EXISTENCIA.NOMBRE,
    EXISTENCIA.UNIDAD,
    EXISTENCIA.CATEGORIA_ID_CATEGORIA,
    CATEGORIA.NOMBRE AS CATEGORIA_NOMBRE,
    EXISTENCIA.ACTIVOPARAVENTA
FROM
    EXISTENCIA
JOIN CATEGORIA ON EXISTENCIA.CATEGORIA_ID_CATEGORIA = CATEGORIA.ID_CATEGORIA";
$result = $conn->query($sql);

$productos = [];
while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode(["success" => true, "data" => $productos]);

$conn->close();
