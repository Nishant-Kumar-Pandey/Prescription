import Navbar from '@components/Navbar';
import AppRoutes from '@routes/index';
import { useLanguage } from '@context/LanguageContext';

function App() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>

      <footer className="py-8 mt-auto border-t border-slate-200/60 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 max-w-2xl mx-auto italic">
            {t('common.disclaimer')}
          </p>
          <p className="text-xs text-slate-400 mt-4">
            &copy; {new Date().getFullYear()} RxExplain. {t('common.appName')}.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
