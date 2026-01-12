import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import LanguageSelect from '@components/LanguageSelect';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  return (
    <nav className="glass-nav px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
      <Link to="/" className="text-3xl font-black bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent tracking-tighter">
        RxExplain
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest">
          {t('common.home')}
        </Link>

        {isAdmin ? (
          <Link to="/admin" className="text-amber-600 hover:text-amber-700 transition-all font-black text-sm uppercase tracking-widest">
            Admin Dashboard
          </Link>
        ) : isDoctor ? (
          <Link to="/doctor" className="text-blue-600 hover:text-blue-700 transition-all font-black text-sm uppercase tracking-widest">
            Practice Hub
          </Link>
        ) : (
          <Link to="/doctors" className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest">
            {t('common.doctors')}
          </Link>
        )}

        <Link to="/help" className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest">
          {t('common.help')}
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <LanguageSelect />

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        {user ? (
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest">
              {t('common.profile')}
            </Link>
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-slate-800 text-xs font-black uppercase tracking-tighter">Hi, {user.name}</span>
                <span className="text-[10px] font-black text-medical-primary uppercase tracking-widest opacity-70">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
              >
                {t('common.logout')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest">
              {t('common.login')}
            </Link>
            <Link to="/signup" className="btn-primary py-2.5 px-6 rounded-full text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              {t('common.signup')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
