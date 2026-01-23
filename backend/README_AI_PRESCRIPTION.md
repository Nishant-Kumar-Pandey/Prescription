# 🏥 AI Prescription Explanation System

> **Patient-friendly prescription explanations powered by Google Gemini AI**

## 🚀 Quick Start

### 1. Get Your API Key

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create a free API key.

### 2. Configure Environment

Update your `.env` file:

```env
GOOGLE_AI_API_KEY=your_api_key_here
```

### 3. Start the Server

```bash
npm start
# or
nodemon server.js
```

### 4. Test the API

```bash
curl -X POST http://localhost:3000/api/ocr/explain \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ocrText": "Rx\nTab. Paracetamol 650mg\n1-1-1 after meals\n3 days",
    "language": "English"
  }'
```

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Test Samples](./TEST_SAMPLES.md)** - 10 sample prescriptions for testing
- **[Walkthrough](../../../.gemini/antigravity/brain/23fdf6d0-f376-4cd0-993e-13872338853f/walkthrough.md)** - Implementation details

## 🔑 Key Features

✅ **Smart Validation** - Detects if text is a real prescription  
✅ **Medicine Extraction** - Structured data (name, dose, frequency, duration, route)  
✅ **Patient-Friendly Explanations** - Simple, non-technical language  
✅ **Safety Warnings** - Automatic cautions for antibiotics, steroids, etc.  
✅ **Multi-Language** - Full support for any language  
✅ **TTS Ready** - Optimized text for Google Text-to-Speech  

## 🔌 API Endpoint

**`POST /api/ocr/explain`**

**Request:**
```json
{
  "ocrText": "Rx text from OCR",
  "language": "English"
}
```

**Response:**
```json
{
  "valid": true,
  "medicines": [
    {
      "name": "Medicine name",
      "dose": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days",
      "route": "Oral",
      "explanation": "Patient-friendly explanation...",
      "precautions": "Safety warnings..."
    }
  ],
  "general_advice": "General instructions...",
  "disclaimer": "Educational purposes only...",
  "ttsText": "Audio-ready text..."
}
```

## 🌍 Supported Languages

English • Hindi • Spanish • Tamil • Bengali • Marathi • French • German • [Any language]

## 🎯 Usage Flow

```
1. User uploads prescription image
   ↓
2. Backend performs OCR → Extract text
   ↓
3. Send OCR text + language to AI
   ↓
4. AI validates & explains prescription
   ↓
5. Frontend displays explanation
   ↓
6. Use ttsText for audio playback
```

## 🔊 TTS Integration (Frontend)

### Web Speech API (Free)

```javascript
const speakText = (ttsText) => {
  const utterance = new SpeechSynthesisUtterance(ttsText);
  utterance.lang = 'en-IN';
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
};
```

### Google Cloud TTS (Premium)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full implementation.

## ⚠️ Important Notes

- This system **EXPLAINS** prescriptions, it does NOT diagnose or prescribe
- All responses include a medical disclaimer
- Safety warnings are automatically added for sensitive medicines
- The AI uses Google Gemini 1.5 Flash for fast, accurate processing

## 📦 Dependencies

- `@google/generative-ai` - Google Generative AI SDK
- `tesseract.js` - OCR extraction
- `express` - Web framework
- `jsonwebtoken` - Authentication

## 🧪 Testing

See [TEST_SAMPLES.md](./TEST_SAMPLES.md) for 10+ sample prescriptions including:
- Valid prescriptions (various formats)
- Invalid text (should return `valid: false`)
- Multi-language prescriptions
- Prescriptions with safety warnings

## 📝 Example Test

**Input:**
```
Rx
Tab. Amoxicillin 500mg
BD x 7 days
Dr. Kumar
```

**Output:**
- ✅ Valid: true
- 💊 Medicine: Amoxicillin 500mg
- ⏰ Frequency: Twice daily
- 📅 Duration: 7 days
- 🔊 Audio-ready text for TTS
- ⚠️ Safety warning: "Complete full antibiotic course"

## 🛠️ Files Created

- `services/ai.service.js` - AI service layer
- `controllers/ocr.controller.js` - Updated with `explainPrescription()`
- `routes/ocr.routes.js` - Added `/explain` endpoint
- `API_DOCUMENTATION.md` - Complete API reference
- `TEST_SAMPLES.md` - Sample data for testing

## 🚨 Troubleshooting

**Error: "Failed to explain prescription"**
- Check if `GOOGLE_AI_API_KEY` is set in `.env`
- Verify API key is valid
- Check internet connection

**Response: valid: false**
- Text doesn't appear to be a medical prescription
- Try with a real prescription containing Rx, medicine names, dosages

**Multi-language not working**
- Ensure you're passing correct language name
- Example: "Hindi", not "hi" or "HI"

## 📄 License

ISC

---

**Made with ❤️ for patient education**
