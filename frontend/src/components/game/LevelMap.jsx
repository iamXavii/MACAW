import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LevelNode from './LevelNode';
import MacCharacter from './MacCharacter';
import LevelPopup from './LevelPopup';
import VideoPlayer from './VideoPlayer';
import MacExplanation from './MacExplanation';

import Level1Quiz from './Level1Quiz';
import GenericQuiz from './GenericQuiz';
import MatchingGame from './MatchingGame';

// Import custom level icons
import level1Icon from '../../assets/level_1.png';
import level2Icon from '../../assets/level_2.png';
import level3Icon from '../../assets/level_3.png';
import level4Icon from '../../assets/level_4.png';
import level5Icon from '../../assets/level_5.png';
import level6Icon from '../../assets/level_6.png';
import level7Icon from '../../assets/level_7.png';
import level8Icon from '../../assets/level_8.png';
import level9Icon from '../../assets/level_9.png';
import level10Icon from '../../assets/level_10.png';
import level11Icon from '../../assets/level_11.png';
import level12Icon from '../../assets/level_12.png';
import ProtocolSorter from './ProtocolSorter'; // Import Minigame

// Import video - Ensure this file exists in your assets folder!
// If missing, the build will fail. I will create a placeholder for you.
import introVideo from '../../assets/intro_level1.mp4';
import worldBg from '../../assets/world_bg.png'; // New background

