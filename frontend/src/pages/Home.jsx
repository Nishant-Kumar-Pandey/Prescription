import { useState } from 'react';
import UploadPrescription from '@components/UploadPrescription';
import ResultCard from '@components/ResultCard';
import Loader from '@components/Loader';
import { mockApi } from '@services/mockApi';
import { useLanguage } from '@context/LanguageContext';

const Home = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleExplain = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    try {
      const apiLang = language === 'hi' ? 'Hindi' : 'English';
      const data = await mockApi.explainPrescription(file, apiLang);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to explain prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          {t('home.title').split(' ').map((word, i) => (
            i === 2 && language === 'en' ? <span key={i} className="bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">{word} </span> : word + ' '
          ))}
          {language === 'hi' && <span className="bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">{t('home.title')}</span>}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          {t('home.subtitle')}
        </p>
      </div>

      {!result && !loading && (
        <div className="grid md:grid-cols-2 gap-8 items-stretch animate-fade-in">
          <UploadPrescription onUpload={setFile} />

          <div className="space-y-8 flex flex-col justify-center">
            <div className="glass-card p-8 border-l-4 border-l-medical-primary shadow-soft">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">How it works:</h3>
              <ul className="text-sm text-slate-600 space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-primary/10 text-medical-primary rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span className="font-medium">Upload a clear image of your RX.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-primary/10 text-medical-primary rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span className="font-medium">Select your primary language in the navbar.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-medical-primary/10 text-medical-primary rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span className="font-medium">Get human-friendly simplified analysis.</span>
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
              Start over with another prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
