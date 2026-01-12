import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import api from '@services/api';
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
      <div className="glass-card p-10 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10 border border-white/40 shadow-xl">
        <div className="relative group">
          <div className="w-28 h-28 bg-gradient-to-br from-medical-primary to-medical-secondary text-white rounded-3xl flex items-center justify-center text-4xl font-extrabold shadow-lg overflow-hidden border-2 border-white">
            {user?.image ? (
              <img
                src={user.image.startsWith('http') ? user.image : `http://localhost:3000${user.image}`}
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
          {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-3xl"><div className="w-6 h-6 border-4 border-medical-primary border-t-transparent rounded-full animate-spin"></div></div>}
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">{user?.name}</h2>
          <p className="text-slate-500 text-lg font-medium">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="bg-medical-primary/10 px-4 py-2 rounded-xl text-sm font-bold text-medical-primary border border-medical-primary/10 uppercase tracking-widest">
              {user?.role}
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold text-emerald-600 border border-emerald-100 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Verified {user?.role === 'doctor' ? 'Practitioner' : 'Member'}
            </div>
          </div>
        </div>
      </div>

      {/* OCR Analysis Section */}
      <div className="glass-card p-10 border border-white/40 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-800">Medical Image Analysis</h3>
          <div className="text-xs font-black text-medical-primary bg-medical-primary/10 px-3 py-1 rounded-full uppercase">Beta Tool</div>
        </div>
        <p className="text-slate-500 font-medium">Upload a prescription or medical license to extract key information using our AI OCR.</p>

        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <label className="btn-primary py-3 px-10 rounded-2xl font-bold cursor-pointer transition-transform active:scale-95">
            {analyzing ? 'Analyzing Image...' : 'Upload Image'}
            <input type="file" className="hidden" onChange={handleOcrAnalyze} accept="image/*" disabled={analyzing} />
          </label>
          <p className="mt-4 text-xs text-slate-400 font-bold uppercase">PNG, JPG or JPEG up to 5MB</p>
        </div>

        {ocrResult && (
          <div className="mt-6 p-6 bg-medical-primary/5 border border-medical-primary/10 rounded-3xl space-y-4 animate-scale-in">
            <h4 className="font-bold text-medical-primary flex items-center">
              <span className="mr-2">✨</span> Analysis Results
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/60 rounded-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Type Detected</p>
                <p className="font-bold text-slate-700">{ocrResult.isPrescription ? 'Prescription' : 'Other Document'}</p>
              </div>
              <div className="p-4 bg-white/60 rounded-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Confidence Score</p>
                <p className="font-bold text-slate-700">{ocrResult.confidence.toFixed(1)}%</p>
              </div>
            </div>
            <div className="p-4 bg-white/60 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Detected Keywords</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {ocrResult.detectedKeywords.map((tag, i) => (
                  <span key={i} className="bg-medical-primary/10 text-medical-primary text-[10px] px-2 py-0.5 rounded-lg font-black uppercase">
                    {tag}
                  </span>
                ))}
                {ocrResult.detectedKeywords.length === 0 && <span className="text-slate-400 italic text-xs">None detected</span>}
              </div>
            </div>
            <div className="p-4 bg-white/60 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Extracted Text Preview</p>
              <p className="text-xs text-slate-500 font-medium line-clamp-3 italic">"{ocrResult.rawText.substring(0, 200)}..."</p>
            </div>
          </div>
        )}
      </div>

      {/* Prescription History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-bold text-slate-800">Prescription History</h3>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            {history.length} records
          </span>
        </div>

        {loading ? (
          <Loader message={t('common.loading')} />
        ) : history.length > 0 ? (
          <div className="grid gap-6">
            {history.map((item) => (
              <div key={item.id} className="glass-card p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-white/80 transition-all cursor-pointer border border-slate-200/50 shadow-sm active:scale-[0.99] group">
                <div className="flex items-center space-x-6 text-center sm:text-left">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-medical-primary/5 group-hover:border-medical-primary/20 transition-colors">
                    <svg className="w-7 h-7 text-slate-400 group-hover:text-medical-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-800">{item.medication || item.title}</h4>
                    <p className="text-slate-400 font-medium">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0">
                  <span className="px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-extrabold uppercase tracking-widest">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-20 text-center space-y-6 border-2 border-dashed border-slate-200 bg-slate-50/20">
            <div className="text-5xl">📄</div>
            <p className="text-slate-500 font-medium text-lg">No prescriptions analyzed yet.</p>
            <button className="btn-primary py-3 px-8 rounded-2xl font-bold">Analyze First RX</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
