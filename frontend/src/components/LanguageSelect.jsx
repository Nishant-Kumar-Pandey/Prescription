import React from 'react';
import { useLanguage } from '@context/LanguageContext';

const LanguageSelect = () => {
    const { language, toggleLanguage, t } = useLanguage();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' }
    ];

    return (
        <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">
                {language === 'en' ? 'Language' : 'भाषा'}
            </span>
            <div className="relative group">
                <select
                    value={language}
                    onChange={(e) => toggleLanguage(e.target.value)}
                    className="appearance-none bg-white/50 backdrop-blur-md border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-primary/50 transition-all cursor-pointer hover:bg-white"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelect;
