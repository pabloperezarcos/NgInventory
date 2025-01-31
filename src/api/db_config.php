<?php
function getDatabaseConnection($dbName)
{
    $host = "localhost";
    $user = "carnesag_soporteag"; // Usuario de la base de datos
    $password = "7598-Ag.L"; // Contraseña de la base de datos

    // Crear conexión a la base de datos especificada
    $conn = new mysqli($host, $user, $password, $dbName);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Conexión fallida a $dbName: " . $conn->connect_error);
    }

    // Establecer el conjunto de caracteres a utf8
    if (!$conn->set_charset("utf8")) {
        throw new Exception("Error al configurar el conjunto de caracteres UTF-8: " . $conn->error);
    }
    
    return $conn;
}
