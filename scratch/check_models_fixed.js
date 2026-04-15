const https = require('https');
const fs = require('fs');

// Manual .env parser
function loadEnv(path) {
    try {
        const content = fs.readFileSync(path, 'utf8');
        content.split('\n').forEach(line => {
            const [key, ...vals] = line.split('=');
            if (key && vals) {
                process.env[key.trim()] = vals.join('=').trim().replace(/^"(.*)"$/, '$1');
            }
        });
    } catch (e) {}
}

loadEnv('./rrdch-backend/.env');

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
                console.log("--- ACTUAL ACTIVE MODELS ---");
                const ids = json.data?.map(m => m.id) || [];
                console.log(ids.join('\n'));
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
