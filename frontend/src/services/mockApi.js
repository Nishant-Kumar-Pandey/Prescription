import { authService, doctorService, appointmentService, prescriptionService, ocrService } from './api.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    login: async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return {
                success: true,
                user: user
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Invalid credentials');
        }
    },

    signup: async (name, email, password, role, additionalInfo) => {
        try {
            await authService.signup({ name, email, password, role, ...additionalInfo });
            return {
                success: true,
                user: { name, email, role }
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    },

    explainPrescription: async (image, language) => {
        let analyzeData = null;
        try {
            // 1. Analyze image to get OCR text (This is what works on Profile page)
            const analyzeRes = await ocrService.analyze(image);
            analyzeData = analyzeRes.data.analysis;
            const ocrText = analyzeData.rawText;

            if (!ocrText) {
                throw new Error("Could not extract text from image");
            }

            // 2. Try to get AI explanation
            try {
                const explainRes = await ocrService.explain(ocrText, language);
                const data = explainRes.data;

                // 3. Save to History
                try {
                    await prescriptionService.create({
                        content: data.ttsText || ocrText,
                        medicines: data.medicines || []
                    });
                } catch (saveError) {
                    console.error("Failed to save prescription to history:", saveError);
                }

                return {
                    ...data,
                    ...analyzeData,
                    success: data.valid
                };
            } catch (aiError) {
                console.warn("AI explanation failed, falling back to raw OCR results:", aiError);

                // Construct a fallback result using raw OCR data (matches Profile page experience)
                const fallbackData = {
                    valid: analyzeData.isPrescription,
                    medicines: analyzeData.detectedKeywords.map(k => ({ name: k, explanation: "AI explanation unavailable" })),
                    general_advice: "AI analysis is currently experiencing heavy traffic. Here is the raw extracted information.",
                    disclaimer: "Please consult a doctor. AI explanation failed.",
                    ttsText: `OCR extracted text: ${ocrText.substring(0, 500)}`,
                    ...analyzeData,
                    aiFailed: true
                };

                // Save fallback to history too
                try {
                    await prescriptionService.create({
                        content: ocrText,
                        medicines: []
                    });
                } catch (sErr) { }

                return {
                    ...fallbackData,
                    success: analyzeData.isPrescription
                };
            }
        } catch (error) {
            console.error("Prescription analysis error:", error);
            throw new Error(error.response?.data?.message || error.message || 'Prescription analysis failed');
        }
    },

    getHistory: async () => {
        try {
            const response = await appointmentService.getAll();
            if (response.data && response.data.length > 0) {
                // Map backend data to frontend expectations
                return response.data.map(appt => ({ // Changed from mock data to actual data
                    id: appt._id,
                    date: appt.date,
                    medication: appt.doctorId?.specialization || 'Consultation', // Fallback
                    status: appt.status
                }));
            }
        } catch (error) {
            console.error(error);
        }

        return [
            { id: 1, date: '2023-12-25', medication: 'Amoxicillin', status: 'Completed' },
            { id: 2, date: '2023-12-10', medication: 'Paracetamol', status: 'Completed' }
        ];
    },

    getDoctors: async (search, specialization) => {
        try {
            const response = await doctorService.getAll(search, specialization);
            if (response.data && response.data.length > 0) {
                return response.data.map(doc => ({
                    ...doc,
                    id: doc._id,
                    // Add placeholder image if missing from DB
                    image: doc.image || 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200'
                }));
            }
        } catch (error) {
            console.error(error);
        }

        return [
            {
                id: 'd1',
                name: 'Dr. Sarah Smith',
                specialization: 'General Physician',
                experience: 12,
                rating: 4.8,
                languages: ['English', 'Hindi'],
                availability: 'Mon-Fri, 9AM-5PM',
                image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200'
            },
            {
                id: 'd2',
                name: 'Dr. Rahul Sharma',
                specialization: 'Cardiologist',
                experience: 15,
                rating: 4.9,
                languages: ['Hindi', 'English'],
                availability: 'Tue-Sat, 10AM-6PM',
                image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200'
            },
            {
                id: 'd3',
                name: 'Dr. Anita Desai',
                specialization: 'Pediatrician',
                experience: 8,
                rating: 4.7,
                languages: ['English', 'Hindi', 'Gujarati'],
                availability: 'Mon-Thu, 8AM-2PM',
                image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200'
            }
        ];
    },

    bookAppointment: async (doctorId, dateTime) => {
        try {
            // Parse dateTime string to date and time for backend
            let date = dateTime;
            let time = "09:00";

            if (dateTime.includes('T')) {
                [date, time] = dateTime.split('T');
                time = time.substring(0, 5);
            } else if (dateTime.includes(' ')) {
                [date, time] = dateTime.split(' ');
            }

            const response = await appointmentService.book({ doctorId, date, time });
            return {
                success: true,
                appointmentId: response.data._id,
                doctorId,
                dateTime
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Booking failed');
        }
    }
};
