import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import api, { IMAGE_BASE_URL } from '@services/api';
import Loader from '@components/Loader';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/prescriptions'); // Using correct API route
        setHistory(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    setUploading(true);
    try {
      const res = await api.post('/users/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update the user object in context and localStorage
      updateUser({ image: res.data.image });

      alert("Profile picture updated!");
      // window.location.reload(); // No longer strictly needed if state updates correctly
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleOcrAnalyze = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('medicalImage', file);

    setAnalyzing(true);
    setOcrResult(null);
    try {
      const res = await api.post('/ocr/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOcrResult(res.data.analysis);
    } catch (err) {
      alert("Analysis failed: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in py-6">
      {/* Profile Header */}
      <div className="glass-card p-10 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 border border-white/40 dark:border-white/10 shadow-xl bg-white/10 dark:bg-neutral-900/40 transition-colors">
        <div className="relative group">
          <div className="w-28 h-28 bg-gradient-to-br from-medical-primary to-medical-secondary text-white rounded-3xl flex items-center justify-center text-4xl font-extrabold shadow-lg overflow-hidden border-2 border-white dark:border-neutral-800 transition-colors">
            {user?.image ? (
              <img
                src={user.image.startsWith('http') ? user.image : `${IMAGE_BASE_URL}${user.image}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
              />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
            <span className="text-white text-xs font-bold uppercase">Change</span>
            <input type="file" className="hidden" onChange={handleProfilePicUpload} accept="image/*" />
          </label>
          {uploading && <div className="absolute inset-0 bg-white/60 dark:bg-neutral-800/60 flex items-center justify-center rounded-3xl transition-colors"><div className="w-6 h-6 border-4 border-medical-primary border-t-transparent rounded-full animate-spin"></div></div>}
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-neutral-100 tracking-tight transition-colors">{user?.name}</h2>
          <p className="text-slate-500 dark:text-neutral-400 text-lg font-medium transition-colors">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="bg-medical-primary/10 dark:bg-medical-primary/20 px-4 py-2 rounded-xl text-sm font-bold text-medical-primary border border-medical-primary/10 dark:border-medical-primary/20 uppercase tracking-widest transition-colors">
              {user?.role}
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center transition-colors">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Verified {user?.role === 'doctor' ? 'Practitioner' : 'Member'}
            </div>
          </div>
        </div>
      </div>

      {/* OCR Analysis Section */}
      <div className="glass-card p-10 border border-white/40 dark:border-white/10 shadow-xl space-y-6 bg-white/10 dark:bg-neutral-900/40 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-neutral-100 transition-colors">Medical Image Analysis</h3>
          <div className="text-xs font-black text-medical-primary bg-medical-primary/10 dark:bg-medical-primary/20 px-3 py-1 rounded-full uppercase transition-colors">Beta Tool</div>
        </div>
        <p className="text-slate-500 dark:text-neutral-400 font-medium transition-colors">Upload a prescription or medical license to extract key information using our AI OCR.</p>

        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-neutral-700 rounded-3xl bg-slate-50/50 dark:bg-neutral-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <label className="btn-primary py-3 px-10 rounded-2xl font-bold cursor-pointer transition-transform active:scale-95">
            {analyzing ? 'Analyzing Image...' : 'Upload Image'}
            <input type="file" className="hidden" onChange={handleOcrAnalyze} accept="image/*" disabled={analyzing} />
          </label>
          <p className="mt-4 text-xs text-slate-400 dark:text-neutral-500 font-bold uppercase transition-colors">PNG, JPG or JPEG up to 5MB</p>
        </div>

        {ocrResult && (
          <div className="mt-6 p-6 bg-medical-primary/5 dark:bg-medical-primary/10 border border-medical-primary/10 dark:border-white/5 rounded-3xl space-y-4 animate-scale-in">
            <h4 className="font-bold text-medical-primary flex items-center">
              <span className="mr-2">✨</span> Analysis Results
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/60 dark:bg-neutral-800/60 rounded-2xl transition-colors">
                <p className="text-[10px] uppercase font-black text-slate-400 dark:text-neutral-500 mb-1">Type Detected</p>
                <p className="font-bold text-slate-700 dark:text-neutral-200">{ocrResult.isPrescription ? 'Prescription' : 'Other Document'}</p>
              </div>
              <div className="p-4 bg-white/60 dark:bg-neutral-800/60 rounded-2xl transition-colors">
                <p className="text-[10px] uppercase font-black text-slate-400 dark:text-neutral-500 mb-1">Confidence Score</p>
                <p className="font-bold text-slate-700 dark:text-neutral-200">{ocrResult.confidence.toFixed(1)}%</p>
              </div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-neutral-800/60 rounded-2xl transition-colors">
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-neutral-500 mb-1">Detected Keywords</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {ocrResult.detectedKeywords.map((tag, i) => (
                  <span key={i} className="bg-medical-primary/10 dark:bg-medical-primary/20 text-medical-primary text-[10px] px-2 py-0.5 rounded-lg font-black uppercase transition-colors">
                    {tag}
                  </span>
                ))}
                {ocrResult.detectedKeywords.length === 0 && <span className="text-slate-400 dark:text-neutral-500 italic text-xs">None detected</span>}
              </div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-neutral-800/60 rounded-2xl transition-colors">
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-neutral-500 mb-1">Extracted Text Preview</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium line-clamp-3 italic transition-colors">"{ocrResult.rawText.substring(0, 200)}..."</p>
            </div>
          </div>
        )}
      </div>

      {/* Prescription History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-neutral-100 transition-colors">Prescription History</h3>
          <span className="bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-colors">
            {history.length} records
          </span>
        </div>

        {loading ? (
          <Loader message={t('common.loading')} />
        ) : history.length > 0 ? (
          <div className="grid gap-6">
            {history.map((item) => (
              <div key={item.id} className="glass-card p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-200/50 dark:border-white/5 shadow-sm active:scale-[0.99] group bg-white/10 dark:bg-neutral-900/40">
                <div className="flex items-center space-x-6 text-center sm:text-left">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-neutral-700 group-hover:bg-medical-primary/5 dark:group-hover:bg-medical-primary/10 group-hover:border-medical-primary/20 transition-colors">
                    <svg className="w-7 h-7 text-slate-400 dark:text-neutral-500 group-hover:text-medical-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-800 dark:text-neutral-100 transition-colors">{item.medication || item.title}</h4>
                    <p className="text-slate-400 dark:text-neutral-500 font-medium transition-colors">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0">
                  <span className="px-5 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-20 text-center space-y-6 border-2 border-dashed border-slate-200 dark:border-neutral-700 bg-slate-50/20 dark:bg-neutral-800/20 transition-colors rounded-[2rem]">
            <div className="text-5xl">📄</div>
            <p className="text-slate-500 dark:text-neutral-400 font-medium text-lg transition-colors">No prescriptions analyzed yet.</p>
            <button className="btn-primary py-3 px-8 rounded-2xl font-bold">Analyze First RX</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
