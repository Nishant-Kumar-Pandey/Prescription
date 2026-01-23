# AI Prescription Explanation API - Integration Guide

## Overview

The AI Prescription Explanation system is now integrated into your backend. It provides intelligent prescription validation, medicine extraction, and patient-friendly explanations in multiple languages.

## API Endpoints

### 1. **Explain Prescription**

**Endpoint**: `POST /api/ocr/explain`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "ocrText": "Rx\nTab. Amoxicillin 500mg\n1-0-1 x 5 days\nDr. Smith",
  "language": "English"
}
```

**Response** (Valid Prescription):
```json
{
  "valid": true,
  "medicines": [
    {
      "name": "Amoxicillin",
      "dose": "500mg",
      "frequency": "Twice daily (1-0-1)",
      "duration": "5 days",
      "route": "Oral (tablet)",
      "explanation": "Amoxicillin is an antibiotic used to treat bacterial infections...",
      "precautions": "⚠️ This is an antibiotic. Complete the full course as prescribed..."
    }
  ],
  "general_advice": "Take medicines at the same time each day for best results...",
  "disclaimer": "This explanation is for educational purposes only and does not replace medical advice from a licensed doctor.",
  "ttsText": "Medicine 1: Amoxicillin. Amoxicillin is an antibiotic used to treat bacterial infections... Take medicines at the same time each day for best results... This explanation is for educational purposes only..."
}
```

**Response** (Invalid Text):
```json
{
  "valid": false,
  "reason": "The uploaded image does not appear to be a medical prescription."
}
```

## Complete Workflow

### Frontend Flow

```
1. User uploads prescription image
   ↓
2. POST /api/ocr/analyze (with image file)
   → Returns: { rawText: "Rx..." }
   ↓
3. POST /api/ocr/explain (with OCR text + language)
   → Returns: { valid: true, medicines: [...], ttsText: "..." }
   ↓
4. Display explanation to user
   ↓
5. Use ttsText field with Google TTS Web API for audio
```

## Google TTS Integration (Frontend)

The backend provides a `ttsText` field containing only the relevant content for audio playback. Use this with the Web Speech API or Google Cloud TTS.

### Option 1: Web Speech API (Free, Browser-based)

```javascript
// Example: Using Web Speech API in frontend
const speakExplanation = (ttsText, language) => {
  const utterance = new SpeechSynthesisUtterance(ttsText);
  utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.85; // Slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

// Usage after getting response from /api/ocr/explain
fetch('/api/ocr/explain', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ocrText: extractedText,
    language: 'English'
  })
})
.then(res => res.json())
.then(data => {
  if (data.valid) {
    // Display explanation
    displayExplanation(data);
    
    // Play audio
    speakExplanation(data.ttsText, data.language || 'English');
  }
});
```

### Option 2: Google Cloud Text-to-Speech API

If you want higher quality voices, you can use Google Cloud TTS API directly from the frontend:

```javascript
// Frontend code
const generateAudio = async (ttsText, language) => {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_API_KEY`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: ttsText },
        voice: {
          languageCode: language === 'Hindi' ? 'hi-IN' : 'en-IN',
          name: language === 'Hindi' ? 'hi-IN-Wavenet-D' : 'en-IN-Wavenet-D',
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.85,
          pitch: 0
        }
      })
    }
  );
  
  const { audioContent } = await response.json();
  const audio = new Audio('data:audio/mp3;base64,' + audioContent);
  audio.play();
};
```

## Supported Languages

The AI supports any language you specify. Common examples:
- English
- Hindi
- Spanish
- Tamil
- Bengali
- Marathi
- French
- German

The AI will generate the entire explanation in the specified language.

## Environment Variables

Add to your `.env` file:

```env
GOOGLE_AI_API_KEY=your_api_key_here
```

Get your free API key from: https://makersuite.google.com/app/apikey

## Sample Test Cases

### Test 1: Valid Prescription (English)

**Input**:
```json
{
  "ocrText": "Rx\nTab. Paracetamol 650mg\nTake 1 tablet three times daily after meals\nFor 3 days\nDr. John Doe",
  "language": "English"
}
```

### Test 2: Valid Prescription (Hindi)

**Input**:
```json
{
  "ocrText": "Rx\nTab. Paracetamol 650mg\n1-1-1 x 3 days\nDr. Sharma",
  "language": "Hindi"
}
```

### Test 3: Invalid Text

**Input**:
```json
{
  "ocrText": "This is just a random document with no medical content",
  "language": "English"
}
```

**Expected**: `valid: false`

### Test 4: Antibiotic with Safety Warning

**Input**:
```json
{
  "ocrText": "Rx\nCap. Amoxicillin 500mg\nBD x 7 days\nDr. Kumar",
  "language": "English"
}
```

**Expected**: Should include safety warning about completing full antibiotic course

## Error Handling

The API will return appropriate error messages:

- **400**: Missing ocrText
- **401**: Unauthorized (no valid token)
- **500**: AI service error or network issues

Always check the `valid` field in the response before displaying medicine information.

## Notes

- The `ttsText` field automatically filters out structured data (dose, frequency) and includes only human-readable explanations
- All responses include a medical disclaimer
- Safety warnings are automatically added for antibiotics, steroids, psychiatric medicines, etc.
- The AI is designed to EXPLAIN, not DIAGNOSE or PRESCRIBE
