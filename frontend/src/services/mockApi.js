import { authService, doctorService, appointmentService, prescriptionService } from './api.js';

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
        // Feature not yet implemented in backend, keeping mock logic for UI stability
        await delay(2000);
        const explanations = {
            English: "This prescription is for Amoxicillin 500mg. Take 1 capsule three times a day for 7 days. It is an antibiotic used to treat bacterial infections. Complete the full course even if you feel better.",
            Spanish: "Esta receta es de Amoxicilina 500mg. Tomar 1 cápsula tres veces al día durante 7 días. Es un antibiótico para infecciones bacterianas. Complete todo el tratamiento.",
            Hindi: "यह पर्चा अमोक्सिसिलिन 500mg के लिए है। 7 दिनों तक दिन में तीन बार 1 कैप्सूल लें। यह एक एंटीबायोटिक है। बेहतर महसूस होने पर भी कोर्स पूरा करें।"
        };

        const explanationText = explanations[language] || explanations['English'];

        // Save to Backend
        try {
            await prescriptionService.create({ content: explanationText });
        } catch (error) {
            console.error("Failed to save prescription:", error);
        }

        return {
            success: true,
            explanation: explanationText,
            medication: "Amoxicillin",
            dosage: "500mg, 1 Capsule 3x Daily",
            duration: "7 Days"
        };
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
