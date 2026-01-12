import React, { useState } from 'react';
import { useLanguage } from '@context/LanguageContext';

const AppointmentModal = ({ doctor, onClose, onConfirm }) => {
    const { t } = useLanguage();
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg relative group">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-medical-primary/20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-medical-secondary/20 blur-3xl animate-pulse"></div>

                <div className="relative glass-card overflow-hidden bg-white/60 backdrop-blur-3xl border-2 border-white/80 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                    {/* Header with Mini Profile */}
                    <div className="p-8 pb-0 flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden border-2 border-white shadow-lg">
                                <img
                                    src={doctor.image?.startsWith('http') ? doctor.image : `http://localhost:3000${doctor.image || ''}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{t('appointment.title')}</h2>
                                <p className="text-medical-primary text-xs font-black uppercase tracking-widest mt-1 opacity-80">{doctor.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/40 p-2 rounded-2xl hover:bg-white/80 hover:scale-110 active:scale-95 transition-all shadow-sm group/close"
                        >
                            <svg className="w-5 h-5 text-slate-500 group-hover/close:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Highlights Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/40 p-4 rounded-[1.5rem] border border-white space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation</span>
                                <div className="text-lg font-black text-slate-800 tracking-tight">₹{doctor.consultationFee || 500}</div>
                            </div>
                            <div className="bg-white/40 p-4 rounded-[1.5rem] border border-white space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                <div className="text-lg font-black text-slate-800 tracking-tight">30-45 Mins</div>
                            </div>
                        </div>

                        {/* Slot Selection */}
                        <div className="space-y-4">
                            <h4 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Available Time Slots</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`group relative overflow-hidden py-4 rounded-2xl border-2 transition-all duration-300 active:scale-90 ${selectedTime === time
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-2xl'
                                                : 'bg-white/50 border-white text-slate-600 hover:border-medical-primary/50'
                                            }`}
                                    >
                                        <span className="relative z-10 text-[11px] font-black">{time}</span>
                                        {selectedTime === time && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-medical-primary to-medical-secondary opacity-30 blur-xl animate-pulse"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-4 flex flex-col items-center gap-4">
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedTime || isSubmitting}
                                className="w-full relative group/btn overflow-hidden bg-medical-primary py-5 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,123,255,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,123,255,0.4)] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-medical-primary to-medical-secondary"></div>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 backdrop-blur-md"></div>
                                <span className="relative flex items-center justify-center gap-3 text-white font-black text-sm uppercase tracking-[0.2em]">
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Proceed To Payment <span className="text-lg">→</span></>
                                    )}
                                </span>
                            </button>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Secure checkout with Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
