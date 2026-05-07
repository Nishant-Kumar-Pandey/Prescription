# 🏥 Prescription AI

Prescription AI is an intelligent healthcare platform built with the MERN stack that leverages **Google Gemini AI** and **OCR technology** to simplify complex medical prescriptions into patient-friendly language. It bridges the communication gap between doctors and patients by providing multilingual explanations, safety warnings, and an integrated consultation booking system.

## ✨ Key Features

- **🧠 Generative AI Explainer:** Analyzes and simplifies complex medical prescriptions, explaining dosages, timing, and medication purpose using Google Gemini 1.5 Flash.
- **📄 Smart OCR:** Instantly digitizes physical prescriptions with high accuracy using Tesseract.js.
- **🌍 Multilingual Support:** Translates medical instructions into 10+ languages for diverse demographics.
- **⚠️ Medicine Safety Engine:** Automatically detects high-risk medications and appends critical safety warnings.
- **📅 Appointment Booking:** Seamless scheduling interface for booking online consultations with doctors.
- **💳 Secure Payments:** Integrated with Razorpay for handling consultation fees.
- **🔐 Role-Based Dashboards:** Distinct and personalized dashboards for Patients, Doctors, and Administrators.
- **🎨 Modern UI:** A responsive, accessible frontend featuring a premium glassmorphic design system using Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router 7
- Tailwind CSS
- React-Hot-Toast (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Google Generative AI (Gemini)
- Tesseract.js (OCR)
- JWT (Authentication)
- Nodemailer & Multer
- Razorpay (Payments)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/prescription-ai.git
cd prescription-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
PASSWORD=your_email_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
ADMIN_SECRET_KEY=your_admin_secret
GOOGLE_AI_API_KEY=your_google_gemini_api_key
VITE_API_URL=your_frontend_url
```

Start the backend server:
```bash
npm start
# or for development:
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:
```bash
npm run dev
```

## 🌐 Deployment
- **Backend:** Can be deployed manually or using the provided `render.yaml` Blueprint on Render.
- **Frontend:** Configured for Vercel deployment. Ensure you update your `VITE_API_URL` environment variable to point to your live backend URL.

## 📄 License
This project is for educational and portfolio purposes.

---
*Built by Nishant Kumar Pandey*
