<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['mes_consolidacion'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

$mes_consolidacion = $data['mes_consolidacion'];

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Verificar la última versión consolidada
$sqlVersion = "SELECT COALESCE(MAX(version), 0) + 1 AS nueva_version 
               FROM inventario_consolidado 
               WHERE mes_consolidacion = ?";
$stmtVersion = $conn->prepare($sqlVersion);
$stmtVersion->bind_param("s", $mes_consolidacion);
$stmtVersion->execute();
$resultVersion = $stmtVersion->get_result();
$nuevaVersion = $resultVersion->fetch_assoc()['nueva_version'];

// Consolidar los datos agrupando por producto, incluyendo la categoría
$sqlInsert = "INSERT INTO inventario_consolidado (
                    existencia_id, 
                    total_cajas, 
                    total_kilos, 
                    total_peso, 
                    fecha_consolidacion, 
                    mes_consolidacion, 
                    version, 
                    activo
                )
                SELECT 
                    d.existencia_id, 
                    SUM(d.cantidad_cajas), 
                    SUM(d.cantidad_kilos), 
                    SUM(d.peso_cajas), 
                    NOW(), ?, ?, ?, TRUE 
                FROM inventario_detalle d
                JOIN EXISTENCIA e ON d.existencia_id = e.ID_EXISTENCIA
                JOIN CATEGORIA c ON e.CATEGORIA_ID_CATEGORIA = c.ID_CATEGORIA
                GROUP BY d.existencia_id";

$stmtInsert = $conn->prepare($sqlInsert);
$stmtInsert->bind_param("ssi", $mes_consolidacion, $nuevaVersion);

if ($stmtInsert->execute()) {
    echo json_encode(["success" => true, "message" => "Inventario consolidado con éxito"]);
} else {
    echo json_encode(["success" => false, "message" => "Error en la consolidación"]);
}

$conn->close();
