import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Middleware
app.use(cors()) 
app.options('*', cors())
app.use(express.json({ limit: '10mb' }))

// Constants
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_KEY = process.env.GROQ_API_KEY

// ✅ Root route
app.get("/", (req, res) => {
  res.send("RRDCH Backend is running 🚀")
})

// ─── ROUTE 1: AI Symptom Triage ───
app.post('/api/triage', async (req, res) => {
  try {
    const { symptom } = req.body
    if (!symptom) return res.status(400).json({ error: "Symptom is required" })
    if (!GROQ_KEY) return res.status(500).json({ error: "Missing API Key" })

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are a dental triage assistant for RRDCH hospital Bangalore. 
              Map symptoms to these departments: oral-medicine, conservative-dentistry, periodontology, 
              pedodontics, orthodontics, oral-surgery, prosthetics, public-health, oral-pathology, implantology.
              Return ONLY JSON: { "department": string, "severity": "routine"|"urgent"|"emergency", "reason": string, "advice": string, "kannada_reason": string }`
          },
          { role: 'user', content: symptom }
        ]
      })
    })

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content || "{}"
    
    let parsed = {}
    try {
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      parsed = JSON.parse(content.substring(start, end + 1))
    } catch (e) {
      parsed = { error: 'Parse failed', raw: content }
    }
    res.json(parsed)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── ROUTE 2: Prescription Reader (Llama 4 High-Intelligence) ───
app.post('/api/prescription', async (req, res) => {
  try {
    const { image } = req.body
    if (!image) return res.status(400).json({ error: "Image data missing" })
    if (!GROQ_KEY) return res.status(500).json({ error: "Missing API Key" })

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.1,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: image } },
            {
              type: 'text',
              text: `TRANSCRIPTION & ANALYSIS TASK: 
                Extract information from this medical prescription and return EXACTLY this JSON:
                {
                  "patientName": "Full name of patient",
                  "prescriptionDate": "DD-MM-YYYY",
                  "doctorName": "Name of doctor",
                  "suggestedDept": "ONE KEY FROM THE LIST BELOW",
                  "durationDays": number,
                  "medicines": [{ "name": "...", "dosage": "...", "frequency": "..." }],
                  "instructions": "General advice",
                  "follow_up": "Next visit mention"
                }

                VALID DEPARTMENTS (PICK THE BEST MATCH):
                - oral-medicine (Default for general/oral health checks)
                - conservative-dentistry (For cavities/root canals)
                - periodontology (Gums)
                - pedodontics (Children)
                - orthodontics (Braces/alignment)
                - oral-surgery (Extractions/surgery)
                - prosthetics (Dentures/crowns)
                - implantology (Implants)

                If unreadable, use "Unreadable". If duration is missing, default to 7. Return ONLY valid JSON.`
            }
          ]
        }]
      })
    })

    const data = await response.json()
    if (data.error) return res.json({ error: "API Error", details: data.error })

    const content = data?.choices?.[0]?.message?.content || "{}"
    let parsed = {}
    try {
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      parsed = JSON.parse(content.substring(start, end + 1))
    } catch (e) {
      parsed = { error: "Parse failure", raw_content: content }
    }

    res.json(parsed)
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on ${PORT}`))