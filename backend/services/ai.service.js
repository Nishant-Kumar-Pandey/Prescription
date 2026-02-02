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
    console.log(`AI Explanation Request: Language=${language}, text length=${ocrText.length}`);

    // Use Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      // Relax safety settings as medical content is often falsely flagged
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    });

    const prompt = `You are a medical prescription explanation assistant... [truncated for brevity in comment, keeping original prompt]`;
    // I will keep the original prompt content below but need to match the actual file content for replacement

    // ... (rest of the prompt) ...

    // Re-assigning prompt with the full template to avoid mismatch
    const fullPrompt = `You are a medical prescription explanation assistant for a patient-education platform.
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

6. LANGUAGE (CRITICAL):
   - You MUST output EVERYTHING in the user's selected language: ${language}
   - If Hindi is selected, the medicine names (if they are technical chemicals) can stay in Latin script BUT THEIR EXPLANATIONS, DOSE, FREQUENCY, AND CAUTIONS MUST BE IN HINDI SCRIPT (Devanagari).
   - DO NOT mix languages in the same sentence.
   - DO NOT transliterate Hindi into English script. Use the actual script.
   - Ensure the tone is empathetic and clear for a common person.

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
- Output ONLY valid JSON.
- If the target language is Hindi, use Hindi for all fields except technically required Latin medicine names if they have no common Hindi equivalent.

OCR TEXT TO ANALYZE:
${ocrText}

TARGET LANGUAGE: ${language}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Raw Response:", text);

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const explanation = JSON.parse(jsonText);
    return { ...explanation, rawText: ocrText }; // Added rawText for frontend visibility

  } catch (error) {
    console.error('AI Service Error:', error);
    // Log blocked reasons if available
    if (error.response?.promptFeedback) {
      console.error("Prompt Blocked:", error.response.promptFeedback);
    }
    throw new Error(`Failed to explain prescription: ${error.message}`);
  }
};

/**
 * Prepare text for TTS (Text-to-Speech)
 * Filters only the fields that should be read aloud
 * @param {Object} explanation - Full explanation object
 * @param {string} language - Target language
 * @returns {string} - Concatenated text for TTS
 */
export const prepareTTSText = (explanation, language = 'English') => {
  if (!explanation.valid) {
    return explanation.reason || 'Invalid prescription.';
  }

  let ttsText = '';
  const isHindi = language.toLowerCase() === 'hindi';

  // Add each medicine explanation
  if (explanation.medicines && explanation.medicines.length > 0) {
    explanation.medicines.forEach((medicine, index) => {
      const medPrefix = isHindi ? `दवाई ${index + 1}: ` : `Medicine ${index + 1}: `;
      ttsText += `${medPrefix}${medicine.name}. `;
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
