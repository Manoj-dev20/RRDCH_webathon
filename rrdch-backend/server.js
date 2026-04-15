import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Middleware
app.use(cors()) // Allow all origins for the Webathon
app.options('*', cors())

app.use(express.json({ limit: '10mb' }))

// Constants
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_KEY = process.env.GROQ_API_KEY

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("RRDCH Backend is running 🚀")
})

// ─── ROUTE 1: AI Symptom Triage ───
app.post('/api/triage', async (req, res) => {
  try {
    const { symptom } = req.body

    if (!symptom) {
      return res.status(400).json({ error: "Symptom is required" })
    }

    if (!GROQ_KEY) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY in environment variables" })
    }

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
              Available departments: Oral Medicine & Radiology, Conservative Dentistry & Endodontics,
              Periodontology, Pedodontics & Preventive Dentistry, Orthodontics & Dentofacial Orthopedics,
              Oral & Maxillofacial Surgery, Prosthodontics & Crown and Bridge, Public Health Dentistry,
              Oral & Maxillofacial Pathology, Implantology.
              Return ONLY valid JSON (no markdown, no explanation):
              { "department": string, "severity": "routine"|"urgent"|"emergency",
                "reason": string, "advice": string, "kannada_reason": string }`
          },
          { role: 'user', content: `Patient symptom: ${symptom}` }
        ]
      })
    })

    const data = await response.json()

    const content = data?.choices?.[0]?.message?.content || "{}"

    const parsed = JSON.parse(
      content.replace(/```json|```/g, '').trim()
    )

    res.json(parsed)

  } catch (err) {
    console.error('Triage error:', err)
    res.status(500).json({ error: 'Triage failed', details: err.message })
  }
})

// ─── ROUTE 2: Prescription Reader ───
app.post('/api/prescription', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: "Image URL is required" })
    }

    if (!GROQ_KEY) {
      return res.status(500).json({ error: "Missing GROQ_API_KEY in environment variables" })
    }

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        temperature: 0.1,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: image } },
            {
              type: 'text',
              text: `Extract all prescription information. Return ONLY valid JSON (no markdown):
                { "medicines": [{ "name": string, "dosage": string, "frequency": string }],
                  "instructions": string, "follow_up": string, "department": string, "notes": string }`
            }
          ]
        }]
      })
    })

    const data = await response.json()

    const content = data?.choices?.[0]?.message?.content || "{}"

    const parsed = JSON.parse(
      content.replace(/```json|```/g, '').trim()
    )

    res.json(parsed)

  } catch (err) {
    console.error('Prescription error:', err)
    res.status(500).json({ error: 'Prescription read failed', details: err.message })
  }
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`RRDCH Backend running on port ${PORT}`)
})