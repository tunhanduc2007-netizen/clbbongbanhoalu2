import React, { useState, useEffect, useRef } from 'react';
import {
    Wallet, LogOut, TrendingUp, FileSpreadsheet, FileText, LayoutDashboard, Coffee, Circle,
    Trash2, Search, LogIn, PlusCircle, ChevronDown,
    AlertTriangle, CheckCircle, X as CloseIcon, Calendar, Users
} from 'lucide-react';
import SEO from '../components/SEO';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

import { supabase } from '../supabaseClient';

export default function Admin() {
    // --- AUTH & STATE ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ income: 0 });
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState([]);

    // --- TABLE MANAGER STATE ---
    const [tables, setTables] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<any>(null);
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // UI Effects
    const [toasts, setToasts] = useState<any[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteTargetTable, setDeleteTargetTable] = useState('transactions');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [timeRange, setTimeRange] = useState('year');
    const [searchTerm, setSearchTerm] = useState('');

    // --- LỊCH TẬP STATE ---
    const [activeTab, setActiveTab] = useState('finance');
    const [coaches, setCoaches] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    // Form Lịch tập
    const [coachName, setCoachName] = useState('');
    const [coachLevel, setCoachLevel] = useState('HLV Cơ bản');
    const [coachFee, setCoachFee] = useState('');
    const [coachTableFee, setCoachTableFee] = useState('');
    const [sessCoachId, setSessCoachId] = useState('');
    const [sessDay, setSessDay] = useState('Monday');
    const [sessStart, setSessStart] = useState('');
    const [sessEnd, setSessEnd] = useState('');
    const [sessLoc, setSessLoc] = useState('');

    // Form Tài chính (Restore missing states)
    const [amount, setAmount] = useState('');
    const [catId, setCatId] = useState('');
    const [desc, setDesc] = useState('');
    const [equipment, setEquipment] = useState('');
    const [date, setDate] = useState(() => {
        const d = new Date();
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });

    // Chart Ref
    const chartRef = useRef<any>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
            initDashboard();
        } else {
            setLoading(false);
        }

        // --- REALTIME CHANNELS ---
        const channelTrans = supabase.channel('realtime_transactions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
                fetchStats(); fetchRecords();
            }).subscribe();

        const channelTables = supabase.channel('realtime_tables')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'table_manager' }, () => {
                fetchTableData();
            }).subscribe();

        return () => {
            supabase.removeChannel(channelTrans);
            supabase.removeChannel(channelTables);
        };
    }, [timeRange]);

    const initDashboard = async () => {
        try {
            await Promise.all([
                fetchStats(),
                fetchCategories(),
                fetchRecords(),
                fetchRecords(),
                fetchScheduleData(),
                fetchTableData()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchScheduleData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([
                supabase.from('coaches').select('*'),
                supabase.from('training_sessions').select('*')
            ]);

            if (cRes.data) setCoaches(cRes.data);

            if (sRes.error) console.error("Lỗi Supabase (Sessions):", sRes.error);
            if (sRes.data) {
                console.log("Dữ liệu Sessions tải về:", sRes.data);
                setSessions(sRes.data);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu lịch tập:", err);
        }
    };

    // --- HELPER: DATE RANGE ---
    const calculateDateRange = (range: string) => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        let start = new Date(y, m, 1);
        let end = new Date(y, m + 1, 0);

        if (range === 'today') {
            start = now; end = now;
        } else if (range === 'day') { // Fallback
            start = now; end = now;
        } else if (range === 'week') {
            const day = now.getDay() || 7;
            start = new Date(now);
            if (day !== 1) start.setHours(-24 * (day - 1));
            end = new Date(start);
            end.setDate(end.getDate() + 6);
        } else if (range === 'month') {
            start = new Date(y, m, 1);
            end = new Date(y, m + 1, 0);
        } else if (range === 'year') {
            start = new Date(y, 0, 1);
            end = new Date(y, 11, 31);
        }

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    };

    // --- DATA FETCHING ---
    const fetchStats = async () => {
        const { start, end } = calculateDateRange(timeRange);
        const { data, error } = await supabase
            .from('transactions')
            .select('amount, categories!inner(type)')
            .eq('is_active', true)
            .eq('status', 'APPROVED')
            .eq('categories.type', 'income')
            .gte('transaction_date', `${start} 00:00:00`)
            .lte('transaction_date', `${end} 23:59:59`);

        if (error) {
            console.error(error);
            return;
        }

        const total = data.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
        setStats({ income: total });
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('type', 'income');

        if (error) console.error(error);
        else setCategories(data || []);
    };

    const fetchRecords = async () => {
        const { start, end } = calculateDateRange(timeRange);
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                                *,
                                categories (name),
                                users (full_name)
                                `)
            .eq('is_active', true)
            .gte('transaction_date', `${start} 00:00:00`)
            .lte('transaction_date', `${end} 23:59:59`)
            .order('transaction_date', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        const formattedRows = data.map((r: any) => ({
            ...r,
            category_name: r.categories?.name,
            creator_name: r.users?.full_name
        }));

        setRecords(formattedRows);
        updateChart(formattedRows);
    };

    // --- LOGIC: CHART ---
    const updateChart = async (trans: any) => {
        // Simple client-side grouping for chart
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData: any = {};

        trans.forEach((r: any) => {
            const date = new Date(r.transaction_date);
            const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
            monthlyData[key] = (monthlyData[key] || 0) + Number(r.amount);
        });

        const labels = Object.keys(monthlyData).reverse().slice(0, 6).reverse();
        const values = labels.map(l => monthlyData[l]);

        if (chartInstance.current) chartInstance.current.destroy();
        const ctx = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh Thu',
                    data: values,
                    backgroundColor: '#7AC943',
                    borderRadius: 8,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: { label: (ctx: any) => `Doanh thu: ${ctx.raw.toLocaleString()} đ` }
                    }
                },
                scales: {
                    y: { grid: { display: true, color: 'rgba(0,0,0,0.03)' }, ticks: { callback: (v) => v.toLocaleString() + ' đ' } },
                    x: { grid: { display: false } }
                }
            }
        });
    };

    // --- ACTIONS ---
    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catId) return addToast("Vui lòng chọn hạng mục", "warning");

        setIsSubmitting(true);
        let finalAmount = parseFloat(amount.replace(/,/g, ''));
        if (finalAmount > 0 && finalAmount < 10000) finalAmount *= 1000;

        try {
            const { error } = await supabase.from('transactions').insert([{
                category_id: catId,
                amount: finalAmount,
                description: desc,
                equipment_name: equipment,
                transaction_date: date,
                created_by: user.id
            }]);

            if (!error) {
                addToast("Thêm giao dịch thành công!", "success");
                setAmount(''); setDesc(''); setEquipment(''); setCatId('');
                initDashboard();
            } else throw error;
        } catch (err) {
            addToast("Lỗi khi lưu dữ liệu", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTargetId) return;

        let error = null;

        if (deleteTargetTable === 'transactions') {
            const res = await supabase.from('transactions').update({ is_active: false }).eq('id', deleteTargetId);
            error = res.error;
        } else {
            const res = await supabase.from(deleteTargetTable).delete().eq('id', deleteTargetId);
            error = res.error;
        }

        if (!error) {
            setShowDeleteModal(false);
            addToast("Đã xóa thành công!", "success");
            if (deleteTargetTable === 'transactions') initDashboard();
            else fetchScheduleData();
        } else {
            console.error(error);
            addToast("Lỗi khi xóa: " + error.message, "error");
        }
    };

    const handleAddCoach = async (e: React.FormEvent) => {
        e.preventDefault();
        const colors = ['#4E9F3D', '#7AC943', '#1e293b', '#2D5A27', '#FFD800'];
        const newCoach = {
            name: coachName,
            level: coachLevel,
            tuition_fee: coachFee || '300.000đ/buổi',
            table_fee: coachTableFee || '50.000đ/giờ',
            color: colors[coaches.length % colors.length]
        };

        const { error } = await supabase.from('coaches').insert([newCoach]);
        if (!error) {
            addToast("Thêm HLV thành công!", "success");
            setCoachName('');
            fetchScheduleData();
        } else {
            console.error("Lỗi thêm HLV:", error);
            addToast("Lỗi: " + error.message + " (Check Console F12)", "error");
        }
    };

    const handleAddSession = async (e: React.FormEvent) => {
        e.preventDefault();
        const conflict = sessions.some(s => {
            if (s.day !== sessDay) return false;
            const overlap = (sessStart < s.end_time && sessEnd > s.start_time);
            return overlap && (s.coach_id === sessCoachId || s.location === sessLoc);
        });

        if (conflict) {
            addToast("Bị trùng lịch với HLV hoặc Bàn đã có!", "error");
            return;
        }

        const newSess = {
            coach_id: sessCoachId,
            day: sessDay,
            start_time: sessStart,
            end_time: sessEnd,
            location: sessLoc
        };

        const { error } = await supabase.from('training_sessions').insert([newSess]);
        if (!error) {
            addToast("Đã xếp lịch thành công!", "success");
            setSessLoc(''); setSessStart(''); setSessEnd('');
            fetchScheduleData();
        } else {
            addToast("Lỗi khi xếp lịch", "error");
            console.error(error);
        }
    };

    const deleteTableItem = (table: string, id: any) => {
        setDeleteTargetTable(table);
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const exportExcel = () => {
        // Chuẩn bị dữ liệu tiêu đề và nội dung
        const titleRow = [["BÁO CÁO TÀI CHÍNH - CLB BÓNG BÀN HOA LƯ"]];
        const dateExport = [[`Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`]];
        const header = ["NGÀY", "HẠNG MỤC", "DỤNG CỤ", "HỌ VÀ TÊN", "NGƯỜI TẠO", "SỐ TIỀN", "TRẠNG THÁI"];

        const data = records.map((r: any) => [
            new Date(r.transaction_date).toLocaleDateString('vi-VN'),
            r.category_name,
            r.equipment_name || "-",
            r.description || "-",
            r.creator_name,
            Number(r.amount),
            r.status === 'APPROVED' ? 'Đã duyệt' : r.status
        ]);

        // Tạo Worksheet từ mảng 2 chiều
        const ws = XLSX.utils.aoa_to_sheet([]);

        // Thêm tiêu đề vào dòng 1
        XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "B1" });
        XLSX.utils.sheet_add_aoa(ws, dateExport, { origin: "B2" });

        // Thêm table header vào dòng 4
        XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A4" });

        // Thêm dữ liệu vào từ dòng 5
        XLSX.utils.sheet_add_aoa(ws, data, { origin: "A5" });

        // Thiết lập độ rộng cột để "căn đều và đẹp"
        const wscols = [
            { wch: 15 }, // Ngày
            { wch: 20 }, // Hạng mục
            { wch: 25 }, // Dụng cụ (New)
            { wch: 30 }, // Họ và tên (was Dụng cụ)
            { wch: 20 }, // Người tạo (was Họ và tên)
            { wch: 18 }, // Số tiền (was Người tạo)
            { wch: 15 }, // Trạng thái (was Số tiền)
        ];
        ws['!cols'] = wscols;

        // Thêm tính năng Lọc (Auto Filter) cho bảng dữ liệu
        const lastRow = 4 + data.length;
        ws['!autofilter'] = { ref: `A4:G${lastRow}` };

        // Tạo Workbook và tải xuống
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "BaoCao_TaiChinh");
        XLSX.writeFile(wb, `BaoCao_HoaLu_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const fetchTableData = async () => {
        const { data, error } = await supabase.from('table_manager').select('*').order('table_number', { ascending: true });
        if (error) {
            console.error("Error fetching tables:", error);
        }
        if (data) setTables(data);
    };

    const initTables = async () => {
        if (!confirm('Bạn có chắc muốn tạo mới 15 bàn?')) return;
        setLoading(true);
        const newTables = Array.from({ length: 15 }, (_, i) => ({
            table_number: i + 1,
            status: 'available',
            player_name: '',
            start_time: null,
            services: []
        }));

        const { error } = await supabase.from('table_manager').insert(newTables);
        if (error) {
            addToast("Lỗi khởi tạo: " + error.message, 'error');
        } else {
            addToast("Đã khởi tạo 15 bàn thành công!", 'success');
            fetchTableData();
        }
        setLoading(false);
    };

    // --- TABLE CALCULATIONS ---
    const getDuration = (startTime: string) => {
        if (!startTime) return 0;
        const start = new Date(startTime).getTime();
        const now = currentTime.getTime();
        return Math.max(0, (now - start) / 1000 / 3600); // hours
    };

    const calculateTableFee = (t: any) => {
        if (!t || t.status === 'available') return 0;
        // Bàn 10 trở đi tính tiền giờ (70k/h), Bàn dưới 10 tính tiền lượt (40k/session)
        if (t.table_number >= 10) {
            const hours = getDuration(t.start_time);
            return Math.floor(hours * 70000);
        }
        return 40000;
    };

    const calculateTotal = (t: any) => {
        if (!t || t.status === 'available') return 0;
        const serviceTotal = (t.services || []).reduce((sum: number, s: any) => sum + (s.price * s.qty), 0);
        return calculateTableFee(t) + serviceTotal;
    };

    const handleTableAction = async (action: 'start' | 'stop' | 'update_service', payload: any = null) => {
        if (!selectedTable) return;

        let updateData: any = {};

        if (action === 'start') {
            updateData = { status: 'occupied', start_time: new Date().toISOString(), player_name: payload, services: [] };
        }
        else if (action === 'stop') {
            // 1. Create Transaction
            const total = calculateTotal(selectedTable);
            await supabase.from('transactions').insert([{
                category_id: 1, // Assume 1 is 'Thu Tiền Bàn' or similar placeholder
                amount: total,
                description: `Tiền bàn ${selectedTable.table_number}: ${selectedTable.player_name}`,
                transaction_date: new Date().toISOString(),
                created_by: user.id,
                is_active: true
            }]);
            // 2. Reset Table
            updateData = { status: 'available', start_time: null, player_name: null, services: [] };
            addToast(`Đã thanh toán bàn ${selectedTable.table_number}: ${total.toLocaleString()}đ`, 'success');
        }
        else if (action === 'update_service') {
            const currentServices = selectedTable.services || [];
            const existingIdx = currentServices.findIndex((s: any) => s.item === payload.item);
            let newServices = JSON.parse(JSON.stringify(currentServices)); // Deep copy to avoid mutation issues
            const change = payload.qty !== undefined ? payload.qty : 1;

            if (existingIdx >= 0) {
                newServices[existingIdx].qty = (newServices[existingIdx].qty || 0) + change;
                if (newServices[existingIdx].qty <= 0) {
                    newServices.splice(existingIdx, 1);
                }
            } else if (change > 0) {
                newServices.push({ item: payload.item, price: payload.price, qty: change });
            }
            updateData = { services: newServices };
        }

        const { error } = await supabase.from('table_manager').update(updateData).eq('id', selectedTable.id);
        if (!error) {
            if (action === 'start') addToast('Đã bắt đầu tính giờ!', 'success');
            fetchTableData();
            // Update local selection to reflect changes immediately
            setSelectedTable({ ...selectedTable, ...updateData });
        }
    };
    // --- UTILS ---
    const addToast = (msg: string, type: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const getDateRange = (range: string) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();
        if (range === 'today') { /* now */ }
        else if (range === 'week') start.setDate(now.getDate() - now.getDay());
        else if (range === 'month') start.setDate(1);
        else if (range === 'year') start.setMonth(0, 1);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    };

    const formatCurrency = (val: string | number) => {
        if (!val) return "";
        const digits = val.toString().replace(/\D/g, "");
        if (!digits) return "";
        return new Intl.NumberFormat('vi-VN').format(parseInt(digits));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải dữ liệu...</div>;

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
                    <img src="/logo.png" className="w-24 h-24 mx-auto rounded-full border-4 border-[#7AC943] mb-6" alt="Logo" />
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">HOA LƯ ADMIN</h2>
                    <form className="mt-8 space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        setIsSubmitting(true);
                        const form = e.target as any;
                        try {
                            const { data, error } = await supabase
                                .from('users')
                                .select('*')
                                .eq('username', form.user.value)
                                .eq('password_hash', form.pass.value)
                                .single();

                            if (data && !error) {
                                localStorage.setItem('adminUser', JSON.stringify(data));
                                setUser(data); setIsLoggedIn(true); initDashboard();
                            } else {
                                addToast("Sai tài khoản hoặc mật khẩu!", "error");
                            }
                        } catch (err) {
                            addToast("Lỗi hệ thống Supabase", "error");
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}>
                        <input name="user" type="text" placeholder="Tài khoản" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-green-500/20" required />
                        <input name="pass" type="password" placeholder="Mật khẩu" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-green-500/20" required />
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#1e293b] text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 shadow-xl disabled:opacity-50">
                            {isSubmitting ? "Đang kiểm tra..." : <><LogIn size={20} /> ĐĂNG NHẬP</>}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-20">
            <SEO title="Tổng Quan Tài Chính" description="Admin Dashboard" />

            {/* Header V3 Premium */}
            <header className="bg-[#2d3a4b] text-white py-4 px-8 sticky top-0 z-[100] shadow-xl">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" className="w-10 h-10 rounded-full border-2 border-green-400" alt="Logo" />
                        <span className="font-black text-xl tracking-tighter uppercase">Hoa Lư Admin</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-sm font-bold">{user?.full_name || 'Admin'}</div>
                            <div className="text-[10px] text-green-400 font-black uppercase tracking-widest">Online</div>
                        </div>
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-black border-2 border-white/20">
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <button onClick={() => { localStorage.removeItem('adminUser'); setIsLoggedIn(false) }} className="p-2 hover:bg-white/10 rounded-xl"><LogOut size={22} /></button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
                {/* Top Row: Title & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-[#1e293b] tracking-tight">
                            {activeTab === 'finance' ? 'Tổng Quan Tài Chính' : (activeTab === 'tables' ? 'Quản Lý Bàn' : 'Quản Lý Lịch Tập')}
                        </h1>
                        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveTab('finance')}
                                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${activeTab === 'finance' ? 'bg-[#1e293b] text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                            >
                                <Wallet size={18} /> TÀI CHÍNH
                            </button>
                            <button
                                onClick={() => setActiveTab('tables')}
                                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${activeTab === 'tables' ? 'bg-[#1e293b] text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                            >
                                <LayoutDashboard size={18} /> QUẢN LÝ BÀN
                            </button>
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 transition-all ${activeTab === 'schedule' ? 'bg-[#1e293b] text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                            >
                                <Calendar size={18} /> LỊCH TẬP
                            </button>
                        </div>
                    </div>

                    {activeTab === 'finance' && (
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="appearance-none bg-white border-none shadow-sm rounded-2xl px-6 py-3.5 pr-12 font-bold text-sm text-slate-600 outline-none cursor-pointer ring-1 ring-slate-100 focus:ring-2 focus:ring-green-500/20 transition-all"
                                >
                                    <option value="today">Hôm nay</option>
                                    <option value="week">Tuần này</option>
                                    <option value="month">Tháng này</option>
                                    <option value="year">Năm nay</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={18} />
                            </div>
                            <button onClick={exportExcel} className="hidden md:flex items-center gap-2 bg-white px-5 py-3.5 rounded-2xl shadow-sm text-sm font-bold text-slate-600 border border-slate-100 hover:bg-slate-50 transition-all">
                                <FileSpreadsheet size={18} className="text-green-600" /> XUẤT EXCEL
                            </button>
                        </div>
                    )}
                </div>

                {/* --- TAB CONTENT: TABLES MANAGER --- */}
                {activeTab === 'tables' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in duration-500">
                        {/* Left: Table Grid (3 Columns) */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {(tables.length > 0 ? tables : Array.from({ length: 15 }, (_, i) => ({
                                    id: `temp-${i}`,
                                    table_number: i + 1,
                                    status: 'available',
                                    isTemp: true,
                                    player_name: '',
                                    start_time: null
                                }))).map((t: any) => (
                                    <div
                                        key={t.id}
                                        onClick={() => {
                                            if (t.isTemp) {
                                                initTables();
                                            } else {
                                                setSelectedTable(t);
                                                setPlayerNameInput('');
                                            }
                                        }}
                                        className={`relative h-48 rounded-[1.5rem] p-6 cursor-pointer transition-all border-2 
                                            ${selectedTable?.id === t.id ? 'ring-4 ring-offset-2 ring-blue-500 scale-105 z-10' : 'hover:scale-105 hover:shadow-xl'} 
                                            ${t.status === 'occupied'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                                                : t.status === 'reserved'
                                                    ? 'bg-white border-orange-200'
                                                    : 'bg-white border-slate-100'} 
                                            ${t.isTemp ? 'opacity-70 border-dashed border-slate-300' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`text-3xl font-black tracking-tight ${t.status === 'occupied' ? 'text-white' : 'text-slate-700'}`}>
                                                {t.table_number < 10 ? `0${t.table_number}` : t.table_number}
                                            </span>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                                                ${t.status === 'occupied' ? 'bg-white/20 text-white' : t.isTemp ? 'bg-slate-100 text-slate-400' : t.status === 'reserved' ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-600'}`}>
                                                {t.status === 'occupied' ? 'Playing' : t.isTemp ? 'Setup Needed' : t.status === 'reserved' ? 'Reserved' : 'Available'}
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            {t.status === 'occupied' ? (
                                                <>
                                                    <div className="text-sm font-medium text-blue-100 truncate flex items-center gap-2">
                                                        <Users size={14} /> {t.player_name}
                                                    </div>
                                                    <div className="text-3xl font-black text-white mt-2 font-mono tracking-wider">
                                                        {new Date(currentTime.getTime() - new Date(t.start_time).getTime()).toISOString().substr(11, 8)}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 mt-4">
                                                    {t.isTemp ? (
                                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bấm để tạo bàn</span>
                                                    ) : (
                                                        <>
                                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                            <span className="text-xs font-bold uppercase tracking-wider">Sẵn sàng</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Sidebar Actions */}
                        <div className={`lg:col-span-4 transition-all duration-300 ${selectedTable ? 'fixed inset-0 z-[200] p-4 bg-slate-50/95 backdrop-blur-sm lg:static lg:p-0 lg:bg-transparent' : 'hidden lg:block'}`}>
                            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 lg:min-h-[700px] lg:sticky lg:top-28 flex flex-col h-full lg:h-auto overflow-y-auto">
                                {selectedTable ? (
                                    <>
                                        {/* Top: HeaderInfo */}
                                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100 relative">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <button onClick={() => setSelectedTable(null)} className="lg:hidden p-1 -ml-2 text-slate-400 hover:text-slate-800"><ChevronDown size={20} className="rotate-90" /></button>
                                                    Bàn đang chọn
                                                </div>
                                                <div className="text-4xl font-black text-[#1e293b]">Bàn {selectedTable.table_number}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setSelectedTable(null)} className="lg:hidden w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <CloseIcon size={20} />
                                                </button>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${selectedTable.status === 'occupied' ? 'bg-blue-600 shadow-blue-500/30' : 'bg-slate-200'}`}>
                                                    <LayoutDashboard size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        {selectedTable.status === 'available' ? (
                                            <div className="space-y-6 flex-grow flex flex-col justify-center animate-in slide-in-from-right-10">
                                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Khách hàng</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-4 bg-white border-none rounded-2xl mt-2 font-bold text-[#1e293b] outline-none shadow-sm focus:ring-2 ring-blue-500/20"
                                                        placeholder="Nhập tên khách..."
                                                        value={playerNameInput}
                                                        onChange={(e) => setPlayerNameInput(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleTableAction('start', playerNameInput || 'Khách vãng lai')}
                                                    className="w-full py-6 bg-[#1e293b] text-white rounded-3xl font-black shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 text-lg flex items-center justify-center gap-3"
                                                >
                                                    <TrendingUp size={24} /> BẮT ĐẦU CHƠI
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full animate-in slide-in-from-right-10">
                                                {/* Timer Display */}
                                                <div className="bg-[#1e293b] rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 mb-6 relative overflow-hidden">
                                                    <div className="relative z-10 flex justify-between items-end">
                                                        <div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thời gian</div>
                                                            <div className="text-4xl font-black font-mono tracking-wider text-[#FFD800]">
                                                                {new Date(currentTime.getTime() - new Date(selectedTable.start_time).getTime()).toISOString().substr(11, 8)}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tạm tính</div>
                                                            <div className="text-xl font-bold text-white">{calculateTableFee(selectedTable).toLocaleString()}đ</div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                                </div>

                                                {/* Quick Addons - Menu */}
                                                <div className="flex-grow overflow-y-auto mb-6 pr-2">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 sticky top-0 bg-white z-10 py-2">Thêm dịch vụ</div>
                                                    <div className="space-y-3">
                                                        {[
                                                            { name: 'Sting', price: 15000, icon: <Coffee size={18} className="text-red-500" /> },
                                                            { name: 'Nước suối', price: 10000, icon: <Coffee size={18} className="text-blue-500" /> },
                                                            { name: 'Revive', price: 15000, icon: <Coffee size={18} className="text-yellow-500" /> },
                                                            { name: 'Thuê vợt', price: 20000, icon: <Search size={18} className="text-purple-500" /> },
                                                            { name: 'Bóng', price: 130000, icon: <Circle size={18} className="text-orange-500" /> }
                                                        ].map((item, idx) => {
                                                            const inCart = selectedTable.services?.find((s: any) => s.item === item.name);
                                                            const qty = inCart ? inCart.qty : 0;

                                                            return (
                                                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600">
                                                                            {item.icon}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-bold text-slate-700">{item.name}</div>
                                                                            <div className="text-[10px] font-bold text-slate-400">{item.price.toLocaleString()}đ</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-3 bg-white rounded-xl p-1 shadow-sm">
                                                                        <button
                                                                            onClick={() => qty > 0 && handleTableAction('update_service', { item: item.name, price: item.price, qty: -1 })}
                                                                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${qty > 0 ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'text-slate-300 cursor-not-allowed'}`}
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span className="text-sm font-black w-4 text-center">{qty}</span>
                                                                        <button
                                                                            onClick={() => handleTableAction('update_service', { item: item.name, price: item.price, qty: 1 })}
                                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e293b] text-white hover:bg-slate-700 shadow-lg shadow-slate-900/10"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Bill Summary Footer */}
                                                <div className="mt-auto bg-slate-50 p-6 rounded-3xl space-y-3 border border-slate-100">
                                                    <div className="flex justify-between text-sm text-slate-500">
                                                        <span>{selectedTable.table_number >= 10 ? `Tiền giờ (${getDuration(selectedTable.start_time).toFixed(1)}h)` : 'Phí lượt chơi'}</span>
                                                        <span className="font-bold">{calculateTableFee(selectedTable).toLocaleString()}đ</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-slate-500">
                                                        <span>Dịch vụ ({selectedTable.services?.reduce((acc: any, cur: any) => acc + cur.qty, 0) || 0})</span>
                                                        <span className="font-bold">{(calculateTotal(selectedTable) - calculateTableFee(selectedTable)).toLocaleString()}đ</span>
                                                    </div>
                                                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                                        <span className="font-black text-slate-800 uppercase text-xs tracking-widest">TỔNG THANH TOÁN</span>
                                                        <span className="text-3xl font-black text-[#1e293b]">{calculateTotal(selectedTable).toLocaleString()}đ</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleTableAction('stop')}
                                                    className="w-full mt-4 py-5 bg-green-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-500/30 hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <Wallet size={24} /> THANH TOÁN
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6 opacity-60">
                                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center animate-pulse">
                                            <LayoutDashboard size={64} className="text-slate-200" />
                                        </div>
                                        <div className="font-bold text-sm uppercase tracking-widest text-center">Chọn một bàn<br />để xem chi tiết</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'finance' && (
                    <>
                        {/* Stats & Chart Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
                                <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">Tổng Thu Nhập Thực Tế</span>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <h2 className="text-5xl font-black text-[#1e293b] tracking-tighter">{stats.income.toLocaleString()}đ</h2>
                                </div>
                                <div className="flex items-center gap-1.5 text-green-500 text-sm mt-6 font-black">
                                    <TrendingUp size={18} /> <span>Dữ liệu ổn định</span>
                                </div>
                                <Wallet className="absolute -right-8 -bottom-8 w-44 h-44 text-green-500 opacity-[0.03] group-hover:scale-110 transition-transform duration-700" />
                            </div>

                            <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                                <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-wider flex justify-between items-center">
                                    Dòng Tiền Thu Nhập (Theo Tháng)
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span> Doanh thu
                                    </div>
                                </h3>
                                <div className="h-[280px]">
                                    <canvas ref={chartRef}></canvas>
                                </div>
                            </div>
                        </div>

                        {/* Form & Table Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Left: Form */}
                            <div className="lg:col-span-4">
                                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-28">
                                    <h3 className="font-black text-xl text-[#1e293b] mb-10 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-green-500 rounded-full"></div> Ghi Chép Giao Dịch
                                    </h3>
                                    <form className="space-y-6" onSubmit={handleAddTransaction}>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hạng Mục</label>
                                            <select
                                                className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none focus:ring-2 ring-green-500/10 transition-all appearance-none"
                                                value={catId}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    setCatId(selectedId);
                                                    const selectedCat = categories.find((c: any) => c.id.toString() === selectedId) as any;
                                                    if (selectedCat) {
                                                        if (selectedCat.name === 'Khác' || Number(selectedCat.default_amount) === 0) {
                                                            setAmount('');
                                                        } else {
                                                            const cleanAmount = Number(selectedCat.default_amount).toLocaleString();
                                                            setAmount(cleanAmount);
                                                        }
                                                    }
                                                }}
                                                required
                                            >
                                                <option value="">-- Chọn hạng mục --</option>
                                                {categories.map((c: any) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số tiền (VNĐ)</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-black text-slate-800 text-xl md:text-2xl placeholder:text-slate-200 outline-none focus:ring-2 ring-green-500/10 transition-all"
                                                value={amount}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                                    setAmount(raw ? parseInt(raw).toLocaleString() : '');
                                                }}
                                                placeholder="Ví dụ: 100 = 100,000" required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày thực hiện</label>
                                            <div className="relative w-full mt-2 group">
                                                <input
                                                    type="date"
                                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                                    value={date} onChange={(e) => setDate(e.target.value)} required
                                                />
                                                <div className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-600 flex justify-between items-center group-focus-within:ring-2 ring-green-500/10 transition-all">
                                                    <span>{date ? date.split('-').reverse().join('/') : 'dd/mm/yyyy'}</span>
                                                    <Calendar size={20} className="text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên người nộp</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-black text-slate-800 outline-none uppercase placeholder:normal-case"
                                                value={desc} onChange={(e) => setDesc(e.target.value.toUpperCase())}
                                                placeholder="Tên khách hàng..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên dụng cụ (nếu có)</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-medium text-slate-600 outline-none"
                                                value={equipment} onChange={(e) => setEquipment(e.target.value)}
                                                placeholder="Ví dụ: Cốt vợt Viscaria, mặt vợt..."
                                            />
                                        </div>
                                        <button
                                            disabled={isSubmitting}
                                            className="w-full bg-[#2d3a4b] hover:bg-[#1e293b] text-white font-black p-5 rounded-2xl shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                        >
                                            {isSubmitting ? "ĐANG LƯU..." : "LƯU GIAO DỊCH"} <PlusCircle size={22} />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Right: Table */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col">
                                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                        <div className="relative w-full max-w-sm group">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Tìm tên khách, nội dung..."
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-green-500/10 outline-none transition-all"
                                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto flex-grow">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                                                    <th className="px-4 md:px-10 py-6 hidden md:table-cell">Ngày</th>
                                                    <th className="px-4 md:px-10 py-6">Hạng mục</th>
                                                    <th className="px-4 md:px-10 py-6">Dụng cụ</th>
                                                    <th className="px-4 md:px-10 py-6">Họ và tên</th>
                                                    <th className="px-4 md:px-10 py-6 text-right">Số tiền</th>
                                                    <th className="px-4 md:px-10 py-6 text-center">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {records.filter((r: any) =>
                                                    r.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                                    (r.equipment_name && r.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                ).map((r: any) => (
                                                    <tr key={r.id} className="hover:bg-slate-50/80 transition-all group">
                                                        <td className="px-4 md:px-10 py-7 text-sm font-bold text-slate-400 hidden md:table-cell">
                                                            {new Date(r.transaction_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 md:px-10 py-7">
                                                            <span className="font-black text-slate-700 block text-base">{r.category_name}</span>
                                                            <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider mt-1 inline-block">Đã duyệt</span>
                                                        </td>
                                                        <td className="px-4 md:px-10 py-7 text-sm font-medium text-slate-400 italic line-clamp-1">{r.equipment_name || '-'}</td>
                                                        <td className="px-4 md:px-10 py-7">
                                                            <div id={`desc-${r.id}`} className="text-sm font-medium text-slate-400 italic line-clamp-1 transition-all">
                                                                {r.description || '-'}
                                                            </div>
                                                            {r.description && r.description.length > 5 && (
                                                                <button
                                                                    onClick={() => document.getElementById(`desc-${r.id}`)?.classList.toggle('line-clamp-1')}
                                                                    className="text-[10px] font-bold text-blue-500 hover:text-blue-600 mt-1 flex items-center gap-1"
                                                                >
                                                                    Xem thêm <ChevronDown size={10} />
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="px-4 md:px-10 py-7 text-right font-black text-[#7AC943] text-xl">
                                                            +{parseFloat(r.amount).toLocaleString()} đ
                                                        </td>
                                                        <td className="px-4 md:px-10 py-7 text-center">
                                                            <button
                                                                onClick={() => { setDeleteTargetId(r.id); setShowDeleteModal(true) }}
                                                                className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'schedule' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Schedule Management UI */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Coach Form */}
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                                <h3 className="font-black text-xl text-[#1e293b] mb-10 flex items-center gap-3">
                                    <Users size={24} className="text-green-500" /> Quản Lý Huấn Luyện Viên
                                </h3>
                                <form className="space-y-6" onSubmit={handleAddCoach}>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                                        <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={coachName} onChange={e => setCoachName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trình độ</label>
                                        <select className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={coachLevel} onChange={e => setCoachLevel(e.target.value)}>
                                            <option value="HLV Cơ bản">HLV Cơ bản</option>
                                            <option value="HLV Nâng cao">HLV Nâng cao</option>
                                            <option value="HLV Chuyên nghiệp">HLV Chuyên nghiệp</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Học phí (VND/Buổi)</label>
                                        <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" placeholder="300.000đ" value={coachFee} onChange={e => setCoachFee(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền thuê bàn (VND/Giờ)</label>
                                        <input type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" placeholder="50.000đ" value={coachTableFee} onChange={e => setCoachTableFee(e.target.value)} />
                                    </div>
                                    <button type="submit" className="w-full bg-[#1e293b] text-white p-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all">
                                        THÊM HLV MỚI <PlusCircle size={20} />
                                    </button>
                                </form>

                                <div className="mt-10 border-t border-slate-50 pt-8">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Danh sách HLV</label>
                                    <div className="space-y-4">
                                        {coaches.map(c => (
                                            <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ background: c.color }}></div>
                                                    <div>
                                                        <div className="text-sm font-black text-slate-700">{c.name}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{c.level}</div>
                                                    </div>
                                                </div>
                                                <button onClick={() => deleteTableItem('coaches', c.id)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            {/* Session Form */}
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                                <h3 className="font-black text-xl text-[#1e293b] mb-10 flex items-center gap-3">
                                    <Calendar size={24} className="text-[#FFD800]" /> Xếp Lịch Huấn Luyện
                                </h3>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleAddSession}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Huấn luyện viên</label>
                                            <select className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={sessCoachId} onChange={e => setSessCoachId(e.target.value)} required>
                                                <option value="">-- Chọn HLV --</option>
                                                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số bàn</label>
                                            <select className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={sessLoc} onChange={e => setSessLoc(e.target.value)} required>
                                                <option value="">-- Chọn Bàn --</option>
                                                {[...Array(15)].map((_, i) => (
                                                    <option key={i + 1} value={`Bàn ${i + 1}`}>Bàn {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày (Thứ)</label>
                                            <select className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={sessDay} onChange={e => setSessDay(e.target.value)}>
                                                <option value="Monday">Thứ 2</option>
                                                <option value="Tuesday">Thứ 3</option>
                                                <option value="Wednesday">Thứ 4</option>
                                                <option value="Thursday">Thứ 5</option>
                                                <option value="Friday">Thứ 6</option>
                                                <option value="Saturday">Thứ 7</option>
                                                <option value="Sunday">Chủ nhật</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bắt đầu</label>
                                                <input type="time" className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={sessStart} onChange={e => setSessStart(e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kết thúc</label>
                                                <input type="time" className="w-full p-4 bg-slate-50 border-none rounded-2xl mt-2 font-bold text-slate-700 outline-none" value={sessEnd} onChange={e => setSessEnd(e.target.value)} required />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full h-[68px] bg-[#1e293b] text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all mt-4">
                                            LƯU THỜI KHÓA BIỂU
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Sessions Table */}
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
                                        <FileSpreadsheet size={16} className="text-green-500" /> Bảng phân phối lịch tuần
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <th className="px-8 py-5">Thứ</th>
                                                <th className="px-8 py-5">Giờ tập</th>
                                                <th className="px-8 py-5">HLV</th>
                                                <th className="px-8 py-5">Bàn số</th>
                                                <th className="px-8 py-5 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {sessions.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8 text-slate-400 font-bold bg-slate-50/30">
                                                        Chưa có lịch tập nào. Hãy "Lưu thời khóa biểu" ở form trên.
                                                    </td>
                                                </tr>
                                            )}
                                            {sessions.map((s: any) => (
                                                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-5 text-sm font-black text-slate-700">{s.day === 'Monday' ? 'Thứ 2' : s.day === 'Tuesday' ? 'Thứ 3' : s.day === 'Wednesday' ? 'Thứ 4' : s.day === 'Thursday' ? 'Thứ 5' : s.day === 'Friday' ? 'Thứ 6' : s.day === 'Saturday' ? 'Thứ 7' : 'Chủ nhật'}</td>
                                                    <td className="px-8 py-5 text-xs font-bold text-slate-400">{s.start_time} - {s.end_time}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: coaches.find((c: any) => c.id == s.coach_id)?.color || '#ccc' }}></div>
                                                            <span className="text-xs font-black">{coaches.find((c: any) => c.id == s.coach_id)?.name || 'HLV ẩn'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-xs font-bold text-slate-600">{s.location}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button onClick={() => deleteTableItem('training_sessions', s.id)} className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }
            </main >

            {/* --- MODALS --- */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center scale-in duration-300">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Xác nhận xóa?</h3>
                            <p className="text-slate-400 font-medium mt-3">Giao dịch sẽ bị ẩn khỏi các báo cáo doanh thu. Bạn không thể hoàn tác.</p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button onClick={() => setShowDeleteModal(false)} className="p-4 rounded-2xl font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">HỦY BỎ</button>
                                <button onClick={handleDelete} className="p-4 rounded-2xl font-bold bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">ĐỒNG Ý XÓA</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- TOASTS --- */}
            <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-3">
                {toasts.map(t => (
                    <div key={t.id} className={`bg-white px-6 py-4 rounded-2xl shadow-2xl border-l-4 ${t.type === 'error' ? 'border-red-500' : t.type === 'warning' ? 'border-yellow-500' : 'border-green-500'} flex items-center gap-4 animate-in slide-in-from-right-10 duration-500`}>
                        <div className={`${t.type === 'error' ? 'text-red-500 bg-red-50' : t.type === 'warning' ? 'text-yellow-500 bg-yellow-50' : 'text-green-500 bg-green-50'} p-2 rounded-full`}>
                            {t.type === 'error' ? <AlertTriangle size={20} /> : t.type === 'warning' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                        </div>
                        <span className="font-bold text-slate-700">{t.msg}</span>
                    </div>
                ))}
            </div>
        </div >
    );
}
