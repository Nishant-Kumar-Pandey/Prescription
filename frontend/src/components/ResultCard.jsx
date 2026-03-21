import AudioPlayer from '@components/AudioPlayer';
import { useLanguage } from '@context/LanguageContext';

const ResultCard = ({ result }) => {
    const { t } = useLanguage();
    if (!result || !result.valid) {
        return (
            <div className="glass-card p-10 text-center space-y-4 max-w-2xl mx-auto border-red-200 dark:border-red-900/30 dark:bg-neutral-900/40">
                <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-100">{t('results.incomplete')}</h3>
                <p className="text-slate-600 dark:text-neutral-400 font-medium">{result?.reason || t('results.incomplete')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto transition-colors duration-150">
            {/* Analysis Header */}
            <div className="flex items-center gap-4 mb-8 bg-medical-primary/5 dark:bg-medical-primary/10 p-6 rounded-2xl border border-medical-primary/10 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                    {result.aiFailed && (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                            {t('results.fallback')}
                        </span>
                    )}
                </div>
                <div className="w-16 h-16 bg-medical-primary rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg flex-shrink-0">
                    {result.isPrescription ? '📄' : '📋'}
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-slate-800 dark:text-neutral-100 tracking-tight transition-colors">
                        {result.isPrescription ? t('results.prescriptionAnalysis') : t('results.medicalAnalysis')}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                            {t('results.confidence')}: <span className="text-medical-primary">{result.confidence?.toFixed(1) || 0}%</span>
                        </p>
                        <span className="w-1 h-1 bg-slate-300 dark:bg-neutral-700 rounded-full"></span>
                        <p className="text-slate-500 dark:text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                            {t('results.type')}: <span className="text-medical-primary">{result.isPrescription ? 'RX' : 'Doc'}</span>
                        </p>
                    </div>
                </div>
            </div>
            {/* Summary Highlights */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-medical-primary flex items-center space-x-4 bg-white/50 dark:bg-neutral-900/40 dark:border-white/5">
                    <div className="bg-medical-primary/10 dark:bg-medical-primary/20 p-3 rounded-xl text-medical-primary font-bold text-2xl">
                        {result.medicines?.length || 0}
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 dark:text-neutral-500 font-extrabold uppercase tracking-widest">{t('results.medicinesDetected')}</p>
                        <h4 className="font-bold text-slate-800 dark:text-neutral-100 transition-colors">{t('results.extractedFromRx')}</h4>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-medical-secondary flex items-center space-x-4 bg-white/50 dark:bg-neutral-900/40 dark:border-white/5">
                    <div className="bg-medical-secondary/10 dark:bg-medical-secondary/20 p-3 rounded-xl text-medical-secondary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 dark:text-neutral-500 font-extrabold uppercase tracking-widest">{t('results.aiConfidence')}</p>
                        <h4 className="font-bold text-slate-800 dark:text-neutral-100 transition-colors">{t('results.highPrecision')}</h4>
                    </div>
                </div>
            </div>

            {/* Medicines List */}
            <div className="space-y-6">
                {result.medicines?.map((med, index) => (
                    <div key={index} className="glass-card p-8 space-y-6 relative overflow-hidden group hover:border-medical-primary/30 dark:hover:border-medical-primary/50 transition-colors duration-150 bg-white/50 dark:bg-neutral-900/40 dark:border-white/5">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-medical-primary/5 dark:bg-medical-primary/10 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="bg-medical-primary/10 dark:bg-medical-primary/20 text-medical-primary text-[10px] font-black px-2 py-0.5 rounded-md uppercase">{t('results.medicine')} {index + 1}</span>
                                    {med.route && <span className="bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase transition-colors">{med.route}</span>}
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 dark:text-neutral-100 tracking-tight transition-colors">{med.name}</h2>
                                <p className="text-medical-primary font-extrabold text-lg flex items-center transition-colors">
                                    <span className="w-2 h-2 bg-medical-primary rounded-full mr-2 animate-pulse"></span>
                                    {med.dose} {med.frequency && `• ${med.frequency}`}
                                </p>
                            </div>
                            <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-slate-100 dark:border-white/5 px-5 py-3 rounded-2xl text-sm font-black text-slate-600 dark:text-neutral-300 shadow-sm flex items-center space-x-2 transition-colors">
                                <svg className="w-4 h-4 text-medical-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{t('results.duration')}: {med.duration}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-5 gap-6 relative z-10">
                            <div className="md:col-span-3 space-y-4">
                                <h3 className="text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest flex items-center">
                                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('results.simpleExplanation')}
                                </h3>
                                <div className="bg-slate-50/70 dark:bg-neutral-800/50 p-5 rounded-2xl border border-slate-100/50 dark:border-white/5 transition-colors">
                                    <p className="text-slate-700 dark:text-neutral-200 leading-relaxed font-semibold italic text-base">
                                        "{med.explanation}"
                                    </p>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-xs font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest flex items-center">
                                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {t('results.precautions')}
                                </h3>
                                <div className="bg-amber-50/50 dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-100/50 dark:border-amber-900/30 transition-colors">
                                    <p className="text-[13px] text-amber-900 dark:text-amber-200 font-bold leading-relaxed">
                                        {med.precautions}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* General Advice & TTS */}
            <div className="glass-card p-10 space-y-8 border border-white/40 dark:border-white/10 shadow-2xl relative overflow-hidden bg-white/50 dark:bg-neutral-900/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/5 dark:bg-medical-primary/10 rounded-bl-full -mr-16 -mt-16"></div>

                {result.general_advice && (
                    <div className="space-y-4 relative z-10">
                        <h3 className="text-sm font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('results.generalAdvice')}
                        </h3>
                        <p className="text-slate-600 dark:text-neutral-100 font-bold text-lg leading-relaxed bg-medical-primary/5 dark:bg-medical-primary/10 p-6 rounded-2xl border border-medical-primary/10 dark:border-white/5 transition-colors">
                            {result.general_advice}
                        </p>
                    </div>
                )}

                <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 space-y-8 relative z-10">
                    <AudioPlayer text={result.ttsText || t('results.noVoice')} />

                    {/* Technical Analysis Toggle (Requested feature) */}
                    <details className="group">
                        <summary className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-[0.2em] cursor-pointer hover:text-medical-primary transition-colors list-none flex items-center space-x-2">
                            <svg className="w-3 h-3 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span>{t('results.viewTechnical')}</span>
                        </summary>
                        <div className="mt-4 p-5 bg-slate-900 dark:bg-black rounded-2xl border border-white/10 space-y-4 transition-colors">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">{t('results.ocrStatus')}</p>
                                    <p className="text-xs text-emerald-400 font-bold">{t('results.successfullyParsed')}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">{t('results.targetLanguage')}</p>
                                    <p className="text-xs text-white font-bold">{result.language || 'English'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">{t('results.rawEvidence')}</p>
                                <pre className="text-[10px] text-slate-400 font-mono bg-black/40 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap max-h-32">
                                    {result.rawText || t('results.rawEvidence')}
                                </pre>
                            </div>
                        </div>
                    </details>

                    <div className="bg-slate-900 p-6 rounded-2xl flex items-start space-x-4 shadow-xl">
                        <div className="bg-white/10 p-2 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-bold italic">
                            {result.disclaimer || t('common.disclaimer')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;

