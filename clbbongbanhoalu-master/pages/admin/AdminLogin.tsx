
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://${window.location.hostname}:3001/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu thông tin user vào localStorage (đơn giản hóa)
                localStorage.setItem('adminUser', JSON.stringify(data));
                navigate('/admin'); // Chuyển hướng vào Dashboard
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối Server!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2c3e50] to-[#34495e] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-[#7AC943] p-6 text-center">
                    <SEO title="Đăng Nhập Admin" description="Trang đăng nhập dành cho quản trị viên CLB Bóng Bàn Hoa Lư." />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <ShieldCheck size={32} className="text-[#4E9F3D]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Quản Lý CLB Hoa Lư</h1>
                    <p className="text-white/80 text-sm">Đăng nhập hệ thống tài chính</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Tài khoản</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Nhập username (vd: admin)"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7AC943] focus:ring-2 focus:ring-[#7AC943]/20 outline-none transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7AC943] focus:ring-2 focus:ring-[#7AC943]/20 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2c3e50] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#34495e] transition-all flex items-center justify-center gap-2 group"
                    >
                        Đăng Nhập <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                    &copy; 2026 Admin System v1.0
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
