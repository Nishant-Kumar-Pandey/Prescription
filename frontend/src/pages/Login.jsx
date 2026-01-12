import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import api from '@services/api';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card p-10 space-y-8 animate-fade-in border border-white/40 shadow-2xl bg-white/10 backdrop-blur-xl rounded-[2rem]">
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t('auth.welcome')}</h2>
          <p className="text-slate-500 mt-2 font-medium">Access your secure dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-xl text-center font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">{t('auth.password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/70 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-medical-primary/40 focus:bg-white transition-all shadow-sm font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-xl font-black rounded-2xl shadow-xl active:scale-95 transition-all tracking-wide"
          >
            {loading ? t('common.loading') : t('auth.submitLogin')}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium pt-2">
          {t('auth.noAccount')}{' '}
          <Link to="/signup" className="text-medical-primary font-bold hover:text-medical-secondary transition-colors underline decoration-2 underline-offset-4">{t('common.signup')}</Link>
        </p>
      </div>

      <div className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-50">
        Medical-Grade Security Protocol Active
      </div>
    </div>
  );
};

export default Login;
