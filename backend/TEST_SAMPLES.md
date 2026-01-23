# Sample Prescription OCR Texts for Testing

## Sample 1: Simple Prescription (Paracetamol)

```
Rx
Tab. Paracetamol 650mg
1-1-1 after meals
Duration: 3 days

Dr. Rajesh Kumar
MBBS, MD
License No: 12345
Date: 21/01/2026
```

## Sample 2: Multi-Medicine Prescription

```
Rx

1. Tab. Amoxicillin 500mg
   BD (twice daily)
   Duration: 7 days
   
2. Tab. Paracetamol 650mg
   TDS (three times daily) SOS
   Duration: 5 days
   
3. Syp. Cough Relief 10ml
   TDS after meals
   Duration: 5 days

Instructions: Complete antibiotic course

Dr. Meera Sharma
City Hospital
Date: 21/01/2026
```

## Sample 3: Complex Prescription with Different Routes

```
Rx

1. Cap. Omeprazole 20mg
   OD (once daily) before breakfast
   Duration: 14 days
   Route: Oral
   
2. Tab. Metformin 500mg
   BD with meals
   Duration: 30 days
   Route: Oral
   
3. Ointment Betnovate
   Apply twice daily on affected area
   Duration: 7 days
   Route: Topical

General Instructions:
- Take medicines at same time daily
- Avoid alcohol
- Schedule follow-up after 15 days

Dr. Anil Verma
Endocrinologist
License: MH/12345
```

## Sample 4: Antibiotic Prescription (Should trigger safety warning)

```
Rx

Tab. Azithromycin 500mg
OD for 3 days

Tab. Cetirizine 10mg
OD at bedtime for 5 days

Important: Complete full antibiotic course

Dr. Priya Nair
ENT Specialist
Date: 21/01/2026
```

## Sample 5: Steroid Prescription (Should trigger safety warning)

```
Rx

Tab. Prednisolone 10mg
1-0-1 for 5 days
Then taper: 1-0-0 for 3 days

Tab. Calcium + Vitamin D3
OD with breakfast

WARNING: Do not stop steroid suddenly

Dr. Suresh Reddy
Rheumatologist
```

## Sample 6: Invalid Text (Not a prescription)

```
This is a medical report.

Patient Name: John Doe
Age: 45
Blood Pressure: 120/80
Cholesterol: Normal

Recommended lifestyle changes.
```

## Sample 7: Poor Quality OCR (Unclear text)

```
Rx
Tab. Par____mol 6__mg
1-_-1 afte_ m___s
Dur___: 3 d_ys

Dr. ______ Kumar
```

## Sample 8: Pediatric Prescription (Should trigger safety warning)

```
Rx

Syp. Amoxicillin 125mg/5ml
5ml TDS for 5 days
(Pediatric formulation)

Syp. Paracetamol 250mg/5ml
5ml SOS for fever
Max 4 times daily

Patient: Child (Age: 5 years)
Weight: 18kg

Dr. Anjali Desai
Pediatrician
```

## Sample 9: Prescription in Hindi (Transliterated)

```
Rx

Tab. Paracetamol 650mg
Bhojan ke baad din mein teen baar
3 din ke liye

Dr. Ramesh Gupta
Date: 21/01/2026
```

## Sample 10: Multi-language Prescription

```
Rx

मेडिसिन:
Tab. Paracetamol 650mg
1-1-1 after meals
Duration: 3 days

Dr. Sharma
License: 67890
```

## How to Test

1. **Valid Prescriptions**: Use Samples 1-5, 8-10
   - Expected: `valid: true`
   - Should extract medicines with explanations
   - Safety warnings for antibiotics (4), steroids (5), pediatric (8)

2. **Invalid Text**: Use Sample 6
   - Expected: `valid: false`
   - Reason: "Not a medical prescription"

3. **Poor Quality**: Use Sample 7
   - Expected: `valid: true` but with uncertain fields
   - Should mention text quality issues in general_advice

4. **Multi-language**: Use Sample 9 or 10
   - Test with `language: "Hindi"`
   - Expected: Full response in Hindi

## cURL Test Commands

### Test Valid Prescription

```bash
curl -X POST http://localhost:3000/api/ocr/explain \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ocrText": "Rx\nTab. Paracetamol 650mg\n1-1-1 after meals\nDuration: 3 days\n\nDr. Rajesh Kumar",
    "language": "English"
  }'
```

### Test Invalid Text

```bash
curl -X POST http://localhost:3000/api/ocr/explain \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ocrText": "This is just a regular document with no medical content",
    "language": "English"
  }'
```

### Test Hindi Language

```bash
curl -X POST http://localhost:3000/api/ocr/explain \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ocrText": "Rx\nTab. Paracetamol 650mg\n1-1-1\n3 days\nDr. Sharma",
    "language": "Hindi"
  }'
```

## Expected JSON Structure

```json
{
  "valid": true,
  "medicines": [
    {
      "name": "Medicine name",
      "dose": "Dosage",
      "frequency": "How often",
      "duration": "How long",
      "route": "How to take",
      "explanation": "Patient-friendly explanation",
      "precautions": "Safety warnings"
    }
  ],
  "general_advice": "Overall advice",
  "disclaimer": "Medical disclaimer",
  "ttsText": "Filtered text for audio"
}
```
