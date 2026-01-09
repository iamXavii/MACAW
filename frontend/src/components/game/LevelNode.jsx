import React from 'react';

const LevelNode = ({ level, status, isCurrent, customIcon, onClick }) => {
    // Determine styles based on status
    const baseStyle = "w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold transition-transform active:translate-y-2 relative";

    let colorStyle = "";
    let shadowStyle = "";

    // Only apply default styles if no custom icon
    if (!customIcon) {
        if (status === 'completed') {
            colorStyle = "bg-yellow-400 text-white";
            shadowStyle = "border-b-4 border-yellow-600";
        } else if (status === 'active') {
            colorStyle = "bg-green-500 text-white";
            shadowStyle = "border-b-4 border-green-700 animate-bounce-slight";
        } else {
            colorStyle = "bg-gray-300 text-gray-500";
            shadowStyle = "border-b-4 border-gray-400";
        }
    } else {
        // basic hover effect for images
        shadowStyle = "transition-transform hover:scale-105 active:scale-95";
    }

    return (
        <div className="relative group cursor-pointer z-10">
            {/* Tooltip on hover */}
            {/* Tooltip on hover */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-bold text-gray-700 whitespace-nowrap pointer-events-none z-50">
                Nivel {level}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
            </div>

            <button
                className={`${baseStyle} ${colorStyle} ${shadowStyle} overflow-hidden`}
                disabled={status === 'locked'}
                onClick={onClick}
            >
                {customIcon ? (
                    <img
                        src={customIcon}
                        alt={`Nivel ${level}`}
                        className={`w-full h-full object-cover ${status === 'locked' ? 'grayscale opacity-50' : ''}`}
                    />
                ) : (
                    <span>{status === 'completed' ? '★' : level}</span>
                )}
            </button>


        </div>
    );
};

export default LevelNode;
