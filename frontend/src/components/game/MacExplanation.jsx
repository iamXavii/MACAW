import React, { useState, useEffect, useRef } from 'react';

// Import local sprites
// Note: Vite/Webpack handles imports by string path if we were dynamic, 
// but explicit imports are safer for bundling.
import sprite1 from '../../assets/sprites/explanation/mac_talk_1.png';
import sprite2 from '../../assets/sprites/explanation/mac_talk_2.png';
import sprite3 from '../../assets/sprites/explanation/mac_talk_3.png';
import sprite4 from '../../assets/sprites/explanation/mac_talk_4.png';
import sprite5 from '../../assets/sprites/explanation/mac_talk_5.png';

import quizSprite1 from '../../assets/sprites/explanation/mac_quiz_1.png';
import quizSprite2 from '../../assets/sprites/explanation/mac_quiz_2.png';

import errorSprite1 from '../../assets/sprites/explanation/mac_error_1.png';
import errorSprite2 from '../../assets/sprites/explanation/mac_error_2.png';

import correctSprite1 from '../../assets/sprites/explanation/mac_correct_1.png';
import correctSprite2 from '../../assets/sprites/explanation/mac_correct_2.png';

// Import local images for lessons
import busTopologyImg from '../../assets/diagrams/bus_topology.png';
import ringTopologyImg from '../../assets/diagrams/ring_topology.jpg';
import starTopologyImg from '../../assets/diagrams/star_topology.jpg';

// Import Audio
import introAudio from '../../assets/descarga (3).wav';
import lanAudio from '../../assets/LAN_ Tu Territorio.wav';
import wanAudio from '../../assets/WAN_ La Autopista Pública.wav';
import quizAudio from '../../assets/descarga (4).wav';
import level2FullAudio from '../../assets/Level2_FullAudio.wav'; // Renamed file
import busAudio from '../../assets/Bus_Topology.wav'; // Re-imported for Page 1
import meshTreeAudio from '../../assets/mesh_tree.wav'; // New audio for Mesh and Tree
import summaryAudio from '../../assets/descarga (9).wav'; // New audio for Summary

import meshTopologyImg from '../../assets/diagrams/mesh_topology.jpg';
import treeTopologyImg from '../../assets/diagrams/tree_topology.jpg';

