-- Desactivar verificación de claves foráneas para evitar errores al borrar
SET FOREIGN_KEY_CHECKS = 0;

-- Borrar tablas si existen (para empezar limpio)
DROP TABLE IF EXISTS lecciones;
DROP TABLE IF EXISTS modulos;
DROP TABLE IF EXISTS usuario_insignias;
DROP TABLE IF EXISTS insignias;
-- No borramos 'usuarios' por si acaso, pero si la base es nueva no importa.
-- DROP TABLE IF EXISTS usuarios; 

SET FOREIGN_KEY_CHECKS = 1;

-- Crear Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'estudiante',
    puntos_totales INT DEFAULT 0,
    nivel_actual INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear Tabla Módulos
CREATE TABLE IF NOT EXISTS modulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear Tabla Lecciones
CREATE TABLE IF NOT EXISTS lecciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modulo_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    dinamica_sugerida TEXT,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE
);

-- Crear Tabla Insignias
CREATE TABLE IF NOT EXISTS insignias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    puntos_requeridos INT NOT NULL,
    icono_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear Tabla Usuario_Insignias
CREATE TABLE IF NOT EXISTS usuario_insignias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    insignia_id INT NOT NULL,
    fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (insignia_id) REFERENCES insignias(id) ON DELETE CASCADE
);

-- INSERTAR DATOS INICIALES (Módulos)
INSERT INTO modulos (id, titulo, descripcion, orden) VALUES 
(1, 'Fundamentos de redes informáticas', 'Conceptos básicos, Modelo OSI y Dispositivos', 1),
(2, 'Protocolos de comunicación', 'Capas de aplicación, transporte, red y enrutamiento', 2),
(3, 'Seguridad en redes', 'Vulnerabilidades, ataques y protección', 3),
(4, 'Evaluación gamificada', 'Retos, ranking y misiones', 4);

-- Insertar Datos (Lecciones)
-- Módulo 1
INSERT INTO lecciones (modulo_id, titulo, contenido, dinamica_sugerida, orden) VALUES
(1, 'Conceptos básicos de redes', 'Definición, tipos y clasificación', 'Quiz', 1),
(1, 'Modelo OSI y modelo TCP/IP', 'Capas, funciones y comparaciones', 'Arrastrar y soltar capas', 2),
(1, 'Topologías de red', 'Estrella, bus, anillo, malla, híbrida', 'Construcción de topología', 3),
(1, 'Dispositivos de red', 'Routers, switches, firewalls, APs', 'Juego de emparejar', 4),

-- Módulo 2
(2, 'Protocolos de capa de aplicación', 'HTTP/HTTPS, FTP, SMTP, DNS', 'Completar frases', 1),
(2, 'Protocolos de capa de transporte', 'TCP y UDP', 'Simulación de tráfico', 2),
(2, 'Protocolos de capa de red', 'IP, ICMP, ARP', 'Clasificación de protocolos', 3),
(2, 'Protocolos de enrutamiento', 'RIP, OSPF, BGP', 'Reto de identificación', 4),
(2, 'Protocolos de seguridad', 'SSL/TLS, IPSec, VPN', 'Quiz', 5),

-- Módulo 3
(3, 'Conceptos de vulnerabilidades', 'Amenazas en redes', 'Juego de detección', 1),
(3, 'Tipos de ataques comunes', 'Sniffing, spoofing, DoS/DDoS, phishing', 'Identificar ataques', 2),
(3, 'Seguridad en redes inalámbricas', 'WEP, WPA, WPA2, WPA3', 'Escenario interactivo WiFi', 3),
(3, 'Firewalls y IDS/IPS', 'Sistemas de detección y prevención', 'Configuración de firewall', 4),
(3, 'Buenas prácticas de seguridad', 'Políticas de acceso', 'Casos prácticos', 5),

-- Módulo 4
(4, 'Evaluación Final', 'Cuestionarios dinámicos y misiones', 'Ranking y Misiones', 1);

-- Insertar Datos (Insignias)
INSERT INTO insignias (nombre, descripcion, puntos_requeridos, icono_url) VALUES 
('Novato de Redes', 'Completa el Módulo 1', 100, 'badge_novato.png'),
('Experto en Protocolos', 'Domina los protocolos del Módulo 2', 300, 'badge_experto.png'),
('Defensor de la Red', 'Completa el módulo de Seguridad', 600, 'badge_defensor.png'),
('Master de Redes', 'Completa todo el curso con excelencia', 1000, 'badge_master.png');
