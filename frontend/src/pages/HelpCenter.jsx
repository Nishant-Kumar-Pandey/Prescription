import { useLanguage } from '@context/LanguageContext';

const HelpCenter = () => {
  const { t, language } = useLanguage();

  const faqs = [
    {
      q: language === 'en' ? "How accurate is the AI explanation?" : "एआई स्पष्टीकरण कितना सटीक है?",
      a: language === 'en'
        ? "Our AI is trained on medical documentation to provide simplified explanations. However, it is not a substitute for professional medical advice."
        : "हमारा एआई सरल स्पष्टीकरण प्रदान करने के लिए चिकित्सा दस्तावेजों पर प्रशिक्षित है। हालांकि, यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।"
    },
    {
      q: language === 'en' ? "Which languages are supported?" : "कौन सी भाषाएँ समर्थित हैं?",
      a: language === 'en'
        ? "We currently support English and Hindi for both text and audio explanations."
        : "हम वर्तमान में पाठ और ऑडियो दोनों स्पष्टीकरणों के लिए अंग्रेजी और हिंदी का समर्थन करते हैं।"
    },
    {
      q: language === 'en' ? "Is my medical data secure?" : "क्या मेरा मेडिकल डेटा सुरक्षित है?",
      a: language === 'en'
        ? "Yes, we prioritize your privacy. Uploaded images are processed securely and are not stored permanently without your consent."
        : "हाँ, हम आपकी गोपनीयता को प्राथमिकता देते हैं। अपलोड की गई छवियों को सुरक्षित रूप से संसाधित किया जाता है।"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-800">{t('common.help')}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Learn how to use RxExplain and understand our safety guidelines.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 space-y-6 border border-white/40 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
            <svg className="w-7 h-7 text-medical-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Medical Disclaimer</span>
          </h2>
          <div className="p-6 bg-amber-50/50 border-l-4 border-amber-400 rounded-2xl">
            <p className="text-amber-900 leading-relaxed text-sm font-medium">
              {t('common.disclaimer')}
              <br /><br />
              <strong>Always follow the instructions provided by your licensed healthcare provider.</strong>
            </p>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6 border border-white/40 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
            <svg className="w-7 h-7 text-medical-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>How to Use</span>
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex space-x-4 items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-medical-primary text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
                  {step}
                </div>
                <p className="text-slate-600 text-sm font-semibold">
                  {step === 1 && "Take a clear photo of your prescription."}
                  {step === 2 && "Upload the image to our homepage."}
                  {step === 3 && "Select your language in the navbar."}
                  {step === 4 && "Listen to the audio or read the breakdown."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8 py-8">
        <h2 className="text-3xl font-extrabold text-slate-800 text-center">Frequently Asked Questions</h2>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card p-8 space-y-3 border border-slate-100 shadow-soft hover:border-medical-primary/20 transition-colors">
              <h4 className="font-bold text-xl text-slate-800">{faq.q}</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
