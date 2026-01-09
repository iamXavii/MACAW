import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ src, onComplete, onSkip }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
                // Handle autoplay policies if needed (e.g., show a big Play button)
            });
        }
    }, []);

    const handleEnded = () => {
        if (onComplete) onComplete();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-center items-center">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain"
                onEnded={handleEnded}
                controls={false} // Hide default controls for a cinematic feel, or true if preferred
                playsInline
            />

            <button
                onClick={onSkip}
                className="absolute top-8 right-8 bg-white/20 hover:bg-white/40 text-white border border-white/50 rounded-full px-6 py-2 backdrop-blur-sm transition-all text-sm font-bold uppercase tracking-wider"
            >
                Saltar
            </button>

            {/* Optional: Click overlay to play if autoplay fails */}
            <div className="absolute inset-0 z-[-1]" onClick={() => videoRef.current?.play()}></div>
        </div>
    );
};

export default VideoPlayer;
