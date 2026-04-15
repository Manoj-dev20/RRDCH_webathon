const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env
if (fs.existsSync('./rrdch-backend/.env')) {
    const envConfig = dotenv.parse(fs.readFileSync('./rrdch-backend/.env'));
    for (const k in envConfig) { process.env[k] = envConfig[k]; }
}

async function checkModels() {
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
        console.error("No API key found");
        return;
    }

    const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/models',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${GROQ_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log("--- AVAILABLE GROQ MODELS (2026) ---");
                // Filter for anything that might have vision/multimodal capabilities
                const models = json.data?.map(m => m.id) || [];
                console.log(models.join('\n'));
            } catch (e) {
                console.error("Parse error:", e);
                console.log(data);
            }
        });
    });

    req.on('error', (e) => { console.error(e); });
    req.end();
}

checkModels();
