import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LevelNode from './LevelNode';
import MacCharacter from './MacCharacter';
import LevelPopup from './LevelPopup';
import VideoPlayer from './VideoPlayer';
import MacExplanation from './MacExplanation';

import Level1Quiz from './Level1Quiz';

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
    const [showQuiz, setShowQuiz] = useState(false);

    const [diamonds, setDiamonds] = useState(0);

    // Custom icons map
    const customIcons = {
        1: level1Icon,
        2: level3Icon, // Swapped as requested
        3: level2Icon, // Swapped as requested
        4: level4Icon
    };

    // Level Metadata
    const levelData = {
        1: {
            section: "Los Cimientos de la Red",
            title: "Conceptos Básicos",
            color: "bg-cyan-500" // Matches the blue/cyan style of the icon
        },
        // Level 2 and 3 Swapped as per request
        2: { section: "Los Cimientos de la Red", title: "Topologías", color: "bg-cyan-500" },
        3: { section: "Los Cimientos de la Red", title: "Protocolos", color: "bg-cyan-500" },
        4: { section: "Los Cimientos de la Red", title: "Hardware", color: "bg-cyan-500" }
    };

    // Mock data for levels
    // State for levels to allow updates (Mock data became state)
    const [levels, setLevels] = useState(Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        status: i === 0 ? 'active' : 'locked', // Only first one active initially
        x: Math.sin(i) * 50 // Winding path logic
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
    }, []);

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
        // Prepare explanation
        setExplanationLevel(selectedLevel);

        // If it's Level 1, show video first
        if (selectedLevel === 1) {
            setShowVideo(true);
            setSelectedLevel(null); // Close the popup
        } else {
            proceedToLevel();
        }
    };

    const proceedToLevel = () => {
        // If the level has an explanation (Level 1 and now Level 2), show it
        // Otherwise just alert or do legacy behavior
        if (selectedLevel === 1 || selectedLevel === 2) {
            console.log("Showing explanation for level", selectedLevel);
            // Logic moved to handleVideoComplete for Lv1, but directly here for Lv2
            if (selectedLevel === 2) setShowExplanation(true);
        } else if (selectedLevel === 3) {
            setShowProtocolGame(true);
        } else {
            alert("¡Iniciando lección!");
        }

        setSelectedLevel(null); // Close popup
    };

    const handleVideoComplete = () => {
        setShowVideo(false);
        // Show explanation after video for Level 1
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

    const saveProgress = async (earnedDiamonds) => {
        // Save to Database
        try {
            // Logic to determine which level is completed based on current active game/expl
            const currentLvl = showExplanation ? explanationLevel : (showProtocolGame ? 3 : 1);

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
