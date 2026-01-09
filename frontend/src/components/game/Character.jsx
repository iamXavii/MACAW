import React from 'react';
// Import the transparent sheet we (hopefully) created
import spriteSheet from '../../assets/sprites/processed/debug_parrot_core.png';

const Character = ({ mood = 'neutral' }) => {
    // We are using the "debug_parrot_core.png" which contains the 4 main states in a 2x2 grid (approx).
    // The image order in the uploaded reference was: Neutral, Success, Failure, Teaching
    // Assuming the script preserved the layout, we can use background-position to show them.
    // If the background removal kept them in place, we can guess the positions.
    // Since we process the WHOLE image as one sprite, the dimensions are original.

    // We need to define the style to show only a quarter of the image.
    // Assuming equal quadrants for simplicity.

    const moods = {
        neutral: '0% 0%', // Top-Left
        success: '100% 0%', // Top-Right
        failure: '0% 100%', // Bottom-Left
        teaching: '100% 100%' // Bottom-Right
    };

    const style = {
        backgroundImage: `url(${spriteSheet})`,
        backgroundPosition: moods[mood] || moods.neutral,
        backgroundSize: '200% 200%', // Zoom in to show 1/4th (2x2 grid)
        width: '120px',
        height: '120px',
        backgroundRepeat: 'no-repeat'
    };

    return (
        <div
            className="character-sprite animate-in fade-in transition-all duration-300 transform hover:scale-110"
            style={style}
            title={`Parrot is ${mood}`}
        />
    );
};

export default Character;
