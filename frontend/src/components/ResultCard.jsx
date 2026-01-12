import AudioPlayer from '@components/AudioPlayer';
import { useLanguage } from '@context/LanguageContext';

const ResultCard = ({ result }) => {
    const { t } = useLanguage();
    if (!result) return null;

    return (
        <div className="glass-card p-10 space-y-8 animate-fade-in w-full max-w-3xl mx-auto border border-white/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{result.medication}</h2>
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-medical-primary rounded-full animate-pulse"></span>
                        <p className="text-medical-primary font-bold text-lg">{result.dosage}</p>
                    </div>
                </div>
                <div className="bg-medical-primary/10 border border-medical-primary/10 px-4 py-2 rounded-xl text-xs font-extrabold text-medical-primary uppercase tracking-widest shadow-sm">
                    {result.duration}
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">{t('home.resultsTitle')}</h3>
                </div>
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-slate-700 leading-relaxed font-medium text-lg">
                        "{result.explanation}"
                    </p>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-8">
                <AudioPlayer text={result.explanation} />

                <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl flex items-start space-x-4">
                    <div className="bg-amber-100 p-2 rounded-xl">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed font-bold italic">
                        {t('common.disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