const LevelMap = () => {
    // Get user from context
    const { user, logout } = useAuth();
    const USER_ID = user?.id;

    const [selectedLevel, setSelectedLevel] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationLevel, setExplanationLevel] = useState(1); // Track which level explanation to show
    const [showProtocolGame, setShowProtocolGame] = useState(false); // Level 3 Game
    const [showGenericQuiz, setShowGenericQuiz] = useState(false);
    const [showMatchingGame, setShowMatchingGame] = useState(false);

    const [quizProps, setQuizProps] = useState(null);
    const [matchingProps, setMatchingProps] = useState(null);

    const [showQuiz, setShowQuiz] = useState(false);

    const [diamonds, setDiamonds] = useState(0);

    // Custom icons map
    const customIcons = {
        1: level1Icon,
        2: level3Icon, // Swapped as requested
        3: level2Icon, // Swapped as requested
        4: level4Icon,
        5: level5Icon,
        6: level6Icon,
        7: level7Icon,
        8: level8Icon,
        9: level9Icon,
        10: level10Icon,
        11: level11Icon,
        12: level12Icon
    };

    // Level Metadata (16 Levels)
    const levelData = {
        // Module 1: Fundamentos
        1: { section: "Módulo 1: Fundamentos", title: "Conceptos Básicos", color: "bg-blue-500" },
        2: { section: "Módulo 1: Fundamentos", title: "Modelo OSI", color: "bg-blue-500" },
        3: { section: "Módulo 1: Fundamentos", title: "Dispositivos", color: "bg-blue-500" },
        4: { section: "Módulo 1: Fundamentos", title: "Topologías", color: "bg-blue-500" },

        // Module 2: Protocolos
        5: { section: "Módulo 2: Protocolos", title: "Capa Aplicación", color: "bg-indigo-500" },
        6: { section: "Módulo 2: Protocolos", title: "Transporte (TCP/UDP)", color: "bg-indigo-500" },
        7: { section: "Módulo 2: Protocolos", title: "Capa de Red", color: "bg-indigo-500" },
        8: { section: "Módulo 2: Protocolos", title: "Enrutamiento", color: "bg-indigo-500" },

        // Module 3: Seguridad
        9: { section: "Módulo 3: Seguridad", title: "Amenazas", color: "bg-red-500" },
        10: { section: "Módulo 3: Seguridad", title: "Wifi Seguro", color: "bg-red-500" },
        11: { section: "Módulo 3: Seguridad", title: "Defensa (Firewall)", color: "bg-red-500" },
        12: { section: "Módulo 3: Seguridad", title: "Vulnerabilidades", color: "bg-red-500" },

        // Module 4: Evaluación
        13: { section: "Módulo 4: Evaluación", title: "Quiz Maestro", color: "bg-yellow-500" },
        14: { section: "Módulo 4: Evaluación", title: "Misiones", color: "bg-yellow-500" },
        15: { section: "Módulo 4: Evaluación", title: "Desafío Final", color: "bg-yellow-500" },
        16: { section: "Módulo 4: Evaluación", title: "Graduación", color: "bg-yellow-500" }
    };

    // State for levels (16 levels)
    const [levels, setLevels] = useState(Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        status: i === 0 ? 'active' : 'locked',
        x: Math.sin(i) * 50 // Generic winding path
    })));

    // Track Mac's position separate from level status
    const [macPosition, setMacPosition] = useState(1);

    // Responsive path offset
    const [pathScale, setPathScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            setPathScale(window.innerWidth < 640 ? 0.5 : 1); // Less curve on mobile
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch User Progress on Mount
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                if (!USER_ID) return;
                const response = await api.get(`/progress/${USER_ID}`);
                if (response.status === 200) {
                    const data = response.data;
                    setDiamonds(data.puntos_totales);

                    // Update level locks based on nivel_actual
                    const currentLevel = data.nivel_actual;
                    setLevels(prevLevels => prevLevels.map(lvl => {
                        if (lvl.id < currentLevel) return { ...lvl, status: 'completed' }; // Previous levels completed? Or just handle active
                        if (lvl.id === currentLevel) return { ...lvl, status: 'active' };
                        return { ...lvl, status: 'locked' };
                    }));

                    // Initialize Mac at the furthest active level
                    setMacPosition(currentLevel);
                }
            } catch (error) {
                console.error("Error fetching progress:", error);
            }
        };

        fetchProgress();
    }, [USER_ID]);

    const handleReset = async () => {
        if (!confirm("¿Reiniciar progreso a 0?")) return;
        try {
            await api.post('/progress/reset', { userId: USER_ID });
            window.location.reload();
            window.location.reload();
        } catch (e) { console.error(e); }
    };

    const handleLevelClick = (id) => {
        const clickedLevel = levels.find(l => l.id === id);

        // Only allow interaction if level is not locked
        if (clickedLevel.status === 'locked') return;

        // Move Mac to the clicked level
        setMacPosition(id);

        if (selectedLevel === id) {
            setSelectedLevel(null); // Deselect if clicking again
        } else {
            setSelectedLevel(id);
        }
    };

    const handleStartLevel = () => {
        const lvlId = selectedLevel;
        setSelectedLevel(null); // Close popup

        // Level Directing Logic
        // Module 1: Fundamentos
        if (lvlId === 1) {
            setShowVideo(true); // Video -> Explanation 1
        }
        else if (lvlId === 2) {
            setExplanationLevel(2); // OSI Model Explanation
            setShowExplanation(true);
        }
        else if (lvlId === 3) {
            setMatchingProps({
                title: "Conecta los Dispositivos",
                pairs: [
                    { id: '1', left: 'Router', right: 'Enruta paquetes entre redes' },
                    { id: '2', left: 'Switch', right: 'Conecta dispositivos en LAN' },
                    { id: '3', left: 'Firewall', right: 'Protege contra intrusos' },
                    { id: '4', left: 'Modem', right: 'Modula señal analógica/digital' }
                ]
            });
            setShowMatchingGame(true);
        }
        else if (lvlId === 4) {
            setExplanationLevel(4); // Topologies Explanation
            setShowExplanation(true);
        }

        // Module 2: Protocolos
        else if (lvlId === 5) {
            setQuizProps({
                title: "Capa de Aplicación",
                questions: [
                    { question: "¿Qué protocolo usas para navegar en la web de forma segura?", options: ["HTTP", "HTTPS", "FTP", "DNS"], correctAnswer: 1 },
                    { question: "Traduce nombres de dominio (como google.com) a direcciones IP:", options: ["DHCP", "DNS", "ARP", "TCP"], correctAnswer: 1 },
                    { question: "Protocolo estándar para enviar correos electrónicos:", options: ["POP3", "IMAP", "SMTP", "HTTP"], correctAnswer: 2 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else if (lvlId === 6) {
            setShowProtocolGame(true); // Transport Layer Simulation
        }
        else if (lvlId === 7) {
            setMatchingProps({
                title: "Protocolos de Red",
                pairs: [
                    { id: '1', left: 'IP', right: 'Direccionamiento lógico global' },
                    { id: '2', left: 'ICMP', right: 'Reporte de errores (Ping)' },
                    { id: '3', left: 'ARP', right: 'Encuentra MAC usando IP' },
                    { id: '4', left: 'NAT', right: 'Traduce IPs privadas a públicas' }
                ]
            });
            setShowMatchingGame(true);
        }
        else if (lvlId === 8) {
            setQuizProps({
                title: "Enrutamiento",
                questions: [
                    { question: "¿Qué significa que una ruta sea 'Estática'?", options: ["Se aprende automáticamente", "El administrador la configura manualmente", "Cambia según el tráfico", "Es aleatoria"], correctAnswer: 1 },
                    { question: "Protocolo de enrutamiento usado en el núcleo de Internet (Backbone):", options: ["OSPF", "RIP", "BGP", "EIGRP"], correctAnswer: 2 },
                    { question: "¿Qué métrica usa RIP para elegir la mejor ruta?", options: ["Ancho de banda", "Retardo", "Conteo de saltos", "Costo monetario"], correctAnswer: 2 }
                ]
            });
            setShowGenericQuiz(true);
        }

        // Module 3: Seguridad
        else if (lvlId === 9) {
            setExplanationLevel(9); // Security Threats Explanation
            setShowExplanation(true);
        }
        else if (lvlId === 10) {
            setMatchingProps({
                title: "Seguridad WiFi",
                pairs: [
                    { id: '1', left: 'WEP', right: 'Obsoleto y fácil de hackear' },
                    { id: '2', left: 'WPA2', right: 'Estándar actual seguro (AES)' },
                    { id: '3', left: 'SSID', right: 'Nombre visible de la red' },
                    { id: '4', left: 'WPA3', right: 'Nuevo estándar con mayor protección' }
                ]
            });
            setShowMatchingGame(true);
        }
        else if (lvlId === 11) {
            setQuizProps({
                title: "Firewalls y Defensa",
                questions: [
                    { question: "¿Qué hace principalmente un Firewall?", options: ["Acelera el internet", "Filtra tráfico según reglas", "Elimina virus del disco", "Genera correos spam"], correctAnswer: 1 },
                    { question: "¿Qué puerto se suele bloquear para evitar acceso web no seguro?", options: ["80 (HTTP)", "443 (HTTPS)", "25 (SMTP)", "53 (DNS)"], correctAnswer: 0 },
                    { question: "¿Qué es una DMZ en una red?", options: ["Zona Desmilitarizada (pública)", "Zona de Máxima Seguridad", "Zona de Mantenimiento", "Zona muerta"], correctAnswer: 0 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else if (lvlId === 12) {
            setQuizProps({
                title: "Vulnerabilidades",
                questions: [
                    { question: "¿Qué es un ataque de Phishing?", options: ["Pescar en línea", "Infectar con USB", "Engañar por correo para robar datos", "Apagar un servidor"], correctAnswer: 2 },
                    { question: "¿Qué es un ataque DDoS?", options: ["Robo de base de datos", "Denegación de servicio distribuida", "Descarga de datos oscuros", "Doble dominio seguro"], correctAnswer: 1 },
                    { question: "¿Qué es 'Ingeniería Social'?", options: ["Programar en grupo", "Manipular personas para obtener acceso", "Diseñar redes sociales", "Configurar routers"], correctAnswer: 1 }
                ]
            });
            setShowGenericQuiz(true);
        }

        // Module 4: Evaluación
        else if (lvlId === 13) {
            setQuizProps({
                title: "Maestro de Redes: Fase 1",
                questions: [
                    { question: "¿Qué capa del modelo OSI maneja el direccionamiento físico (MAC)?", options: ["Red", "Enlace de Datos", "Física", "Transporte"], correctAnswer: 1 },
                    { question: "¿Cuál es una dirección IP privada de clase C?", options: ["192.168.1.5", "8.8.8.8", "10.0.0.1", "172.16.0.1"], correctAnswer: 0 },
                    { question: "¿TCP es orientado a conexión o sin conexión?", options: ["Sin conexión (rápido)", "Orientado a conexión (fiable)", "Ninguna", "Ambas"], correctAnswer: 1 },
                    { question: "¿Qué dispositivo separa dominios de broadcast?", options: ["Hub", "Switch", "Router", "Repetidor"], correctAnswer: 2 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else if (lvlId === 14) {
            setQuizProps({
                title: "Misiones Tácticas",
                questions: [
                    { question: "MISIÓN: Un usuario se queja de que no puede salir a internet, pero sí ve la impresora local. ¿El problema probable es?", options: ["El cable de red", "La Puerta de Enlace (Gateway)", "El Switch", "El Driver de video"], correctAnswer: 1 },
                    { question: "MISIÓN: Debes conectar dos edificios a 500 metros. ¿Qué medio usas?", options: ["Cable UTP Cat5", "Fibra Óptica", "Cable Coaxial", "Bluetooth"], correctAnswer: 1 },
                    { question: "MISIÓN: Detectas tráfico inusual en el puerto 23 (Telnet). ¿Qué haces?", options: ["Nada, es seguro", "Lo bloqueas y usas SSH", "Abres más puertos", "Reinicias el servidor"], correctAnswer: 1 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else if (lvlId === 15) {
            setQuizProps({
                title: "Desafío Final",
                questions: [
                    { question: "¿Qué comando usas para ver la ruta que toman los paquetes?", options: ["ping", "ipconfig", "tracert / traceroute", "netstat"], correctAnswer: 2 },
                    { question: "Si usas máscara 255.255.255.0 (/24), ¿cuántos hosts usables tienes?", options: ["256", "254", "255", "512"], correctAnswer: 1 },
                    { question: "¿Qué es la Latencia?", options: ["Ancho de banda total", "Pérdida de paquetes", "Tiempo que tarda un paquete en llegar", "Número de saltos"], correctAnswer: 2 },
                    { question: "¿Qué protocolo asegura la navegación web?", options: ["HTTP", "SSL/TLS (HTTPS)", "FTP", "TFTP"], correctAnswer: 1 },
                    { question: "¿El 'Handshake' de 3 vías pertenece a...?", options: ["UDP", "ICMP", "TCP", "IP"], correctAnswer: 2 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else if (lvlId === 16) {
            setExplanationLevel(16); // Graduation Celebration
            setShowExplanation(true);
        }
    };

    const handleVideoComplete = () => {
        setShowVideo(false);
        setExplanationLevel(1);
        setShowExplanation(true);
    };

    const handleExplanationComplete = async () => {
        setShowExplanation(false);
        await saveProgress(10);
    };

    const handleProtocolGameComplete = async () => {
        setShowProtocolGame(false);
        await saveProgress(10);
    };

    const handleGameComplete = async (score) => {
        setShowGenericQuiz(false);
        setShowMatchingGame(false);
        await saveProgress(score || 10);
    };

    const saveProgress = async (earnedDiamonds) => {
        // Save to Database
        try {
            // Logic to determine which level is completed based on current active game/expl
            // Usage of macPosition is safer as it tracks the level we clicked to enter
            const currentLvl = macPosition;

            console.log("Saving progress to DB...", { userId: USER_ID, levelId: currentLvl, diamonds: earnedDiamonds });
            console.log("Saving progress to DB...", { userId: USER_ID, levelId: currentLvl, diamonds: earnedDiamonds });
            const response = await api.post('/progress/complete', {
                userId: USER_ID,
                levelId: currentLvl,
                diamonds: earnedDiamonds
            });

            if (response.status === 200) {
                const data = response.data;
                console.log("Progress saved:", data);

                // Only update diamonds if points were actually added
                if (data.pointsAdded > 0) {
                    setDiamonds(prev => prev + data.pointsAdded);
                }

                // Update Levels State (Unlock next level based on backend truth)
                const currentBackendLevel = data.nivel_actual;

                setLevels(prevLevels => prevLevels.map(lvl => {
                    if (lvl.id === currentBackendLevel) return { ...lvl, status: 'active' };
                    if (lvl.id < currentBackendLevel) return { ...lvl, status: 'completed' };
                    return lvl;
                }));

                // Move Mac to new active level
                setMacPosition(currentBackendLevel);
            }
        } catch (error) {
            console.error("Failed to save progress:", error);
            alert("Error guardando progreso: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex flex-col items-center py-20 overflow-hidden"
            onClick={() => setSelectedLevel(null)}
            style={{ backgroundImage: `url(${worldBg})` }}
        >
            {/* Background elements (clouds, etc could go here) */}
            <div className="absolute inset-0 bg-white/40 z-0 pointer-events-none" />

            {/* Diamonds Display */}
            <div className="absolute top-4 left-4 z-50 flex gap-4">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-primary-100 flex items-center gap-2 animate-in slide-in-from-top-4 duration-500">
                    <span className="text-2xl">💎</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                        {diamonds}
                    </span>
                </div>
                <button onClick={handleReset} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                    Reset
                </button>
            </div>

            {/* Logout Button */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={logout}
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full shadow-lg border border-gray-600 transition-all hover:scale-105 active:scale-95 text-sm"
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* Video Player Overlay */}
            {showVideo && (
                <VideoPlayer
                    src={introVideo}
                    onComplete={handleVideoComplete}
                    onSkip={handleVideoComplete}
                />
            )}

            {/* Mac Explanation Overlay */}
            {showExplanation && (
                <MacExplanation
                    level={explanationLevel} // Pass the active level
                    onComplete={handleExplanationComplete}
                    onClose={() => setShowExplanation(false)} // Add Close handler
                />
            )}

            {/* Protocol Sorter Level 3 Game */}
            {showProtocolGame && (
                <ProtocolSorter
                    onComplete={handleProtocolGameComplete}
                    onClose={() => setShowProtocolGame(false)}
                />
            )}

            {showGenericQuiz && quizProps && (
                <GenericQuiz
                    levelId={macPosition}
                    title={quizProps.title}
                    questions={quizProps.questions}
                    onComplete={(score) => handleGameComplete(score)}
                    onClose={() => setShowGenericQuiz(false)}
                />
            )}

            {showMatchingGame && matchingProps && (
                <MatchingGame
                    title={matchingProps.title}
                    pairs={matchingProps.pairs}
                    onComplete={(score) => handleGameComplete(score)}
                    onClose={() => setShowMatchingGame(false)}
                />
            )}

            <div className="w-full max-w-md relative z-10 flex flex-col gap-8 pb-32 mt-10">
                {levels.map((level, index) => {
                    // Calculate offset for winding path
                    // Standard sine wave pattern for vertical scrolling path
                    const offset = Math.sin(index * 0.8) * 60 * pathScale;
                    const isSelected = selectedLevel === level.id;

                    return (
                        <div
                            key={level.id}
                            className={`flex justify-center relative ${isSelected ? 'z-50' : 'z-0'}`}
                            style={{ transform: `translateX(${offset}px)` }}
                            onClick={(e) => e.stopPropagation()} // Prevent background click from closing
                        >
                            {/* Popup for selected level */}
                            {isSelected && (
                                <LevelPopup
                                    sectionTitle={levelData[level.id]?.section || "Sección"}
                                    levelTitle={levelData[level.id]?.title || `Nivel ${level.id}`}
                                    color={levelData[level.id]?.color}
                                    onStart={handleStartLevel}
                                    onClose={() => setSelectedLevel(null)}
                                />
                            )}

                            <LevelNode
                                level={level.id}
                                status={level.status}
                                isCurrent={level.status === 'active'}
                                customIcon={customIcons[level.id]}
                                onClick={() => handleLevelClick(level.id)}
                            />

                            {/* Mac Character sitting on the active level or selected level */}
                            {macPosition === level.id && (
                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500 ease-in-out">
                                    <MacCharacter />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelMap;
