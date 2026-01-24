const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'redes_db',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
};

const DB_NAME = process.env.DB_NAME || 'redes_db';

async function setup() {
    let connection;
    try {
        console.log(`⏳ Conectando a MySQL en: ${dbConfig.host}...`);
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión establecida.');

        // Crear base de datos
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        await connection.changeUser({ database: DB_NAME });

        console.log('🔄 Renovando esquema de temario...');

        // Desactivar FK checks para poder borrar tablas en cualquier orden
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // BORRAR tablas de contenido antiguas para asegurar esquema nuevo (contenido, insignias)
        // Mantenemos la tabla de 'usuarios' para no borrar a los registrados
        await connection.query('DROP TABLE IF EXISTS lecciones');
        await connection.query('DROP TABLE IF EXISTS modulos');
        await connection.query('DROP TABLE IF EXISTS usuario_insignias');
        await connection.query('DROP TABLE IF EXISTS insignias');

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Definir tablas
        const schema = `
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

        CREATE TABLE IF NOT EXISTS modulos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            descripcion TEXT,
            orden INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

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

        CREATE TABLE IF NOT EXISTS insignias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            descripcion TEXT,
            puntos_requeridos INT NOT NULL,
            icono_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS usuario_insignias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            insignia_id INT NOT NULL,
            fecha_obtencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (insignia_id) REFERENCES insignias(id) ON DELETE CASCADE
        );
        `;

        await connection.query(schema);
        console.log('✅ Tablas recreadas correctamente.');

        // INSERTAR NUEVO CONTENIDO
        console.log('🌱 Insertando nuevo temario...');

        // Insertar Módulos
        await connection.query(`
            INSERT INTO modulos (id, titulo, descripcion, orden) VALUES 
            (1, 'Fundamentos de redes informáticas', 'Conceptos básicos, Modelo OSI y Dispositivos', 1),
            (2, 'Protocolos de comunicación', 'Capas de aplicación, transporte, red y enrutamiento', 2),
            (3, 'Seguridad en redes', 'Vulnerabilidades, ataques y protección', 3),
            (4, 'Evaluación gamificada', 'Retos, ranking y misiones', 4);
        `);

        // Insertar Lecciones
        // Estructura: [modulo_id, titulo, contenido, dinamica_sugerida, orden]
        const leccionesValues = [
            // Módulo 1: Fundamentos de redes
            [1, 'Conceptos básicos de redes', 'Definición, tipos y clasificación', 'Quiz', 1],
            [1, 'Modelo OSI y modelo TCP/IP', 'Capas, funciones y comparaciones', 'Arrastrar y soltar capas', 2],
            [1, 'Dispositivos de red', 'Routers, switches, firewalls, access points', 'Emparejar dispositivos', 3],
            [1, 'Topologías de red', 'Estrella, bus, anillo, malla, híbrida', 'Construcción de topología', 4],

            // Módulo 2: Protocolos de comunicación
            [2, 'Protocolos de capa de aplicación', 'HTTP/HTTPS, FTP, SMTP, DNS', 'Completar frases', 1],
            [2, 'Protocolos de transporte', 'TCP y UDP', 'Simulación de tráfico', 2],
            [2, 'Protocolos de red y clasificación', 'IP, ICMP, ARP (Capas)', 'Clasificación de protocolos', 3],
            [2, 'Protocolos de enrutamiento', 'RIP, OSPF, BGP', 'Reto de tiempo limitado', 4],

            // Módulo 3: Seguridad en redes
            [3, 'Detección de amenazas', 'Sniffing, spoofing, DoS/DDoS, phishing', 'Juego de detección', 1],
            [3, 'Seguridad inalámbrica', 'WEP, WPA, WPA2, WPA3', 'Escenario WiFi interactivo', 2],
            [3, 'Medidas de seguridad', 'Firewalls y detección de intrusos', 'Casos prácticos', 3],
            [3, 'Análisis de vulnerabilidades', 'Esquema de ataques y mitigación', 'Rompecabezas de vulnerabilidades', 4],

            // Módulo 4: Evaluación gamificada
            [4, 'Cuestionario Maestro', 'Evaluación rápida y precisa', 'Cuestionarios dinámicos', 1],
            [4, 'Misiones Temáticas', 'Retos de experto y defensor', 'Misiones temáticas', 2],
            [4, 'Desafío Final', 'Aplicación de todo lo aprendido', 'Caso integrador', 3],
            [4, 'Graduación', 'Ceremonia de medallas y ranking', 'Ranking y celebración', 4]
        ];

        for (const leccion of leccionesValues) {
            await connection.query(
                'INSERT INTO lecciones (modulo_id, titulo, contenido, dinamica_sugerida, orden) VALUES (?, ?, ?, ?, ?)',
                leccion
            );
        }

        // Insertar Insignias
        await connection.query(`
            INSERT INTO insignias (nombre, descripcion, puntos_requeridos, icono_url) VALUES 
            ('Novato de Redes', 'Completa el Módulo 1', 100, 'badge_novato.png'),
            ('Experto en Protocolos', 'Domina los protocolos del Módulo 2', 300, 'badge_experto.png'),
            ('Defensor de la Red', 'Completa el módulo de Seguridad', 600, 'badge_defensor.png'),
            ('Maestro de la Red', 'Completa todo el curso con excelencia', 1000, 'badge_master.png');
        `);

        console.log('✅ Base de datos actualizada con ÉXITO.');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

setup();
