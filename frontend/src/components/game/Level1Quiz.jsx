import React, { useState } from 'react';

const Level1Quiz = ({ onComplete, onClose }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (selectedOption) {
            setShowFeedback(true);
            // In a real game, checking logic would go here.
            // For now, we just assume they proceed after seeing feedback or if we want to blocking, we can.
            // But user just asked for the page layout mainly.
            // Let's make it so if they click the button again or a "Continue" button appears, they proceed.
            // For simplicity, let's just trigger onComplete after a short delay or show a continue button.
        }
    };

    const handleContinue = () => {
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row relative min-h-[500px]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-gray-400 hover:text-red-500 bg-white/50 hover:bg-white rounded-full p-2 transition-all"
                    title="Volver al mapa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side: Context / Mac */}
                <div className="w-full md:w-1/3 bg-indigo-600 p-8 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-indigo-600 opacity-50 z-0">
                        {/* Abstract pattern could go here */}
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-100">¡Muy bien!</h2>
                        <p className="text-indigo-200 mb-6 leading-relaxed">
                            Vamos a poner a prueba tu instinto de ingeniero.
                        </p>
                        <p className="text-sm text-indigo-300 italic">
                            "Imagina la escena: Estás en tu oficina y envías un documento urgente a la impresora que está en la misma sala. La pregunta del millón es: ¿Quién se encarga de entregar ese paquete de datos? ¿Será el Router? ¿Será el Módem? ¿O será el Switch?"
                        </p>
                    </div>
                </div>

                {/* Right Side: Question & Options */}
                <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm mr-2">PREGUNTA</span>
                        Escenario: Estás enviando un archivo a la impresora que está a tu lado en la oficina. ¿Qué dispositivo se encarga principalmente de entregar ese dato?
                    </h3>

                    <div className="space-y-4 mb-8">
                        {/* Option A */}
                        <button
                            onClick={() => handleOptionClick('A')}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedOption === 'A'
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-white'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === 'A' ? 'border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                                }`}>
                                {selectedOption === 'A' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className="text-gray-700 font-medium group-hover:text-indigo-900">A) El Router</span>
                        </button>

                        {/* Option B */}
                        <button
                            onClick={() => handleOptionClick('B')}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedOption === 'B'
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-white'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === 'B' ? 'border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                                }`}>
                                {selectedOption === 'B' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className="text-gray-700 font-medium group-hover:text-indigo-900">B) El Modem</span>
                        </button>

                        {/* Option C - Correct Answer usually, but just styling for now */}
                        <button
                            onClick={() => handleOptionClick('C')}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedOption === 'C'
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-white'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === 'C' ? 'border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                                }`}>
                                {selectedOption === 'C' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className="text-gray-700 font-medium group-hover:text-indigo-900">C) El Switch</span>
                        </button>
                    </div>

                    <div className="flex justify-end">
                        {!showFeedback ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedOption}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${selectedOption
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:translate-y-[-2px]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Confirmar Respuesta
                            </button>
                        ) : (
                            <button
                                onClick={handleContinue}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:translate-y-[-2px] flex items-center gap-2"
                            >
                                Continuar
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Level1Quiz;
