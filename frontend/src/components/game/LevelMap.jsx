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
        4: level4Icon
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
        if (lvlId === 1) {
            setShowVideo(true);
        }
        else if (lvlId === 2 || lvlId === 4) {
            setExplanationLevel(lvlId);
            setShowExplanation(true);
        }
        else if (lvlId === 3) {
            setMatchingProps({
                title: "Conecta los Dispositivos",
                pairs: [
                    { id: '1', left: 'Router', right: 'Enruta paquetes entre redes' },
                    { id: '2', left: 'Switch', right: 'Conecta dispositivos en LAN' },
                    { id: '3', left: 'Firewall', right: 'Filtra tráfico por seguridad' },
                    { id: '4', left: 'Access Point', right: 'Provee conexión WiFi' }
                ]
            });
            setShowMatchingGame(true);
        }
        else if (lvlId === 5) {
            setQuizProps({
                title: "Protocolos de Aplicación",
                questions: [
                    { question: "El protocolo _____ se usa para ver páginas web.", options: ["HTTP", "FTP", "SMTP", "DNS"], correctAnswer: 0 },
                    { question: "Para enviar correos electrónicos usamos:", options: ["POP3", "SMTP", "IMAP", "SNMP"], correctAnswer: 1 },
                    { question: "¿Qué protocolo transfiere archivos?", options: ["HTTP", "FTP", "SSH", "TELNET"], correctAnswer: 1 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else if (lvlId === 6) {
            setShowProtocolGame(true);
        }
        else if (lvlId === 7) {
            setMatchingProps({
                title: "Clasificación de Protocolos",
                pairs: [
                    { id: '1', left: 'IP', right: 'Direccionamiento Lógico' },
                    { id: '2', left: 'ICMP', right: 'Mensajes de Control/Error' },
                    { id: '3', left: 'ARP', right: 'Resuelve MAC desde IP' }
                ]
            });
            setShowMatchingGame(true);
        }
        else if (lvlId === 8) {
            setQuizProps({
                title: "Enrutamiento Dinámico",
                questions: [
                    { question: "¿Qué protocolo busca la ruta más corta por saltos?", options: ["OSPF", "RIP", "BGP", "EIGRP"], correctAnswer: 1 },
                    { question: "Protocolo usado en el backbone de Internet:", options: ["OSPF", "RIP", "BGP", "ISIS"], correctAnswer: 2 }
                ]
            });
            setShowGenericQuiz(true);
        }
        else {
            // Default generic quiz for upper levels
            setQuizProps({
                title: `Evaluación Nivel ${lvlId}`,
                questions: [
                    { question: "¿Estás listo para avanzar al siguiente nivel?", options: ["Sí, estoy listo", "Necesito repasar"], correctAnswer: 0 }
                ]
            });
            setShowGenericQuiz(true);
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
