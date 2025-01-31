<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Capturar los datos JSON
$inputJSON = file_get_contents("php://input");
$data = json_decode($inputJSON, true);

// Registrar en el log para depuración
error_log("Datos recibidos en PHP: " . print_r($data, true));

// Validar si `inventario` está presente y es un array
if (!isset($data['inventario']) || !is_array($data['inventario'])) {
    echo json_encode(["success" => false, "message" => "Datos incorrectos"]);
    exit;
}

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Preparar la inserción
$conn->begin_transaction();
try {
    foreach ($data['inventario'] as $producto) {
        $existencia_id = intval($producto['existencia_id']);
        $nombre = $conn->real_escape_string($producto['nombre']);
        $categoria_id = intval($producto['categoria_id']);
        $categoria_nombre = $conn->real_escape_string($producto['categoria_nombre']);
        $cantidad_cajas = intval($producto['cantidad_cajas']);
        $cantidad_kilos = floatval($producto['cantidad_kilos']);
        $peso_cajas = floatval($producto['peso_cajas']);
        $usuario = $conn->real_escape_string($producto['usuario']);

        // Insertar en `inventario_temporal`
        $sql = "INSERT INTO inventario_temporal (existencia_id, nombre, categoria_id, categoria_nombre, cantidad_cajas, cantidad_kilos, peso_cajas, usuario)
                VALUES ($existencia_id, '$nombre', $categoria_id, '$categoria_nombre', $cantidad_cajas, $cantidad_kilos, $peso_cajas, '$usuario')";

        if (!$conn->query($sql)) {
            throw new Exception("Error al insertar: " . $conn->error);
        }
    }

    // Confirmar transacción
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Inventario temporal guardado con éxito"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error en la inserción: " . $e->getMessage()]);
}
