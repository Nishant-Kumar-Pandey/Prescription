import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@i18n/en.json';
import hi from '@i18n/hi.json';

const LanguageContext = createContext();

const translations = {
    en,
    hi
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('rx_lang') || 'en');

    useEffect(() => {
        localStorage.setItem('rx_lang', language);
        document.documentElement.lang = language;
    }, [language]);

    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation not found for path: ${path} in language: ${language}`);
                return path;
            }
            current = current[key];
        }

        return current;
    };

    const toggleLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
