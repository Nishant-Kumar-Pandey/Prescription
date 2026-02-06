import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import api from '@services/api';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '',
    experience: '',
    licenseNumber: '',
    adminKey: '',
    preferredLanguage: 'en',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/signup', formData);
      // After successful signup, we can automatically log them in or redirect to login
      alert("Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      if (!err.response) {
        setError("Cannot connect to server. Please ensure backend is running.");
      } else {
        setError(err.response.data?.message || "Signup failed. Please check your data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="glass-card p-10 space-y-8 animate-fade-in border border-white/40 shadow-2xl bg-white/10 backdrop-blur-xl rounded-[2rem]">
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t('auth.createAccount')}</h2>
          <p className="text-slate-500 mt-3 font-medium text-lg">Join the smart healthcare revolution</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-xl text-center font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Fields */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.name')}</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="Full Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.email')}</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.password')}</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Account Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm font-medium"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Location Fields */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Street Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="123 Medical St"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">City</label>
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="New York"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">State / Province</label>
              <input
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="NY"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
              <input
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="United States"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Postal Code</label>
              <input
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {formData.role === 'doctor' && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-6 animate-slide-up">
              <h3 className="text-lg font-bold text-medical-primary">Professional Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                  <input
                    name="specialization"
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                    placeholder="e.g. Cardiologist"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Experience (Years)</label>
                  <input
                    name="experience"
                    type="number"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                    placeholder="12"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Medical License Number</label>
                  <input
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm"
                    placeholder="MC-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.role === 'admin' && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-slide-up">
              <h3 className="text-lg font-bold text-amber-600">Admin Authority Verification</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">System Admin Key</label>
                <input
                  name="adminKey"
                  type="password"
                  required
                  value={formData.adminKey}
                  onChange={handleChange}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:bg-white transition-all shadow-sm"
                  placeholder="Enter your system admin passkey"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-xl font-black rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-medical-primary font-bold hover:text-medical-secondary transition-colors underline decoration-2 underline-offset-4">{t('common.login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
