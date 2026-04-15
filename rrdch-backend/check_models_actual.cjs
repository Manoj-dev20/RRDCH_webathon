const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

async function checkModels() {
    const GROQ_KEY = process.env.GROQ_API_KEY;
    try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
            headers: { 'Authorization': `Bearer ${GROQ_KEY}` }
        });
        const data = await response.json();
        const visionModels = data.data?.filter(m => m.id.toLowerCase().includes('vision') || m.id.toLowerCase().includes('llama-4'));
        console.log("ACTUAL VISION MODELS ON GROQ:");
        console.log(visionModels?.map(m => m.id).join('\n'));
    } catch (e) {
        console.error(e);
    }
}
checkModels();
