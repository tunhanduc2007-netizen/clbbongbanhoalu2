
import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    // Mock Data (Vì chưa kết nối DB thật)
    const [stats, setStats] = useState({
        totalIncome: 15400000,
        totalExpense: 8200000,
        balance: 7200000
    });

    const [transactions, setTransactions] = useState([
        { id: 1, type: 'THU', category: 'Phí hội viên', amount: 500000, desc: 'Nguyen Van A dong quy thang 1', date: '2026-01-01', status: 'DA_DUYET', proof: 'img1.jpg' },
        { id: 2, type: 'CHI', category: 'Mua dụng cụ', amount: 1200000, desc: 'Mua 2 hop bong + luoi', date: '2026-01-02', status: 'CHO_DUYET', proof: 'img2.jpg' },
        { id: 3, type: 'THU', category: 'Ban ao CLB', amount: 300000, desc: 'Ban 1 ao size L', date: '2026-01-03', status: 'DA_DUYET', proof: 'img3.jpg' },
    ]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Admin Header */}
            <header className="bg-[#2c3e50] text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-[#f1c40f]" />
                        <h1 className="font-bold text-lg">Hệ Thống Quản Lý Tài Chính CLB</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span>Xin chào, <strong>Admin</strong></span>
                        <button className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">Đăng xuất</button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6 max-w-7xl">
                {/* 1. Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Tổng Thu (Tháng này)</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalIncome.toLocaleString()}đ</h3>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Tổng Chi (Tháng này)</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalExpense.toLocaleString()}đ</h3>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg text-red-600">
                                <TrendingDown size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#4E9F3D]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Quỹ Tồn Dư</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.balance.toLocaleString()}đ</h3>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-[#4E9F3D]">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Actions & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} /> Nhật Ký Giao Dịch
                    </h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 shadow-md transition-colors">
                            <Plus size={16} /> Thêm Khoản Thu
                        </button>
                        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 shadow-md transition-colors">
                            <Plus size={16} /> Lập Phiếu Chi
                        </button>
                    </div>
                </div>

                {/* 3. Transaction Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b">ID</th>
                                    <th className="p-4 border-b">Loại</th>
                                    <th className="p-4 border-b">Danh Mục</th>
                                    <th className="p-4 border-b">Nội Dung</th>
                                    <th className="p-4 border-b text-right">Số Tiền</th>
                                    <th className="p-4 border-b text-center">Minh Chứng</th>
                                    <th className="p-4 border-b text-center">Trạng Thái</th>
                                    <th className="p-4 border-b text-right">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-500 font-mono text-xs">#{t.id}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'THU' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">{t.category}</td>
                                        <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{t.desc}</td>
                                        <td className={`p-4 text-right font-bold ${t.type === 'THU' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'THU' ? '+' : '-'}{t.amount.toLocaleString()}đ
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-blue-500 hover:underline text-xs flex items-center justify-center gap-1 mx-auto">
                                                <FileText size={12} /> Xem ảnh
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'DA_DUYET' ? 'bg-green-100 text-green-700' :
                                                    t.status === 'CHO_DUYET' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {t.status === 'DA_DUYET' ? 'Đã duyệt' : 'Chờ duyệt'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-gray-400 hover:text-[#4E9F3D] mx-1">Sửa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex gap-2 items-start bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 text-sm">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <strong>Lưu ý quan trọng:</strong>
                        <p>Hệ thống đang chạy chế độ demo Frontend. Để kích hoạt đầy đủ chức năng Backend (Lưu trữ, Upload ảnh, Audit Log), vui lòng cài đặt MySQL Server và chạy file <code>server/index.js</code>.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
