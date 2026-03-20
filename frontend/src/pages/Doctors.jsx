import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';
import AppointmentModal from '@components/AppointmentModal';
import DoctorCard from '@components/DoctorCard';
import api from '@services/api';

const Doctors = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('All');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const specializations = ['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Neurologist', 'Dermatologist'];

    useEffect(() => {
        fetchDoctors();
    }, [searchQuery, selectedSpecialization]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchQuery,
                specialization: selectedSpecialization === 'All' ? undefined : selectedSpecialization
            };
            const response = await api.get('/doctors', { params });
            setDoctors(response.data);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = (doctor) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedDoctor(doctor);
    };

    const confirmAppointment = async (doctorId, time) => {
        try {
            // Step 1: Create the appointment (initially pending)
            const response = await api.post('/appointments', {
                doctorId,
                date: new Date().toISOString().split('T')[0], // Simplified for now
                time
            });

            const newAppt = response.data.appointment;

            // Step 2: Navigate to Payment Page
            navigate('/payment', { state: { appointment: newAppt } });
        } catch (error) {
            alert(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">{t('doctors.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed transition-colors">
                    Connect with top-rated medical professionals specialized in various fields.
                </p>
            </div>

            {/* Filter Section */}
            <div className="glass-card p-6 border-white/40 dark:border-white/5 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl space-y-6 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t('doctors.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-medical-primary/10 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-200"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {specializations.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpecialization(spec)}
                                className={`px-5 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${selectedSpecialization === spec
                                    ? 'bg-medical-primary text-white border-medical-primary shadow-lg ring-4 ring-medical-primary/10'
                                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-white dark:border-white/5 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Doctors Grid */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-96 glass-card animate-pulse bg-white/30 dark:bg-slate-900/40 rounded-[2.5rem] border-white/40 dark:border-white/5"></div>
                    ))}
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-20 glass-card bg-white/20 dark:bg-slate-900/40 rounded-[2.5rem] border-white/40 dark:border-white/5">
                    <p className="text-2xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('doctors.noResults')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onBook={() => handleBookAppointment(doctor)}
                        />
                    ))}
                </div>
            )}

            {selectedDoctor && (
                <AppointmentModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    onConfirm={confirmAppointment}
                />
            )}
        </div>
    );
};

export default Doctors;