const MacExplanation = ({ onComplete, onClose, level = 1 }) => {
    const [step, setStep] = useState(0);
    const [spriteIndex, setSpriteIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio(introAudio));

    // Quiz State
    const [selectedOption, setSelectedOption] = useState(null);

    const [showFeedback, setShowFeedback] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showExitWarning, setShowExitWarning] = useState(false);

    const levelContent = {
        1: [
            {
                title: "¿Qué es una Red?",
                text: "Una Red de Computadoras es simplemente un equipo de dispositivos que deciden dejar de trabajar solos para empezar a cooperar. No se trata solo de cables; se trata de compartir.\n\n¿Necesitas imprimir? Compartes hardware.\n\n¿Envías un archivo? Compartes datos.\n\n¿Abres una web? Compartes servicios.\n\nPero, dependiendo de qué tan lejos estén esos dispositivos, el nombre del juego cambia..."
            },
            {
                title: "La LAN: Tu Territorio",
                text: "Primero, hablemos de la LAN (Local Area Network). Piénsalo como 'Tu Territorio'. Estas redes viven en espacios reducidos, como tu casa, una oficina o un solo edificio. Aquí el jefe eres tú: tú compras el equipo, pones los cables y controlas la velocidad. Su gran ventaja es que es privada y extremadamente rápida; es como gritar en la sala de tu casa: ¡todos te oyen al instante!",
            },
            {
                title: "La WAN: La Autopista Pública",
                text: "Por otro lado, tenemos la WAN (Wide Area Network), que es básicamente 'La Autopista Pública'. Estas redes conectan ciudades, países o continentes enteros (de hecho, ¡Internet es la WAN más grande del mundo!). Aquí ya no mandas tú, sino los Proveedores de Servicio (ISP), y debes pagar 'peaje' por usar su infraestructura, como fibra submarina o satélites. Su función es vital: conectar múltiples LANs entre sí. Sin la WAN, tu pequeña red privada sería una isla aislada y desconectada del mundo."
            },
            {
                type: 'quiz',
                title: "¡Pon a prueba tu instinto!",
                text: "Imagina la escena: Estás en tu oficina y envías un documento urgente a la impresora que está en la misma sala. La pregunta del millón es: ¿Quién se encarga de entregar ese paquete de datos? ¿Será el Router? ¿Será el Módem? ¿O será el Switch?",
                question: "Estás enviando un archivo a la impresora que está a tu lado en la oficina. ¿Qué dispositivo se encarga principalmente de entregar ese dato?",
                options: [
                    { id: 'A', label: 'El Router' },
                    { id: 'B', label: 'El Modem' },
                    { id: 'C', label: 'El Switch' }
                ]
            }
        ],
        2: [
            {
                title: "Topologías de Red",
                text: "¡Atención, ingenieros! No basta con tener los equipos; la magia está en cómo los conectamos. A esto lo llamamos Topología.\n\n-- Topología de Bus --\nEs la abuelita de las redes. Un único cable central (Backbone) conecta a todos. Si falla el cable, falla toda la red.",
                image: busTopologyImg,
                imageCaption: "Bus: Si falla el cable, falla todo"
            },
            {
                title: "Topologías Avanzadas",
                sections: [
                    {
                        text: "-- Topología de Anillo --\nPara arreglar el caos, inventamos la Topología de Anillo. Aquí todo es disciplina. Los equipos forman un círculo cerrado y los datos viajan en una sola dirección usando un Token. Solo el que tiene el token puede hablar. Es organizada, pero si se corta el anillo, adiós red.",
                        image: ringTopologyImg,
                        caption: "Anillo: El token pone orden"
                    },
                    {
                        text: "-- Topología de Estrella --\n¡La reina indiscutible! Todos los nodos se conectan a un switch central. Si un cable falla, solo se desconecta esa PC. Su debilidad es el centro: si el Switch muere, morimos todos. ¡Pero vale la pena!",
                        image: starTopologyImg,
                        caption: "Estrella: El Switch es el rey"
                    }
                ]
            },
            {
                title: "Topologías Masivas",
                sections: [
                    {
                        title: "El Tanque de Guerra: Malla",
                        text: "Ahora, ¿qué pasa si el fallo NO es una opción? Sacamos el tanque de guerra: La Topología de Malla. Aquí conectamos todo con todo (o casi todo). Ofrece redundancia total: si un enlace falla, el tráfico automáticamente toma otro camino.\n\nEs prácticamente indestructible, es lo que usamos en Internet. ¿El problema? Es carísima y un dolor de cabeza llenarlo todo de cables.",
                        image: meshTopologyImg,
                        caption: "Malla: Indestructible"
                    },
                    {
                        title: "Topología de Árbol",
                        text: "Finalmente, si la red es gigante, usamos la Topología de Árbol. Piénsalo como un organigrama. Tienes un Switch 'Jefe' arriba, que conecta a Switches 'Gerentes' en cascada, y estos a las computadoras. Es excelente para organizar redes grandes.",
                        image: treeTopologyImg,
                        caption: "Árbol: Jerárquico"
                    }
                ]
            },
            {
                title: "Resumen de Ingeniero",
                text: "Ahí lo tienes: Bus, Anillo, Estrella, Malla y Árbol. Como ingeniero, tu misión es elegir la correcta según el presupuesto y la seguridad que necesites. Repasa los diagramas, ¡porque esto va para el examen! Nos vemos en el siguiente nodo.",
                type: 'celebration'
            }
        ]
    };

    const content = levelContent[level] || levelContent[1]; // Fallback to level 1

    const currentContent = content[step];

    // Debugging crash
    console.log("MacExplanation Render:", { level, step, hasContent: !!currentContent, contentType: currentContent?.type });

    if (!currentContent) {
        return <div className="fixed inset-0 bg-white z-50 flex items-center justify-center text-red-600 font-bold">Error: No content for Step {step}</div>;
    }

    const normalSprites = [sprite1, sprite2, sprite3, sprite4, sprite5];
    const quizSprites = [quizSprite1, quizSprite2];

    const errorSprites = [errorSprite1, errorSprite2];
    const correctSprites = [correctSprite1, correctSprite2];

    // Choose sprites based on content type
    let activeSprites = normalSprites;
    if (showError) activeSprites = errorSprites;
    else if (showSuccess || currentContent?.type === 'celebration') activeSprites = correctSprites;
    else if (currentContent?.type === 'quiz') activeSprites = quizSprites;

    const sprites = activeSprites;

    // Audio Effect - Switch tracks on step change
    useEffect(() => {
        // Stop previous audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        // Determine new track
        let track = null;

        if (level === 1) {
            if (step === 0) track = introAudio;
            else if (step === 1) track = lanAudio;
            else if (step === 2) track = wanAudio;
            else if (step === 3) track = quizAudio;
        } else if (level === 2) {
            if (step === 0) track = busAudio;
            else if (step === 1) track = level2FullAudio;
            else if (step === 2) track = meshTreeAudio;
            else if (step === 3) track = summaryAudio;
        }

        // Play new track
        if (track) {
            audioRef.current.src = track;
            // Ensure mute state matches component state
            audioRef.current.muted = isMuted; // Use current ref value or state

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log("Audio play failed (interaction needed):", e));
            }
        }
    }, [step]);

    // Handle Mute Toggle
    useEffect(() => {
        audioRef.current.muted = isMuted;
    }, [isMuted]);

    // Animation loop
    // Animation loop
    useEffect(() => {
        setSpriteIndex(0); // Reset index on sprite set change
    }, [currentContent?.type]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSpriteIndex((prev) => (prev + 1) % sprites.length);
        }, 1500); // 1.5 seconds per frame

        return () => clearInterval(interval);
    }, [sprites]);



    const handleBack = () => {
        try {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } catch (e) {
            console.log("Audio pause error:", e);
        }

        if (step > 0) {
            setStep(step - 1);
            setShowError(false);
            setShowSuccess(false);
        }
    };

    const handleNext = () => {
        // Stop audio immediately on interaction
        try {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } catch (e) {
            console.log("Audio pause error:", e);
        }

        if (currentContent.type === 'quiz' && !showSuccess) {
            if (selectedOption !== 'C') { // 'C' is the Switch (Correct)
                setShowError(true);
                setSelectedOption(null); // Reset selection to force re-selection
                return; // Stop here
            } else {
                setShowError(false);
                setShowSuccess(true);
                return; // Show success state before completing
            }
        }

        if (step < content.length - 1) {
            setStep(step + 1);
            setShowError(false); // Reset error state on step change
            setShowSuccess(false);
        } else {
            onComplete();
        }
    };

    const handleCloseAttempt = () => {
        audioRef.current.pause();
        setShowExitWarning(true);
    };

    const confirmClose = () => {
        onClose();
    };

    const cancelClose = () => {
        setShowExitWarning(false);
        // Only resume if not muted and was playing (simplified: just resume if not ended)
        if (!isMuted && audioRef.current.paused && audioRef.current.currentTime > 0) {
            audioRef.current.play().catch(e => console.log("Resume failed", e));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl h-[85vh] md:h-[600px] flex flex-col md:flex-row relative mx-4">

                {/* Controls Header */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
                    {/* Mute Button */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-all"
                        title={isMuted ? "Activar sonido" : "Silenciar"}
                    >
                        {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        )}
                    </button>

                    {/* Return to Map Button */}
                    <button
                        onClick={handleCloseAttempt}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 border border-red-200 text-sm"
                    >
                        Volver al mapa
                    </button>
                </div>

                {/* Character Column */}
                <div className="w-full md:w-1/3 bg-blue-100 flex flex-col items-center justify-end pt-4 md:pt-8 relative overflow-hidden shrink-0 h-1/3 md:h-auto">
                    {/* Decorative circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/50 rounded-full blur-xl"></div>

                    {/* WAN Specific Note - Speech Bubble */}
                    {step === 2 && level === 1 && (
                        <div className="relative z-20 mb-4 mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-blue-400 relative">
                                <p className="text-sm text-gray-700 font-medium text-center leading-snug">
                                    <span className="block text-blue-600 font-bold mb-1">💡 Analogía:</span>
                                    "Piénsalo así: Una LAN son las calles dentro de tu urbanización (privadas y cortas). Una WAN son las autopistas interestatales que conectan las ciudades (públicas y enormes). ¡Ambas son vitales!"
                                </p>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-400 transform rotate-45"></div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Scenario Feedback */}
                    {currentContent.type === 'quiz' && !showError && !showSuccess && (
                        <div className="relative z-20 mb-4 mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-indigo-400 relative">
                                <p className="text-sm text-gray-700 font-medium text-center leading-snug">
                                    <span className="block text-indigo-600 font-bold mb-1">🤔 Escenario:</span>
                                    "{currentContent.text}"
                                </p>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-indigo-400 transform rotate-45"></div>
                            </div>
                        </div>
                    )}

                    {/* Error Feedback */}
                    {showError && (
                        <div className="relative z-20 mb-4 mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-red-50 rounded-2xl p-5 shadow-lg border-2 border-red-400 relative">
                                <p className="text-sm text-gray-800 font-bold text-center leading-snug">
                                    <span className="block text-red-600 text-lg mb-1">¡Error de capa 2!</span>
                                    Recuerda: El Router y el Módem son para salir a Internet (WAN). Si te quedas dentro de la oficina (LAN), el jefe es el Switch. ¡Inténtalo de nuevo!
                                </p>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-50 border-b-2 border-r-2 border-red-400 transform rotate-45"></div>
                            </div>
                        </div>
                    )}

                    {/* Success Feedback */}
                    {showSuccess && (
                        <div className="relative z-20 mb-4 mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-green-50 rounded-2xl p-5 shadow-lg border-2 border-green-400 relative">
                                <p className="text-sm text-gray-800 font-bold text-center leading-snug">
                                    <span className="block text-green-600 text-lg mb-1">¡Exacto!</span>
                                    Diste en el clavo. Como el tráfico es local (es decir, no sale a Internet), el Switch toma el control. Él usa la Dirección MAC para entregar el paquete directamente a la impresora sin molestar al Router. ¡Eficiencia pura!
                                </p>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-50 border-b-2 border-r-2 border-green-400 transform rotate-45"></div>
                            </div>
                        </div>
                    )}

                    {/* Mac Sprite */}
                    <div className="relative z-10 w-40 h-40 md:w-64 md:h-64 flex items-end justify-center mb-[-10px] md:mb-[-20px] flex-shrink-0">
                        <img
                            src={sprites[spriteIndex]}
                            alt="Mac explicando"
                            className="w-full h-full object-contain filter drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* Content Column */}
                <div className="w-full md:w-2/3 p-4 md:p-12 pb-20 md:pb-24 flex flex-col relative h-2/3 md:h-auto bg-white">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4 text-primary-600 shrink-0">
                        {currentContent.title}
                    </h2>

                    {/* Text/Content Area - Dynamic height with flex-1 */}
                    <div className="bg-amber-50 rounded-xl p-4 md:p-6 border-l-4 border-amber-400 mb-0 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        {/* Standard Text Content */}
                        {(!currentContent.type || currentContent.type !== 'quiz') && (
                            <div className="space-y-6 pb-4">
                                {currentContent?.sections && Array.isArray(currentContent.sections) ? (
                                    currentContent.sections.map((section, idx) => (
                                        <div key={idx} className="flex flex-col gap-3 pb-4 border-b border-amber-200 last:border-0 last:pb-0">
                                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                                {section.text}
                                            </p>
                                            {section.image && (
                                                <div className="flex flex-col items-center mt-2">
                                                    <div className="bg-white p-2 rounded-xl shadow-md border-2 border-gray-100 max-w-[280px]">
                                                        <img
                                                            src={section.image}
                                                            alt={`Diagrama ${idx}`}
                                                            className="rounded-lg w-full h-auto object-contain"
                                                        />
                                                    </div>
                                                    {section.caption && (
                                                        <p className="text-red-600 font-bold mt-1 text-xs bg-red-50 px-3 py-1 rounded-full border border-red-200">
                                                            {section.caption}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                            {currentContent.text}
                                        </p>
                                        {currentContent.image && (
                                            <div className="flex flex-col items-center mt-4">
                                                <div className="bg-white p-2 rounded-xl shadow-md border-2 border-gray-100 max-w-[300px]">
                                                    <img
                                                        src={currentContent.image}
                                                        alt={currentContent.title}
                                                        className="rounded-lg w-full h-auto object-contain"
                                                    />
                                                </div>
                                                {currentContent.imageCaption && (
                                                    <p className="text-red-600 font-bold mt-2 text-sm bg-red-50 px-3 py-1 rounded-full border border-red-200">
                                                        ⚠️ {currentContent.imageCaption}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Quiz Content */}
                        {currentContent.type === 'quiz' && (
                            <div className="flex flex-col h-full">
                                <p className="text-sm font-bold text-indigo-700 bg-indigo-100 p-2 rounded-lg mb-4">
                                    PREGUNTA: {currentContent.question}
                                </p>
                                <div className="space-y-3 flex-grow overflow-y-auto">
                                    {currentContent.options.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSelectedOption(opt.id)}
                                            className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedOption === opt.id
                                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                : 'border-gray-200 hover:border-indigo-300 hover:bg-white'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === opt.id ? 'border-indigo-600' : 'border-gray-300'}`}>
                                                {selectedOption === opt.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                            </div>
                                            <span className="text-gray-700 font-medium text-sm">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons - Absolute Bottom */}
                    <div className="absolute bottom-6 left-0 w-full px-12 flex justify-between items-center">
                        {/* Back Button */}
                        <div className="flex-1">
                            {step > 0 && (
                                <button
                                    onClick={handleBack}
                                    className="text-gray-500 hover:text-blue-600 font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 hover:bg-gray-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Anterior
                                </button>
                            )}
                        </div>

                        {/* Next Button */}
                        <div className="flex-1 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={currentContent.type === 'quiz' && !selectedOption && !showSuccess}
                                className={`font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 ${currentContent.type === 'quiz' && !selectedOption && !showSuccess
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                            >
                                {showSuccess ? "Finalizar" : step < content.length - 1 ? "Siguiente" : "Confirmar"}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                    {content.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Exit Warning Modal */}
            {showExitWarning && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
                            <p className="text-gray-600 mb-6">
                                Si sales ahora, <strong>perderás todo el progreso</strong> de este nivel y tendrás que empezar de nuevo.
                            </p>
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={cancelClose}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmClose}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                                >
                                    Salir del Nivel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MacExplanation;
