import React from 'react';

const LevelPopup = ({ sectionTitle, levelTitle, onClose, onStart, color = "bg-blue-500" }) => {
    // Determine darker shade for button/border based on input color class
    // This is a naive approximation, for now, we'll hardcode blue styles if color is generic
    // or rely on the parent passing specific specific classes.
    // Given the icon is Cyan/Blue, we'll default to a matching theme.

    return (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 w-64 animate-in fade-in zoom-in-95 duration-200">
            <div className={`${color} rounded-2xl p-4 text-white shadow-xl relative`}>
                {/* Speech Bubble Triangle (Pointing Up) */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-current ${color.replace('bg-', 'text-')}`}></div>

                {/* Header (Section) */}
                <h3 className="text-xs font-bold opacity-90 uppercase tracking-widest mb-1">
                    {sectionTitle}
                </h3>

                {/* Body (Level Title) */}
                <h2 className="text-xl font-bold mb-4 leading-tight">
                    {levelTitle}
                </h2>

                {/* Start Button */}
                <button
                    onClick={onStart}
                    className="w-full bg-white text-gray-800 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all uppercase tracking-wide"
                >
                    EMPEZAR
                </button>
            </div>
        </div>
    );
};

export default LevelPopup;
