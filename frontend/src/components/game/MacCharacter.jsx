import React, { useState, useEffect } from 'react';
import mac1 from '../../assets/mac_1.png';
import mac2 from '../../assets/mac_2.png';
import mac3 from '../../assets/mac_3.png';

const MacCharacter = () => {
    const [frame, setFrame] = useState(0);
    const frames = [mac1, mac2, mac3];

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % frames.length);
        }, 500); // Change frame every 500ms (adjust for speed)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-20 h-20 relative pointer-events-none">
            <img
                src={frames[frame]}
                alt="Mac Character"
                className="w-full h-full object-contain drop-shadow-xl"
            />
        </div>
    );
};

export default MacCharacter;
