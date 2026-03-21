import React, { useState, useEffect } from 'react';
import { IMAGE_BASE_URL } from '@services/api';
import { useLanguage } from '@context/LanguageContext';

const AppointmentModal = ({ doctor, onClose, onConfirm }) => {
    const { t } = useLanguage();
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bulletproof Background Scroll Lock
    useEffect(() => {
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, []);

    const timeSlots = [
        '09:00 AM', '10:30 AM', '11:45 AM',
        '02:00 PM', '03:30 PM', '05:00 PM'
    ];

    const handleConfirm = async () => {
        if (!selectedTime) return;
        setIsSubmitting(true);
        try {
            await onConfirm(doctor.id, selectedTime);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-xl relative group">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-medical-primary/20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-medical-secondary/20 blur-3xl animate-pulse"></div>

                <div className="relative glass-card bg-white dark:bg-neutral-900 border-2 border-slate-100 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden transition-colors">
                    {/* Compact Header */}
                    <div className="px-3 py-2 bg-slate-50 dark:bg-neutral-800 border-b border-slate-100 dark:border-neutral-700 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-medical-primary flex items-center justify-center text-white text-[10px] font-bold">Rx</div>
                            <h2 className="text-sm font-black text-slate-800 dark:text-neutral-100 uppercase tracking-tight transition-colors">{t('appointment.title')}</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-400 dark:text-neutral-500 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            {/* Left: Tighter Details */}
                            <div className="md:col-span-2 space-y-1.5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-700 flex-shrink-0 transition-colors">
                                        <img
                                            src={doctor.image?.startsWith('http') ? doctor.image : `${IMAGE_BASE_URL}${doctor.image || ''}`}
                                            className="w-full h-full object-cover"
                                            alt={doctor.name}
                                        />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-[10px] font-black text-slate-800 dark:text-neutral-100 leading-none truncate transition-colors">{doctor.name}</p>
                                        <p className="text-[8px] font-bold text-medical-primary uppercase mt-0.5 truncate transition-colors">{doctor.specialization}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 dark:bg-neutral-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-neutral-700 grid grid-cols-2 gap-2 transition-colors">
                                    <div>
                                        <span className="block text-[7px] font-black text-slate-400 dark:text-neutral-500 uppercase transition-colors">Fee</span>
                                        <span className="text-xs font-black text-slate-800 dark:text-neutral-100 transition-colors">₹{doctor.consultationFee || 500}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[7px] font-black text-slate-400 dark:text-neutral-500 uppercase text-right transition-colors">Dur</span>
                                        <span className="text-xs font-black text-slate-800 dark:text-neutral-100 block text-right transition-colors">45m</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Slots & Confirm */}
                            <div className="md:col-span-3 space-y-2">
                                <div className="grid grid-cols-3 gap-1">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-1 rounded-md border transition-colors text-[9px] font-black ${selectedTime === time
                                                ? 'bg-slate-900 dark:bg-neutral-100 border-slate-900 dark:border-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                                                : 'bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:border-medical-primary/30 dark:hover:border-medical-primary/50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedTime || isSubmitting}
                                    className="w-full bg-medical-primary py-2 rounded-lg shadow-md hover:bg-medical-secondary active:scale-[0.98] disabled:opacity-50 transition-colors font-black text-white text-[9px] uppercase tracking-widest"
                                >
                                    {isSubmitting ? "..." : <>{t('appointment.proceed')} ➜</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
