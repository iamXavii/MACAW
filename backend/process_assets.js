const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DIR = path.join(__dirname, '../frontend/src/assets/sprites');
const OUTPUT_DIR = path.join(__dirname, '../frontend/src/assets/sprites/processed');
const FILES = [
    'parrot_core.png',
    'parrot_emotes.png',
    'parrot_misc_1.png',
    'parrot_misc_2.png',
    'ui_buttons.png'
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function processImage(filename) {
    const inputPath = path.join(SOURCE_DIR, filename);
    const basename = path.basename(filename, '.png');

    console.log(`Processing ${filename}...`);

    try {
        const imageBuffer = fs.readFileSync(inputPath);
        const image = await Jimp.read(imageBuffer);

        // 1. Remove White Background (Flood Fill from corners)
        // Fuzzy factor to catch off-white compression artifacts
        const targetColor = { r: 255, g: 255, b: 255, a: 255 };
        const replaceColor = { r: 0, g: 0, b: 0, a: 0 };
        const tolerance = 0.15; // 15% tolerance

        // Flood fill from corners to avoid removing white eyes/teeth
        image.color([
            { apply: 'mix', params: [replaceColor, 30] } // slight hack to ensure alpha channel exists/works
        ]);

        // A robust way to remove background is to scan pixels and if they match white, check if they are "connected" to the edge.
        // For simplicity with JIMP, we can't easily do a true floodfill algorithm without custom implementation.
        // Instead, we will iterate pixels. Since sprites are usually clearly defined:
        // A better heuristic for this user's specific request: "Remove white background".
        // The sprites have white eyes. We must NOT turn white eyes transparent.
        // We will assume the background touches the edges.

        // We will implement a basic stack-based flood fill for transparency starting from (0,0)
        floodFillTransparency(image, 0, 0, targetColor, tolerance);
        floodFillTransparency(image, image.bitmap.width - 1, 0, targetColor, tolerance);
        floodFillTransparency(image, 0, image.bitmap.height - 1, targetColor, tolerance);
        floodFillTransparency(image, image.bitmap.width - 1, image.bitmap.height - 1, targetColor, tolerance);

        // Debug: Save transparent version to check if background removal works
        image.write(path.join(OUTPUT_DIR, `debug_${basename}.png`));

        // 2. Find Connected Components (Split sprites)
        // Basic blob detection: Find opaque pixels, flood fill them to mark them as visited, keep track of min/max bounds.

        const sprites = findSprites(image);

        console.log(`Found ${sprites.length} sprites in ${filename}`);

        
        sprites.forEach((bounds, index) => {
            const width = bounds.x2 - bounds.x1 + 1;
            const height = bounds.y2 - bounds.y1 + 1;

            // Add padding
            const padding = 2;

            const x = Math.max(0, bounds.x1 - padding);
            const y = Math.max(0, bounds.y1 - padding);
            const x2_limit = Math.min(image.bitmap.width - 1, bounds.x2 + padding);
            const y2_limit = Math.min(image.bitmap.height - 1, bounds.y2 + padding);
            const w = x2_limit - x + 1;
            const h = y2_limit - y + 1;

            const sprite = image.clone().crop({ x, y, w, h });

            const outputName = `${basename}_${index}.png`;
            sprite.write(path.join(OUTPUT_DIR, outputName));
        });

    } catch (error) {
        console.error(`Error processing ${filename}:`, error);
    }
}

function floodFillTransparency(image, startX, startY, targetColor, tolerance) {
    const stack = [[startX, startY]];
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const visited = new Set(); // Use a Set or 2D array to track visited for the fill specifically to avoid loops if needed, though color change prevents loops.
    // However, since we are changing color to transparent, we can just check if it's already transparent.

    while (stack.length > 0) {
        const [x, y] = stack.pop();

        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        const idx = image.getPixelIndex(x, y);
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        const a = image.bitmap.data[idx + 3];

        if (a === 0) continue; // Already transparent

        // Check if color matches white (fuzzy)
        if (colorMatch(r, g, b, targetColor, tolerance)) {
            // Set to transparent
            image.bitmap.data[idx + 3] = 0;

            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }
    }
}

function colorMatch(r, g, b, target, tolerance) {
    const dist = Math.sqrt(
        Math.pow(r - target.r, 2) +
        Math.pow(g - target.g, 2) +
        Math.pow(b - target.b, 2)
    );
    return dist < 255 * tolerance; // Tolerance based on max distance
    // Simplified: if all channels are > 240, it's white enough.
    // return r > 230 && g > 230 && b > 230; 
}

function findSprites(image) {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const visited = new Set();
    const sprites = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = image.getPixelIndex(x, y);
            const a = image.bitmap.data[idx + 3];

            if (a > 0 && !visited.has(`${x},${y}`)) {
                // Modified flood fill to find bounds of opaque object
                const bounds = { x1: x, y1: y, x2: x, y2: y };
                const stack = [[x, y]];
                visited.add(`${x},${y}`);

                while (stack.length > 0) {
                    const [cx, cy] = stack.pop();

                    if (cx < bounds.x1) bounds.x1 = cx;
                    if (cx > bounds.x2) bounds.x2 = cx;
                    if (cy < bounds.y1) bounds.y1 = cy;
                    if (cy > bounds.y2) bounds.y2 = cy;

                    // Check neighbors
                    const neighbors = [
                        [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
                    ];

                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            if (!visited.has(`${nx},${ny}`)) {
                                const nIdx = image.getPixelIndex(nx, ny);
                                if (image.bitmap.data[nIdx + 3] > 0) {
                                    visited.add(`${nx},${ny}`);
                                    stack.push([nx, ny]);
                                }
                            }
                        }
                    }
                }

                // Only keep if it's substantial (noise filter)
                if ((bounds.x2 - bounds.x1) > 10 && (bounds.y2 - bounds.y1) > 10) {
                    sprites.push(bounds);
                }
            }
        }
    }
    return sprites;
}

(async () => {
    for (const file of FILES) {
        await processImage(file);
    }
    console.log('Processing complete!');
})();
