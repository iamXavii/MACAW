// Native fetch is available in Node 18+

async function testBackend() {
    const USER_ID = 1;
    const LEVEL_ID = 1;
    const DIAMONDS = 10;

    console.log("Testing POST /api/progress/complete...");
    try {
        const response = await fetch('http://localhost:3001/api/progress/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: USER_ID,
                levelId: LEVEL_ID,
                diamonds: DIAMONDS
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);

        if (data.nivel_actual === 2) {
            console.log("SUCCESS: Level advanced to 2!");
        } else {
            console.log("FAILURE: Level did not advance correctly.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testBackend();
