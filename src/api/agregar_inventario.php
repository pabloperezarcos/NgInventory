<?php
include 'db_config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['existencia_id'], $data['cantidad_cajas'], $data['cantidad_kilos'], $data['peso_cajas'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

// Conectar a la base de datos
$conn = getDatabaseConnection("carnesag_productos");

// Obtener la categoría del producto ingresado
$sqlCategoria = "SELECT CATEGORIA.ID_CATEGORIA, CATEGORIA.NOMBRE AS CATEGORIA_NOMBRE 
                 FROM EXISTENCIA 
                 JOIN CATEGORIA ON EXISTENCIA.CATEGORIA_ID_CATEGORIA = CATEGORIA.ID_CATEGORIA
                 WHERE EXISTENCIA.ID_EXISTENCIA = ?";
$stmtCategoria = $conn->prepare($sqlCategoria);
$stmtCategoria->bind_param("i", $data['existencia_id']);
$stmtCategoria->execute();
$resultCategoria = $stmtCategoria->get_result();
$categoria = $resultCategoria->fetch_assoc();

if (!$categoria) {
    echo json_encode(["success" => false, "message" => "Producto no encontrado o sin categoría asociada"]);
    exit();
}

// Insertar el producto en inventario
$sql = "INSERT INTO inventario_detalle (existencia_id, cantidad_cajas, cantidad_kilos, peso_cajas) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iidss", $data['existencia_id'], $data['cantidad_cajas'], $data['cantidad_kilos'], $data['peso_cajas']);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Producto agregado al inventario",
        "categoria_id" => $categoria["ID_CATEGORIA"],
        "categoria_nombre" => $categoria["CATEGORIA_NOMBRE"]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar"]);
}

$conn->close();
