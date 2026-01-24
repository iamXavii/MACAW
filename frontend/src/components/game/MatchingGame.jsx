import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const MatchingGame = ({ title, pairs, onComplete, onClose }) => {
    // pairs: [{ id: '1', left: 'Router', right: 'Conecta redes' }, ...]

    // Split into left and right items, shuffled
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [matchedIds, setMatchedIds] = useState([]); // IDs of correctly matched pairs
    const [wrongPair, setWrongPair] = useState(false);

    useEffect(() => {
        // Init items
        const lefts = pairs.map(p => ({ id: p.id, text: p.left }));
        const rights = pairs.map(p => ({ id: p.id, text: p.right }));

        // Shuffle
        setLeftItems(lefts.sort(() => Math.random() - 0.5));
        setRightItems(rights.sort(() => Math.random() - 0.5));
    }, [pairs]);

    useEffect(() => {
        if (selectedLeft && selectedRight) {
            checkMatch();
        }
    }, [selectedLeft, selectedRight]);

    const checkMatch = () => {
        if (selectedLeft.id === selectedRight.id) {
            // Match!
            setMatchedIds([...matchedIds, selectedLeft.id]);
            resetSelection();

            // Check win condition
            if (matchedIds.length + 1 === pairs.length) {
                setTimeout(() => onComplete(100), 1000); // Wait a bit then finish
            }
        } else {
            // No match
            setWrongPair(true);
            setTimeout(() => {
                setWrongPair(false);
                resetSelection();
            }, 800);
        }
    };

    const resetSelection = () => {
        setSelectedLeft(null);
        setSelectedRight(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[700px] flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-xl">✕</button>
                </div>

                {/* Game Area */}
                <div className="flex-1 p-8 bg-slate-50 flex gap-12 overflow-y-auto justify-center items-center">

                    {/* Left Column */}
                    <div className="flex flex-col gap-4 w-1/3">
                        <h3 className="text-center font-bold text-gray-500 mb-2 uppercase text-sm">Concepto</h3>
                        {leftItems.map(item => {
                            const isMatched = matchedIds.includes(item.id);
                            const isSelected = selectedLeft?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    disabled={isMatched}
                                    onClick={() => setSelectedLeft(item)}
                                    className={`
                                        p-4 rounded-xl border-2 text-left font-bold transition-all
                                        ${isMatched
                                            ? 'bg-green-100 border-green-500 text-green-700 opacity-50'
                                            : isSelected
                                                ? wrongPair ? 'bg-red-100 border-red-500 animate-shake' : 'bg-blue-100 border-blue-500 text-blue-800 scale-105 shadow-md'
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }
                                    `}
                                >
                                    {item.text}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4 w-1/3">
                        <h3 className="text-center font-bold text-gray-500 mb-2 uppercase text-sm">Definición</h3>
                        {rightItems.map(item => {
                            const isMatched = matchedIds.includes(item.id);
                            const isSelected = selectedRight?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    disabled={isMatched}
                                    onClick={() => setSelectedRight(item)}
                                    className={`
                                        p-4 rounded-xl border-2 text-left font-medium transition-all
                                        ${isMatched
                                            ? 'bg-green-100 border-green-500 text-green-700 opacity-50'
                                            : isSelected
                                                ? wrongPair ? 'bg-red-100 border-red-500 animate-shake' : 'bg-blue-100 border-blue-500 text-blue-800 scale-105 shadow-md'
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }
                                    `}
                                >
                                    {item.text}
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* Instructions Footer */}
                <div className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
                    Selecciona un elemento de la izquierda y su pareja a la derecha.
                </div>

                <style jsx>{`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                    .animate-shake {
                        animation: shake 0.3s ease-in-out;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default MatchingGame;
