import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { IMAGE_BASE_URL } from '@services/api';
import { useAuth } from '@context/AuthContext';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { appointment } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('razorpay');
    const [razorpayKeyId, setRazorpayKeyId] = useState('');

    useEffect(() => {
        if (!appointment) navigate('/doctors');

        // Fetch Razorpay Config
        const fetchConfig = async () => {
            try {
                const res = await api.get('/payments/config');
                setRazorpayKeyId(res.data.razorpayKeyId);
            } catch (err) {
                console.error("Failed to load payment config");
            }
        };
        fetchConfig();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (existingScript) document.body.removeChild(existingScript);
        };
    }, [appointment]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const orderRes = await api.post('/payments/create-order', {
                appointmentId: appointment.id
            });

            const order = orderRes.data;

            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: "RxExplain AI",
                description: `Consultation with ${appointment.doctorId?.name}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            appointmentId: appointment.id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful!");
                            navigate('/profile');
                        }
                    } catch (err) {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#007BFF" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setLoading(false);

        } catch (error) {
            console.error(error);
            alert("Payment initialization failed. Ensure RAZORPAY_KEY_ID is in .env");
            setLoading(false);
        }
    };

    if (!appointment) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Simple Step Indicator */}
            <div className="bg-white/40 border-b border-white/60 p-6 mb-12 backdrop-blur-md sticky top-[80px] z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">✓</div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Doctor</span>
                    </div>
                    <div className="w-12 h-px bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-medical-primary text-white text-[10px] flex items-center justify-center font-black">2</div>
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Secure Payment</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Main Content */}
                <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-left duration-700">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Complete Checkout</h1>
                        <p className="text-slate-500 font-medium">Finalize your consultation with {appointment.doctorId?.name}</p>
                    </div>

                    <div className="glass-card overflow-hidden bg-white/40 border-2 border-white/80 rounded-[3rem] shadow-2xl">
                        <div className="p-8 border-b border-slate-100/50">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6">Payment Method</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'razorpay', label: 'Cards / UPI', icon: '💳', highlight: 'Fast' },
                                    { id: 'netbanking', label: 'Net Banking', icon: '🏦', highlight: null }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`relative group p-6 rounded-[2rem] border-2 transition-all duration-300 text-left ${selectedMethod === method.id
                                            ? 'bg-slate-900 border-slate-900 shadow-[0_20px_40px_rgba(0,0,0,0.1)]'
                                            : 'bg-white/40 border-white hover:border-medical-primary/30'
                                            }`}
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-3xl">{method.icon}</span>
                                                {method.highlight && (
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${selectedMethod === method.id ? 'bg-medical-primary text-white' : 'bg-medical-primary/10 text-medical-primary'
                                                        }`}>
                                                        {method.highlight}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black uppercase tracking-widest ${selectedMethod === method.id ? 'text-white' : 'text-slate-800'}`}>
                                                    {method.label}
                                                </p>
                                                <p className={`text-[10px] mt-1 font-medium ${selectedMethod === method.id ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Secure one-tap checkout
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-slate-900/5 backdrop-blur-sm">
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full relative group/btn overflow-hidden bg-medical-primary p-6 rounded-3xl shadow-xl active:scale-[0.98] transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-medical-primary to-medical-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                <span className="relative text-white font-black text-lg uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                                    {loading ? 'Processing...' : 'Complete Payment →'}
                                </span>
                            </button>
                            <div className="flex items-center justify-center gap-3 mt-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secured by</span>
                                <div className="w-20 h-5 bg-white/80 rounded-lg p-1 flex items-center justify-center border border-slate-100">
                                    <span className="text-[10px] font-black text-blue-600">Razorpay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-right duration-700">
                    <div className="glass-card bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/20 blur-3xl group-hover:bg-medical-primary/30 transition-colors"></div>

                        <h3 className="text-white text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-medical-primary"></span>
                            Booking Details
                        </h3>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                    <img
                                        src={appointment.doctorId?.image?.startsWith('http') ? appointment.doctorId?.image : `${IMAGE_BASE_URL}${appointment.doctorId?.image || ''}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-black text-sm tracking-tight">{appointment.doctorId?.name}</p>
                                    <p className="text-medical-primary text-[10px] font-black uppercase tracking-widest">{appointment.doctorId?.specialization}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-white text-xs font-black">{appointment.date}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-white text-xs font-black">{appointment.time}</p>
                                </div>
                            </div>

                            <div className="pt-6 space-y-4 border-t border-white/10">
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>Consultation Fee</span>
                                    <span className="text-white">₹{appointment.amount}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>Platform Fee</span>
                                    <span className="text-white">₹49</span>
                                </div>
                                <div className="pt-4 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-medical-primary uppercase tracking-widest">Total Payable</p>
                                        <p className="text-3xl font-black text-white leading-none mt-1 transition-all group-hover:scale-110 origin-left">₹{appointment.amount + 49}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                                        📄
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10">
                        <div className="flex gap-4 items-start">
                            <span className="text-xl">🛡️</span>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Appointment Protection</p>
                                <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                                    Get full refund if the doctor cancels or the consultation is not completed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
