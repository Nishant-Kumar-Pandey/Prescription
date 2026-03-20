import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UploadPrescription from '@components/UploadPrescription';
import ResultCard from '@components/ResultCard';
import Loader from '@components/Loader';
import { mockApi } from '@services/mockApi';
import { prescriptionService } from '@services/api';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';

const Home = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await prescriptionService.getAll();
      setHistory(res.data.slice(0, 3)); // Show last 3
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleExplain = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    try {
      const apiLang = language === 'hi' ? 'Hindi' : 'English';
      const data = await mockApi.explainPrescription(file, apiLang);
      setResult(data);
      if (user) fetchHistory(); // Refresh history
    } catch (error) {
      console.error(error);
      alert("Failed to explain prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 transition-colors duration-300">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight leading-tight transition-colors">
          {t('home.title').split(' ').map((word, i) => (
            i === 2 && language === 'en' ? <span key={i} className="bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">{word} </span> : word + ' '
          ))}
          {language === 'hi' && <span className="bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">{t('home.title')}</span>}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium transition-colors">
          {t('home.subtitle')}
        </p>
      </div>

      {!result && !loading && (
        <div className="grid md:grid-cols-2 gap-8 items-stretch animate-fade-in">
          <UploadPrescription onUpload={setFile} />

          <div className="space-y-8 flex flex-col justify-center">
            <div className="glass-card p-8 border-l-4 border-l-medical-primary shadow-soft bg-white/50 dark:bg-slate-900/40 dark:border-white/10">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-lg">{t('home.howItWorks')}:</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-primary/10 dark:bg-medical-primary/20 text-medical-primary rounded-full flex items-center justify-center text-xs font-bold transition-colors">1</span>
                  <span className="font-medium">{t('home.step1Desc')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-primary/10 dark:bg-medical-primary/20 text-medical-primary rounded-full flex items-center justify-center text-xs font-bold transition-colors">2</span>
                  <span className="font-medium">{t('home.step2Desc')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-primary/10 dark:bg-medical-primary/20 text-medical-primary rounded-full flex items-center justify-center text-xs font-bold transition-colors">3</span>
                  <span className="font-medium">{t('home.step3Desc')}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleExplain}
              disabled={!file}
              className="btn-primary w-full py-4 text-xl font-bold shadow-xl rounded-2xl transition-transform active:scale-95 disabled:scale-100 disabled:opacity-50"
            >
              {t('home.uploadButton')}
            </button>
          </div>
        </div>
      )}

      {loading && <Loader message={t('home.processing')} />}

      {result && (
        <div className="space-y-8 animate-fade-in">
          <ResultCard result={result} />
          <div className="text-center">
              <button
                onClick={() => { setResult(null); setFile(null); }}
                className="text-medical-primary font-bold hover:text-medical-secondary transition-colors text-lg"
              >
                {t('home.startOver')}
              </button>
          </div>
        </div>
      )}

      {/* Recent History on Home Page */}
      {user && !result && !loading && history.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{t('home.historyTitle')}</h3>
            <Link to="/profile" className="text-medical-primary text-sm font-bold hover:underline transition-all">{t('home.viewAll')}</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {history.map((item, i) => (
              <div key={i}
                onClick={() => setResult({ ...item, valid: true, ttsText: item.content })}
                className="glass-card p-5 space-y-3 cursor-pointer hover:border-medical-primary/30 dark:hover:border-medical-primary/50 transition-all group bg-white/50 dark:bg-slate-900/40 dark:border-white/5"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-medical-primary/5 dark:bg-medical-primary/10 rounded-xl flex items-center justify-center text-medical-primary group-hover:bg-medical-primary group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold transition-colors">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate transition-colors">{item.medicines?.[0]?.name || "Prescription"}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed transition-colors">
                  {item.content || "Medical analysis report..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
