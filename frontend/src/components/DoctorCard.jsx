import React from 'react';
import { useLanguage } from '@context/LanguageContext';

const DoctorCard = ({ doctor, onBook }) => {
    const { t } = useLanguage();

    return (
        <div className="group relative w-full">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-medical-primary/40 to-medical-secondary/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>

            <div className="relative glass-card overflow-hidden border border-white/60 bg-white/30 backdrop-blur-2xl transition-all duration-300 hover:border-medical-primary/30 rounded-[2rem] shadow-sm hover:shadow-xl">
                <div className="flex flex-col sm:flex-row p-6 gap-6 items-center sm:items-stretch">

                    {/* Compact Image Holder */}
                    <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                        <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-white shadow-md">
                            <img
                                src={doctor.image?.startsWith('http') ? doctor.image : `http://localhost:3000${doctor.image || ''}`}
                                alt={doctor.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        {/* Compact Rating */}
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-xl px-2 py-1 shadow-md border border-slate-50 flex items-center space-x-1">
                            <span className="text-amber-400 text-[10px]">★</span>
                            <span className="text-xs font-black text-slate-800">{doctor.rating}</span>
                        </div>
                    </div>

                    {/* Middle Content Section */}
                    <div className="flex-1 min-w-0 py-1 space-y-2 text-center sm:text-left w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3 className="text-xl font-black text-slate-800 truncate group-hover:text-medical-primary transition-colors tracking-tight">
                                {doctor.name}
                            </h3>
                            <span className="text-medical-primary font-black text-[9px] uppercase tracking-[0.15em] px-2 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                                {doctor.specialization}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 rounded-xl border border-white/20">
                                <span className="text-xs">💼</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{doctor.experience}+ Yrs</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 rounded-xl border border-white/20">
                                <span className="text-xs">💬</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{doctor.languages?.[0] || 'English'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Action Section */}
                    <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto sm:pl-6 sm:border-l border-slate-100/50">
                        <div className="text-center sm:text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Consultation</p>
                            <p className="text-xl font-black text-slate-800 tracking-tighter">₹{doctor.consultationFee || 500}</p>
                        </div>

                        <button
                            onClick={() => onBook(doctor)}
                            className="bg-slate-900 px-6 py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all group/btn relative overflow-hidden flex items-center justify-center min-w-[120px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-medical-primary to-medical-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            <span className="relative text-white font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                                Book Now
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
