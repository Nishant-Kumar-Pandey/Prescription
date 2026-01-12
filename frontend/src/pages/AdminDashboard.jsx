import { useState, useEffect } from 'react';
import api from '@services/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stats')
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'banned' : 'active';
            await api.patch(`/admin/users/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            alert("Action failed");
        }
    };

    const fireUser = async (id) => {
        if (!window.confirm("Are you sure you want to permanently remove this staff member?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchData();
        } catch (error) {
            alert("Action failed");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Administration</h1>
                <p className="text-slate-500 font-medium">Hospital network control center</p>
            </div>

            {/* Global Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Users', value: stats.totalUsers, color: 'blue' },
                        { label: 'Doctors', value: stats.totalDoctors, color: 'indigo' },
                        { label: 'Appointments', value: stats.totalAppointments, color: 'emerald' },
                        { label: 'Revenue', value: `₹${stats.revenue}`, color: 'amber' }
                    ].map((stat, i) => (
                        <div key={i} className={`glass-card p-6 bg-${stat.color}-500/10 border-${stat.color}-200/50 rounded-3xl shadow-lg border-white/20`}>
                            <p className={`text-xs font-black text-${stat.color}-600 uppercase tracking-widest mb-1`}>{stat.label}</p>
                            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Staff & User Management */}
            <div className="glass-card overflow-hidden border-white/40 bg-white/20 backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
                <div className="p-8 border-b border-white/20 bg-white/30 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-slate-800">User Management</h2>
                    <div className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">
                        {users.length} Records Found
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center text-slate-400 font-bold">Syncing encrypted data...</div>
                    ) : (
                        <table className="w-full text-left font-medium">
                            <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Identity</th>
                                    <th className="px-8 py-4">Role</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Administrative Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/20">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{u.name}</span>
                                                <span className="text-xs text-slate-500 font-bold">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-amber-100 text-amber-600' :
                                                    u.role === 'doctor' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleBan(u._id, u.status)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${u.status === 'active' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                        }`}
                                                >
                                                    {u.status === 'active' ? 'Ban Access' : 'Restore'}
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => fireUser(u._id)}
                                                        className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 shadow-md active:scale-95 transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
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

export default AdminDashboard;
