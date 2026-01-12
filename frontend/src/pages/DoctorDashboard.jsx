import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);

            const total = response.data.length;
            const pending = response.data.filter(a => a.status === 'scheduled').length;
            const completed = response.data.filter(a => a.status === 'completed').length;

            setStats({ total, pending, completed });
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            fetchAppointments();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Doctor Dashboard</h1>
                    <p className="text-slate-500 font-medium">Manage your patients and schedule</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card px-6 py-3 border-white/40 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Patients</p>
                        <p className="text-2xl font-black text-medical-primary">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 bg-blue-500/10 border-blue-200/50 rounded-3xl">
                    <p className="text-sm font-bold text-blue-600 mb-2">Pending Appointments</p>
                    <p className="text-3xl font-black text-blue-800">{stats.pending}</p>
                </div>
                <div className="glass-card p-6 bg-emerald-500/10 border-emerald-200/50 rounded-3xl">
                    <p className="text-sm font-bold text-emerald-600 mb-2">Completed Visits</p>
                    <p className="text-3xl font-black text-emerald-800">{stats.completed}</p>
                </div>
                <div className="glass-card p-6 bg-purple-500/10 border-purple-200/50 rounded-3xl">
                    <p className="text-sm font-bold text-purple-600 mb-2">Daily Limit Usage</p>
                    <p className="text-2xl font-black text-purple-800">{stats.pending} / 10</p>
                </div>
            </div>

            {/* Appointment List */}
            <div className="glass-card overflow-hidden border-white/40 bg-white/20 backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
                <div className="p-8 border-b border-white/20 bg-white/30">
                    <h2 className="text-2xl font-black text-slate-800">Your Appointments</h2>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center text-slate-400 font-bold">Loading schedule...</div>
                    ) : appointments.length === 0 ? (
                        <div className="p-20 text-center text-slate-400 font-bold">No appointments found.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Patient</th>
                                    <th className="px-8 py-4">Date & Time</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/20">
                                {appointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-white/40 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-medical-primary/20 flex items-center justify-center font-bold text-medical-primary">
                                                    {appt.userId?.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{appt.userId?.name}</p>
                                                    <p className="text-xs text-slate-500">{appt.userId?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-700">{appt.date}</p>
                                            <p className="text-sm text-slate-500">{appt.time}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${appt.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                                                    appt.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {appt.status === 'scheduled' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => updateStatus(appt.id, 'completed')}
                                                        className="px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl hover:bg-emerald-600 shadow-md active:scale-95 transition-all"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(appt.id, 'canceled')}
                                                        className="px-4 py-2 bg-red-500 text-white text-xs font-black rounded-xl hover:bg-red-600 shadow-md active:scale-95 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
