<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Obtener datos desde el cuerpo de la solicitud
$inputJSON = file_get_contents("php://input");
$data = json_decode($inputJSON, true);

// Validar que la estructura del JSON es correcta
if (!isset($data['inventario']) || !is_array($data['inventario'])) {
    echo json_encode(["success" => false, "message" => "Datos incorrectos"]);
    exit;
}

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

$conn->begin_transaction();
try {
    foreach ($data['inventario'] as $producto) {
        $existencia_id = intval($producto['existencia_id']);
        $cantidad_cajas = intval($producto['cantidad_cajas']);
        $cantidad_kilos = floatval($producto['cantidad_kilos']);
        $peso_cajas = floatval($producto['peso_cajas']);
        $usuario = $conn->real_escape_string($producto['usuario']);

        // Insertar en `inventario_detalle`
        $sql = "INSERT INTO inventario_detalle (existencia_id, cantidad_cajas, cantidad_kilos, peso_cajas, usuario)
                VALUES ($existencia_id, $cantidad_cajas, $cantidad_kilos, $peso_cajas, '$usuario');";
        $conn->query($sql);
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Inventario guardado en detalle"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error al guardar: " . $e->getMessage()]);
}
