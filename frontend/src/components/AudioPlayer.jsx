import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@context/LanguageContext';

const AudioPlayer = ({ text }) => {
    const { language, t } = useLanguage();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [synth, setSynth] = useState(null);

    const loadVoices = useCallback(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Initial heuristic to find a good voice based on global language
        const targetLang = language === "hi" ? "hi-IN" : "en-IN";

        const bestVoice = availableVoices.find(v => v.lang.includes(targetLang)) ||
            availableVoices.find(v => v.lang.includes(language)) ||
            availableVoices[0];

        if (bestVoice) setSelectedVoice(bestVoice.name);
    }, [language]);

    useEffect(() => {
        const s = window.speechSynthesis;
        setSynth(s);

        s.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            if (s) s.cancel();
        };
    }, [loadVoices]);

    // Re-load voices if language changes to ensure correct default
    useEffect(() => {
        loadVoices();
    }, [language, loadVoices]);

    const toggleSpeech = () => {
        if (!synth) return;

        if (isSpeaking) {
            synth.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);

            // "Natural Voice" Settings (Calm & Accessible)
            utterance.rate = 0.82; // Slightly slower than default for clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) {
                utterance.voice = voice;
                utterance.lang = voice.lang;
            } else {
                utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
            }

            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synth.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const handleStop = () => {
        if (synth) {
            synth.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="glass-card p-8 space-y-6 border-l-4 border-l-medical-primary animate-fade-in w-full shadow-lg border border-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-medical-primary/5 rounded-2xl flex items-center justify-center border border-medical-primary/10">
                        <svg className={`w-7 h-7 text-medical-primary ${isSpeaking ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">{t('home.voicePlayback')}</h4>
                        <p className="text-xs text-slate-400 uppercase tracking-[0.1em] font-bold">Healthcare Accessibility Mode</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {!isSpeaking ? (
                        <button
                            onClick={toggleSpeech}
                            className="btn-primary py-3 px-8 flex items-center space-x-2 text-sm font-extrabold rounded-xl shadow-soft transition-transform active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span>Listen to Breakdown</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleStop}
                            className="bg-red-50 text-red-500 border border-red-100 px-8 py-3 rounded-xl font-extrabold flex items-center space-x-3 text-sm hover:bg-red-100 transition-all shadow-sm active:scale-95"
                        >
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                            <span>{t('home.stop')}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-end gap-6">
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] items-center flex font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        {t('home.selectVoice')}
                    </label>
                    <div className="relative">
                        <select
                            value={selectedVoice || ''}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-medical-primary/20 appearance-none cursor-pointer shadow-sm pr-10"
                        >
                            {voices.length > 0 ? (
                                voices.map(voice => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))
                            ) : (
                                <option>Loading browser voices...</option>
                            )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-medical-bg/40 p-4 rounded-2xl border border-medical-primary/5 flex-1 shadow-sm">
                    <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
                        “{t('common.disclaimer')}”
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
