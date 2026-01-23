import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Explain prescription using AI
 * @param {string} ocrText - Raw OCR text from prescription image
 * @param {string} language - Target language (e.g., 'English', 'Hindi', 'Spanish')
 * @returns {Promise<Object>} - Structured prescription explanation
 */
export const explainPrescription = async (ocrText, language = 'English') => {
  try {
    // Use Gemini 1.5 Flash for fast, efficient processing
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const prompt = `You are a medical prescription explanation assistant for a patient-education platform.
Your role is to EXPLAIN prescriptions, NOT diagnose or prescribe.

INPUT:
- Extracted OCR text from a prescription image.
- Target language chosen by the user.

TASKS (FOLLOW IN STRICT ORDER):

1. VALIDATION:
   - First determine if the text is from a real medical prescription.
   - Look for medical indicators such as:
     Rx, medicine names, dosage units (mg, ml), frequency (OD, BD, TDS, SOS),
     duration, doctor or hospital references.
   - If the text does NOT appear to be a prescription, respond ONLY with:
     {
       "valid": false,
       "reason": "The uploaded image does not appear to be a medical prescription."
     }
   - Do NOT continue further if invalid.

2. EXTRACTION:
   - If valid, extract all identifiable medicines.
   - For each medicine, extract:
     - Medicine name (generic if possible)
     - Strength/dose
     - Frequency
     - Duration
     - Route (oral, topical, injection) if available
   - If any field is unclear, mark it as "uncertain".

3. EXPLANATION (PATIENT-FRIENDLY):
   - Explain each medicine in very simple, non-technical language.
   - Include:
     - What the medicine is commonly used for (general purpose only)
     - How to take it safely
     - Common precautions or warnings
   - Do NOT:
     - Diagnose disease
     - Suggest alternative medicines
     - Suggest dosage changes

4. SAFETY RULES (MANDATORY):
   - If any medicine appears to be:
     - Antibiotic
     - Steroid
     - Psychiatric
     - Pediatric
     - Pregnancy-related
   - Add a caution line advising to strictly follow doctor's instructions.

5. DISCLAIMER:
   - Add this disclaimer at the end in the same language:
     "This explanation is for educational purposes only and does not replace medical advice from a licensed doctor."

6. LANGUAGE:
   - Output MUST be fully written in the user's selected language: ${language}
   - Do NOT mix languages.
   - Do NOT transliterate unless the language normally uses Latin script.

7. OUTPUT FORMAT (STRICT JSON):
{
  "valid": true,
  "medicines": [
    {
      "name": "",
      "dose": "",
      "frequency": "",
      "duration": "",
      "route": "",
      "explanation": "",
      "precautions": ""
    }
  ],
  "general_advice": "",
  "disclaimer": ""
}

IMPORTANT:
- If text quality is poor, clearly say so in general_advice.
- Be honest if something is unclear.
- Never assume missing information.
- Return ONLY valid JSON, no other text.

OCR TEXT TO ANALYZE:
${ocrText}

TARGET LANGUAGE: ${language}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const explanation = JSON.parse(jsonText);
    return explanation;

  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error(`Failed to explain prescription: ${error.message}`);
  }
};

/**
 * Prepare text for TTS (Text-to-Speech)
 * Filters only the fields that should be read aloud
 * @param {Object} explanation - Full explanation object
 * @returns {string} - Concatenated text for TTS
 */
export const prepareTTSText = (explanation) => {
  if (!explanation.valid) {
    return explanation.reason || 'Invalid prescription.';
  }

  let ttsText = '';

  // Add each medicine explanation
  if (explanation.medicines && explanation.medicines.length > 0) {
    explanation.medicines.forEach((medicine, index) => {
      ttsText += `Medicine ${index + 1}: ${medicine.name}. `;
      if (medicine.explanation) {
        ttsText += `${medicine.explanation} `;
      }
    });
  }

  // Add general advice
  if (explanation.general_advice) {
    ttsText += `${explanation.general_advice} `;
  }

  // Add disclaimer
  if (explanation.disclaimer) {
    ttsText += `${explanation.disclaimer}`;
  }

  return ttsText.trim();
};
