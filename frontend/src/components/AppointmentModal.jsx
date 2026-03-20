import React, { useState } from 'react';
import { IMAGE_BASE_URL } from '@services/api';
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
            <div className="w-full max-w-2xl relative group">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-medical-primary/20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-medical-secondary/20 blur-3xl animate-pulse"></div>

                <div className="relative glass-card overflow-hidden bg-white/80 backdrop-blur-3xl border-2 border-white/80 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                    {/* Ultra-Compact Header */}
                    <div className="px-5 py-4 border-b border-white/40 flex items-center justify-between bg-white/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                                <img
                                    src={doctor.image?.startsWith('http') ? doctor.image : `${IMAGE_BASE_URL}${doctor.image || ''}`}
                                    className="w-full h-full object-cover"
                                    alt={doctor.name}
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">{t('appointment.title')}</h2>
                                <p className="text-medical-primary text-[9px] font-black uppercase tracking-widest mt-1">{doctor.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/40 p-1.5 rounded-lg hover:bg-white/80 hover:scale-110 active:scale-95 transition-all shadow-sm group/close"
                        >
                            <svg className="w-4 h-4 text-slate-500 group-hover/close:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Left Column: Essential Details */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="bg-white/30 px-4 py-3 rounded-xl border border-white flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fee</span>
                                            <span className="text-base font-black text-slate-800">₹{doctor.consultationFee || 500}</span>
                                        </div>
                                        <div className="w-px h-6 bg-slate-200/50 mx-2"></div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                            <span className="text-base font-black text-slate-800">30m-45m</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/30 px-4 py-3 rounded-xl border border-white">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Specialization</span>
                                        <span className="text-sm font-black text-medical-primary">{doctor.specialization}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/30">
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                        "Secure your health with expert advice."
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Slot Selection */}
                            <div className="space-y-3">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Available Slots</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`group relative overflow-hidden py-2.5 rounded-xl border-2 transition-all duration-300 active:scale-95 ${selectedTime === time
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                                : 'bg-white/40 border-white/60 text-slate-600 hover:border-medical-primary/50'
                                                }`}
                                        >
                                            <span className="relative z-10 text-[10px] font-black">{time}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer - Integrated and Shorter */}
                        <div className="mt-8 pt-6 border-t border-white/40">
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedTime || isSubmitting}
                                className="w-full relative group/btn overflow-hidden bg-medical-primary py-3.5 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-medical-primary to-medical-secondary"></div>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative flex items-center justify-center gap-2 text-white font-black text-[11px] uppercase tracking-[0.2em]">
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Confirm & Pay <span className="text-base">→</span></>
                                    )}
                                </span>
                            </button>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Secure Razorpay Checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
