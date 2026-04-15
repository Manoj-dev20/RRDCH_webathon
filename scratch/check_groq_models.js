const fetch = require('node-fetch');
require('dotenv').config({ path: './rrdch-backend/.env' });

async function checkModels() {
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
        console.error("No API key found in rrdch-backend/.env");
        return;
    }
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
            headers: { 'Authorization': `Bearer ${GROQ_KEY}` }
        });
        const data = await response.json();
        console.log("--- AVAILABLE GROQ MODELS ---");
        const visionModels = data.data.filter(m => m.id.includes('vision'));
        console.log(JSON.stringify(visionModels, null, 2));
    } catch (e) {
        console.error(e);
    }
}

checkModels();
