import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const IMAGE_BASE_URL = API_URL.replace('/api', '');

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid (e.g. user deleted and recreated)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Force redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
};

export const doctorService = {
    getAll: (search, specialization) => {
        const params = {};
        if (search) params.search = search;
        if (specialization && specialization !== 'All') params.specialization = specialization;
        return api.get('/doctors', { params });
    },
};

export const appointmentService = {
    book: (data) => api.post('/appointments', data),
    getAll: () => api.get('/appointments'),
    cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const prescriptionService = {
    create: (data) => api.post('/prescriptions', data),
    getAll: () => api.get('/prescriptions'),
};

export const userService = {
    getProfile: () => api.get('/users/me'),
};

export const patientService = {
    getAll: () => api.get('/patients'),
};

export const ocrService = {
    analyze: (imageFile) => {
        const formData = new FormData();
        formData.append('medicalImage', imageFile);
        return api.post('/ocr/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    explain: (ocrText, language) => api.post('/ocr/explain', { ocrText, language }),
};

export default api;