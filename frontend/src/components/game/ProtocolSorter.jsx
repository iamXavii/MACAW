import React, { useState, useRef, useEffect } from 'react';
import { Globe, FolderOpen, Mail, Book, CheckCircle, XCircle, ArrowRight, Heart, Clock, AlertTriangle } from 'lucide-react';
import macSprite from '../../assets/mac_3.png'; // Using mac_3 as "Postman" for now
import macCelebration from '../../assets/sprites/explanation/mac_correct_1.png'; // Celebration sprite

const ProtocolSorter = ({ onComplete, onClose }) => {
    // Extended Game Data
    const allQuestions = [
        {
            id: 1,
            text: "Quiero ver una página web",
            icon: <Globe className="w-12 h-12 text-blue-600" />,
            correctProtocol: "HTTP",
            feedback: "¡Correcto! HTTP es el lenguaje de la World Wide Web."
        },
        {
            id: 2,
            text: "Quiero subir mi tarea al servidor",
            icon: <FolderOpen className="w-12 h-12 text-orange-600" />,
            correctProtocol: "FTP",
            feedback: "¡Exacto! FTP (File Transfer Protocol) mueve archivos pesados."
        },
        {
            id: 3,
            text: "Quiero enviar un email a mamá",
            icon: <Mail className="w-12 h-12 text-yellow-600" />,
            correctProtocol: "SMTP",
            feedback: "¡Así es! SMTP se encarga de entregar tus correos."
        },
        {
            id: 4,
            text: "¿Qué IP tiene Google.com?",
            icon: <Book className="w-12 h-12 text-green-600" />,
            correctProtocol: "DNS",
            feedback: "¡Bien! El DNS es la agenda que traduce nombres a números IP."
        },
        {
            id: 5,
            text: "Quiero ver un video en YouTube",
            icon: <Globe className="w-12 h-12 text-red-600" />,
            correctProtocol: "HTTP",
            feedback: "¡Claro! El streaming de video también usa HTTP (o HTTPS)."
        },
        {
            id: 6,
            text: "Haciendo backup de la base de datos",
            icon: <FolderOpen className="w-12 h-12 text-purple-600" />,
            correctProtocol: "FTP",
            feedback: "Para mover grandes volúmenes de datos, FTP es el rey."
        },
        {
            id: 7,
            text: "Enviando newsletter a clientes",
            icon: <Mail className="w-12 h-12 text-blue-400" />,
            correctProtocol: "SMTP",
            feedback: "SMTP maneja el envío masivo de correos sin sudar."
        },
        {
            id: 8,
            text: "El navegador busca 'facebook.com'",
            icon: <Book className="w-12 h-12 text-indigo-600" />,
            correctProtocol: "DNS",
            feedback: "El DNS busca la dirección exacta para que tú no tengas que memorizar números."
        },
        {
            id: 9,
            text: "Leyendo noticias en el diario online",
            icon: <Globe className="w-12 h-12 text-slate-600" />,
            correctProtocol: "HTTP",
            feedback: "Exacto, consumo de contenido web es tarea de HTTP."
        },
        {
            id: 10,
            text: "Subiendo fotos de las vacaciones",
            icon: <FolderOpen className="w-12 h-12 text-pink-500" />,
            correctProtocol: "FTP",
            feedback: "Subida de archivos = Trabajo para FTP."
        },
        {
            id: 11,
            text: "Escuchando música en Spotify",
            icon: <Globe className="w-12 h-12 text-green-500" />,
            correctProtocol: "HTTP",
            feedback: "Streaming de audio usa protocolos web (HTTP/HTTPS)."
        },
        {
            id: 12,
            text: "Traduciendo 'www.ejemplo.com' a IP",
            icon: <Book className="w-12 h-12 text-teal-600" />,
            correctProtocol: "DNS",
            feedback: "¡Correcto! DNS es el traductor de la red."
        },
        {
            id: 13,
            text: "Recibiendo código de confirmación por mail",
            icon: <Mail className="w-12 h-12 text-red-500" />,
            correctProtocol: "SMTP",
            feedback: "El envío de correos automatizados usa SMTP."
        },
        {
            id: 14,
            text: "Descargando instalador de juego (50GB)",
            icon: <FolderOpen className="w-12 h-12 text-violet-600" />,
            correctProtocol: "FTP",
            feedback: "Para descargas masivas y estables, FTP es ideal."
        },
        {
            id: 15,
            text: "Comprando zapatillas en tienda online",
            icon: <Globe className="w-12 h-12 text-emerald-600" />,
            correctProtocol: "HTTP",
            feedback: "Comercio electrónico funciona sobre HTTP (seguro)."
        },
        {
            id: 16,
            text: "Servidor localizando 'servidor-juegos'",
            icon: <Book className="w-12 h-12 text-cyan-600" />,
            correctProtocol: "DNS",
            feedback: "Resolución de nombres internos también es tarea de DNS."
        },
        {
            id: 17,
            text: "Subiendo los planos del edificio",
            icon: <FolderOpen className="w-12 h-12 text-amber-600" />,
            correctProtocol: "FTP",
            feedback: "Archivos técnicos grandes se transfieren mejor por FTP."
        },
        {
            id: 18,
            text: "Enviando alerta de seguridad",
            icon: <Mail className="w-12 h-12 text-rose-600" />,
            correctProtocol: "SMTP",
            feedback: "Las notificaciones urgentes por correo usan SMTP."
        },
        {
            id: 19,
            text: "Actualizando feeds de redes sociales",
            icon: <Globe className="w-12 h-12 text-blue-500" />,
            correctProtocol: "HTTP",
            feedback: "Las APIs REST que actualizan tu feed usan HTTP."
        },
        {
            id: 20,
            text: "Navegador buscando dirección de banco",
            icon: <Book className="w-12 h-12 text-indigo-500" />,
            correctProtocol: "DNS",
            feedback: "Seguridad empieza por encontrar la IP correcta con DNS."
        }
    ];

    // Select random subset of questions (Now up to 20 for longer gameplay)
    // We use useState to initialize this only once
    const [questions] = useState(() => [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 20));

    const stamps = [
        { label: "HTTP", color: "bg-blue-500 hover:bg-blue-600", border: "border-blue-700" },
        { label: "FTP", color: "bg-orange-500 hover:bg-orange-600", border: "border-orange-700" },
        { label: "SMTP", color: "bg-yellow-500 hover:bg-yellow-600", border: "border-yellow-700" },
        { label: "DNS", color: "bg-green-500 hover:bg-green-600", border: "border-green-700" }
    ];

    // Game Constants
    const MAX_LIVES = 3;
    const TIME_PER_QUESTION = 15; // seconds

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
    const [shake, setShake] = useState(false); // For error animation

    // Drag State
    const [draggingStamp, setDraggingStamp] = useState(null); // { label, x, y }

    // Refs
    const dropZoneRef = useRef(null);
    const timerRef = useRef(null);

    // Timer Logic
    useEffect(() => {
        if (!isCompleted && !isGameOver && !feedback && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !feedback && !isGameOver) {
            handleTimeOut();
        }

        return () => clearInterval(timerRef.current);
    }, [timeLeft, isCompleted, isGameOver, feedback]);

    const handleTimeOut = () => {
        handleMistake("¡Se acabó el tiempo!");
    };

    const handleMistake = (msg) => {
        setShake(true);
        setTimeout(() => setShake(false), 500);

        const newLives = lives - 1;
        setLives(newLives);

        if (newLives === 0) {
            setFeedback({ type: 'error', message: "Game Over" });
            setTimeout(() => setIsGameOver(true), 1500);
        } else {
            setFeedback({ type: 'error', message: msg || "¡Incorrecto! Pierdes una vida." });
            // Brief pause then reset for retry (or skip? Let's verify same question logic)
            // Design choice: Give them another chance on same question but reset timer?
            // Or just show feedback and let them try again.
            // Let's keep feedback shown for a second, then close feedback to allow retry
            setTimeout(() => {
                setFeedback(null);
                setTimeLeft(TIME_PER_QUESTION); // Reset timer for retry
            }, 2000);
        }
    };

    const handlePointerDown = (e, stamp) => {
        e.preventDefault();
        setDraggingStamp({
            label: stamp.label,
            color: stamp.color,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handlePointerMove = (e) => {
        if (draggingStamp) {
            e.preventDefault();
            setDraggingStamp(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
        }
    };

    const handlePointerUp = (e) => {
        if (draggingStamp) {
            if (dropZoneRef.current) {
                const dropRect = dropZoneRef.current.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (x >= dropRect.left && x <= dropRect.right &&
                    y >= dropRect.top && y <= dropRect.bottom) {
                    checkAnswer(draggingStamp.label);
                }
            }
            setDraggingStamp(null);
        }
    };

    useEffect(() => {
        if (draggingStamp) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [draggingStamp]);

    const checkAnswer = (protocol) => {
        const currentQ = questions[currentIndex];

        if (protocol === currentQ.correctProtocol) {
            // Correct
            setFeedback({ type: 'success', message: currentQ.feedback });
        } else {
            // Incorrect
            handleMistake(`Este paquete no necesita ${protocol}.`);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        setTimeLeft(TIME_PER_QUESTION);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const handleRetry = () => {
        setIsGameOver(false);
        setIsCompleted(false);
        setLives(MAX_LIVES);
        setCurrentIndex(0);
        setTimeLeft(TIME_PER_QUESTION);
        setFeedback(null);
    };

    // Render Game Over Screen
    if (isGameOver) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                    <div className="flex justify-center mb-6">
                        <AlertTriangle className="w-24 h-24 text-red-500 animate-pulse" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Paquetes Perdidos!</h2>
                    <p className="text-gray-600 mb-8">Te has quedado sin vidas. La red se ha congestionado.</p>

                    <button
                        onClick={handleRetry}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        Intentar de Nuevo
                    </button>
                    <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline">
                        Salir
                    </button>
                </div>
            </div>
        );
    }

    // Render Completed Screen
    if (isCompleted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="flex justify-center mb-6">
                        <img src={macCelebration} alt="Mac Celebrando" className="w-32 h-32 object-contain animate-bounce" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Misión Cumplida!</h2>
                    <p className="text-gray-600 mb-8">Has clasificado todos los paquetes correctamente. ¡Eres un maestro de los protocolos!</p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
                        <span className="text-4xl">💎</span>
                        <span className="text-xl font-bold text-yellow-700">+10 Diamantes</span>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    // Calculate Timer Color
    const timerColor = timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse';
    const timerWidth = (timeLeft / TIME_PER_QUESTION) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" ref={dropZoneRef}>
            <div className="bg-slate-100 rounded-3xl shadow-2xl w-full max-w-4xl h-[700px] flex flex-col relative overflow-hidden border-4 border-slate-300">

                {/* Header */}
                <div className="bg-slate-800 p-4 flex items-center justify-between text-white shadow-md relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full border-4 border-slate-600 flex items-center justify-center overflow-hidden">
                            <img src={macSprite} alt="Postman Mac" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-blue-300">Oficina Postal MAC</h2>
                            <div className="flex items-center gap-2 mt-1">
                                {[...Array(MAX_LIVES)].map((_, i) => (
                                    <Heart
                                        key={i}
                                        className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-600'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-2xl font-bold text-yellow-400">{currentIndex + 1}/{questions.length}</p>
                        <div className="flex items-center gap-2 text-slate-400 text-xs justify-end">
                            <Clock size={12} />
                            <span>{timeLeft}s</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                </div>

                {/* Main Game Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-200">

                    {/* Timer Bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-300">
                        <div
                            className={`h-full transition-all duration-1000 ease-linear ${timerColor}`}
                            style={{ width: `${timerWidth}%` }}
                        />
                    </div>

                    {/* Conveyor Belt Background */}
                    <div className="absolute bottom-0 w-full h-32 bg-slate-300 border-t-4 border-slate-400 flex items-center justify-around opacity-50">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-4 h-32 bg-slate-400/30 transform -skew-x-12"></div>
                        ))}
                    </div>

                    {/* The Package (Drop Zone) */}
                    <div
                        ref={dropZoneRef}
                        className={`
                            relative bg-white w-80 h-72 rounded-xl shadow-xl border-4 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center z-20
                            ${feedback?.type === 'success' ? 'border-green-500 scale-105' :
                                feedback?.type === 'error' ? 'border-red-500' : 'border-amber-200'}
                            ${shake ? 'animate-shake' : ''}
                        `}
                    >
                        {feedback?.type === 'success' ? (
                            <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                                <p className="text-green-700 font-bold text-lg">{feedback.message}</p>
                                <button
                                    onClick={nextQuestion}
                                    className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 flex items-center gap-2 animate-bounce"
                                >
                                    Siguiente <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 transform transition-transform hover:scale-110 duration-500">
                                    {currentQ.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Solicitud de Envío</h3>
                                <p className="text-slate-600 font-medium text-lg leading-tight">"{currentQ.text}"</p>

                                {/* Stamp Area Hint */}
                                <div className="mt-6 border-2 border-dashed border-slate-300 rounded-lg w-full h-16 flex items-center justify-center text-slate-400 text-sm font-bold bg-slate-50">
                                    ARRASTRA EL SELLO AQUÍ
                                </div>
                            </>
                        )}

                        {/* Error Feedback Toast */}
                        {feedback?.type === 'error' && !isGameOver && (
                            <div className="absolute -top-16 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold animate-in slide-in-from-bottom-2 fade-in">
                                {feedback.message}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer / Stamps Tray */}
                <div className="bg-slate-100 p-6 border-t border-slate-300 z-30">
                    <p className="text-center text-slate-500 font-bold mb-4 uppercase text-sm tracking-wider">Selecciona el protocolo correcto</p>
                    <div className="flex justify-center gap-4 md:gap-8 overflow-x-auto pb-2 touch-none">
                        {stamps.map((stamp) => (
                            <div
                                key={stamp.label}
                                onPointerDown={(e) => handlePointerDown(e, stamp)}
                                className={`
                                    w-24 h-24 md:w-28 md:h-28 rounded-full ${stamp.color} border-b-8 ${stamp.border} 
                                    flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing 
                                    transform transition-transform hover:-translate-y-1 active:scale-95 touch-none select-none
                                `}
                            >
                                <span className="text-white font-black text-xl md:text-2xl drop-shadow-md tracking-wider">
                                    {stamp.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dragging Ghost Element */}
                {draggingStamp && (
                    <div
                        className={`fixed w-28 h-28 rounded-full ${draggingStamp.color} border-4 border-white shadow-2xl flex items-center justify-center z-[100] pointer-events-none opacity-90`}
                        style={{
                            left: draggingStamp.x,
                            top: draggingStamp.y,
                            transform: 'translate(-50%, -50%) scale(1.1)'
                        }}
                    >
                        <span className="text-white font-black text-2xl drop-shadow-md tracking-wider">
                            {draggingStamp.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Styles for animation */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};

export default ProtocolSorter;
