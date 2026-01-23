import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { useLanguage } from '@context/LanguageContext';
import LanguageSelect from '@components/LanguageSelect';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  return (
    <>
      <nav className="glass-nav px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent tracking-tighter">
          RxExplain
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:text-medical-primary transition-all"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] md:hidden animate-slide-in">
            {/* Close Button */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <span className="text-xl font-black bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-600 hover:text-red-500 transition-all"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex flex-col p-6 space-y-4">
              {/* User Info */}
              {user && (
                <div className="pb-4 border-b border-slate-200">
                  <div className="text-sm font-black text-slate-800">Hi, {user.name}</div>
                  <div className="text-xs font-bold text-medical-primary uppercase">{user.role}</div>
                </div>
              )}

              {/* Navigation Links */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest py-2"
              >
                {t('common.home')}
              </Link>

              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-amber-600 hover:text-amber-700 transition-all font-black text-sm uppercase tracking-widest py-2"
                >
                  Admin Dashboard
                </Link>
              ) : isDoctor ? (
                <Link
                  to="/doctor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 hover:text-blue-700 transition-all font-black text-sm uppercase tracking-widest py-2"
                >
                  Practice Hub
                </Link>
              ) : (
                <Link
                  to="/doctors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest py-2"
                >
                  {t('common.doctors')}
                </Link>
              )}

              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest py-2"
              >
                {t('common.help')}
              </Link>

              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-600 hover:text-medical-primary transition-all font-bold text-sm uppercase tracking-widest py-2"
                >
                  {t('common.profile')}
                </Link>
              )}

              {/* Language Selector */}
              <div className="pt-4 border-t border-slate-200">
                <LanguageSelect />
              </div>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    {t('common.logout')}
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center border border-medical-primary text-medical-primary text-sm font-black uppercase tracking-widest rounded-lg hover:bg-medical-primary hover:text-white transition-all"
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full btn-primary py-3 px-4 text-center rounded-lg text-sm font-black uppercase tracking-widest shadow-lg"
                    >
                      {t('common.signup')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
