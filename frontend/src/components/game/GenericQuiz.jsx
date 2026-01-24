import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import characterSprite from '../../assets/sprites/explanation/mac_talk_1.png'; // Reuse existing sprite

const GenericQuiz = ({ levelId, title, questions, onComplete, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (optionIndex) => {
        if (showFeedback) return;

        const correct = optionIndex === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) {
            setScore(score + 10);
        }
    };

    const handleNext = () => {
        setShowFeedback(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const handleFinish = () => {
        onComplete(score);
    };

    if (isCompleted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Nivel Completado!</h2>
                    <p className="text-xl text-gray-600 mb-8">Puntuación: <span className="font-bold text-blue-600">{score}</span></p>
                    <button
                        onClick={handleFinish}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden relative">

                {/* Sidebar with Character */}
                <div className="w-1/3 bg-blue-50 border-r border-blue-100 flex flex-col items-center justify-center p-4 relative hidden md:flex">
                    <h3 className="text-xl font-bold text-blue-800 absolute top-8">{title}</h3>
                    <img src={characterSprite} alt="Personaje" className="w-48 object-contain drop-shadow-lg" />
                    <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-blue-200 w-full">
                        <p className="text-center text-gray-600 text-sm">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 p-8 flex flex-col relative bg-slate-50">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold">✕</button>

                    <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                            {currentQuestion.question}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={showFeedback}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg flex items-center gap-4
                                        ${showFeedback
                                            ? idx === currentQuestion.correctAnswer
                                                ? 'bg-green-100 border-green-500 text-green-800'
                                                : idx === currentQuestionIndex && !isCorrect // Highlight selected wrong? No, we don't track selection idx here easily without state. 
                                                    ? 'bg-gray-100 border-gray-300 opacity-50'
                                                    : 'bg-white border-gray-200 opacity-50'
                                            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md hover:bg-blue-50'
                                        }`}
                                >
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold shrink-0
                                        ${showFeedback && idx === currentQuestion.correctAnswer ? 'border-green-600 bg-green-200 text-green-800' : 'border-gray-300 text-gray-500'}
                                    `}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feedback Bar */}
                    {showFeedback && (
                        <div className={`mt-6 p-4 rounded-xl animate-in slide-in-from-bottom duration-300 border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                        {isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">{isCorrect ? '¡Sigue así!' : `La respuesta correcta era: ${currentQuestion.options[currentQuestion.correctAnswer]}`}</p>
                                </div>
                                <button
                                    onClick={handleNext}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenericQuiz;
