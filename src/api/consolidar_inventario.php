<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$inputJSON = file_get_contents("php://input");
$data = json_decode($inputJSON, true);

// Validar datos recibidos
if (!isset($data['mes_consolidacion'])) {
    echo json_encode(["success" => false, "message" => "Falta el mes de consolidación"]);
    exit();
}

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

$mes_consolidacion = $conn->real_escape_string($data['mes_consolidacion']);
$conn->begin_transaction();

try {
    // Consolidar datos agrupados por `existencia_id`
    $sql = "INSERT INTO inventario_consolidado (existencia_id, total_cajas, total_kilos, total_peso, usuario, mes_consolidacion)
            SELECT existencia_id, SUM(cantidad_cajas), SUM(cantidad_kilos), SUM(peso_cajas), usuario, '$mes_consolidacion'
            FROM inventario_temporal
            GROUP BY existencia_id, usuario
            ON DUPLICATE KEY UPDATE 
                total_cajas = VALUES(total_cajas), 
                total_kilos = VALUES(total_kilos), 
                total_peso = VALUES(total_peso);";

    $conn->query($sql);

    // Vaciar la tabla `inventario_temporal`
    $conn->query("DELETE FROM inventario_temporal");

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Inventario consolidado con éxito"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error en la consolidación: " . $e->getMessage()]);
}
