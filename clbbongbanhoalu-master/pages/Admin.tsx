import React, { useState, useEffect, useRef } from 'react';
import {
    Wallet, LogOut, TrendingUp, FileSpreadsheet, LayoutDashboard, Coffee, Circle,
    Trash2, Search, LogIn, PlusCircle, ChevronDown, Play, Pause, Square,
    AlertTriangle, CheckCircle, X as CloseIcon, Calendar, Users, Home, Settings,
    Clock, DollarSign, Minus, Plus, Moon, Sun, Pencil
} from 'lucide-react';
import SEO from '../components/SEO';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import { Card, Button, BottomSheet, StatsCard, BottomNav } from '../components/ui';
import { formatCurrency, formatTime, calculatePrice, PRICE_PER_PERSON, ADMIN_CONFIG, formatDuration } from '../utils/helpers';

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
    const [playerCountInput, setPlayerCountInput] = useState(2); // Số người chơi (mặc định 2)
    const [currentTime, setCurrentTime] = useState(new Date());

    // UI Effects
    const [toasts, setToasts] = useState<any[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteTargetTable, setDeleteTargetTable] = useState('transactions');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('adminDarkMode') === 'true';
        }
        return false;
    });
    const [userRole, setUserRole] = useState<'owner' | 'staff'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('adminRole') as 'owner' | 'staff') || 'staff';
        }
        return 'staff';
    });

    // Check if user is owner
    const isOwner = userRole === 'owner';

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('adminDarkMode', String(newMode));
    };

    // Filters
    const [timeRange, setTimeRange] = useState('year');
    const [searchTerm, setSearchTerm] = useState('');

    // --- LỊCH TẬP STATE ---
    const [activeTab, setActiveTab] = useState('finance');
    const [coaches, setCoaches] = useState<any[]>([]);

    // --- MODALS STATE ---
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [groups, setGroups] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    // Form Lịch tập
    const [coachName, setCoachName] = useState('');
    const [coachLevel, setCoachLevel] = useState('HLV Cơ bản');
    const [coachFee, setCoachFee] = useState('');
    const [coachTableFee, setCoachTableFee] = useState('');
    const [coachStudents, setCoachStudents] = useState('');
    const [coachExp, setCoachExp] = useState('');
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

        const formatDate = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            start: formatDate(start),
            end: formatDate(end)
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
                                admin_users (full_name)
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
            creator_name: r.admin_users?.full_name
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

    const [editingCoachId, setEditingCoachId] = useState<number | null>(null);

    const handleAddCoach = async (e: React.FormEvent) => {
        e.preventDefault();
        const colors = ['#4E9F3D', '#7AC943', '#1e293b', '#2D5A27', '#FFD800'];
        const coachData = {
            name: coachName,
            level: coachLevel,
            hourly_rate: parseInt(coachFee) || 300000,
            trial_rate: parseInt(coachTableFee) || 50000,
            students_count: parseInt(coachStudents) || 0,
            experience: parseInt(coachExp) || 0,
            color: colors[coaches.length % colors.length]
        };

        if (editingCoachId) {
             // Update Mode
             const { error } = await supabase.from('coaches').update(coachData).eq('id', editingCoachId);
             if (!error) {
                 addToast("Cập nhật HLV thành công!", "success");
                 setEditingCoachId(null);
             } else {
                 addToast("Lỗi cập nhật: " + error.message, "error");
             }
        } else {
             // Create Mode
             const { error } = await supabase.from('coaches').insert([coachData]);
             if (!error) {
                addToast("Thêm HLV thành công!", "success");
             } else {
                addToast("Lỗi thêm: " + error.message, "error");
             }
        }
        
        // Reset Form
        setCoachName(''); setCoachFee(''); setCoachTableFee('');
        setCoachStudents(''); setCoachExp('');
        fetchScheduleData();
    };

    const handleEditCoach = (coach: any) => {
        setEditingCoachId(coach.id);
        setCoachName(coach.name);
        setCoachLevel(coach.level);
        setCoachFee(coach.hourly_rate?.toString() || '');
        setCoachTableFee(coach.trial_rate?.toString() || '');
        setCoachStudents(coach.students_count?.toString() || '');
        setCoachExp(coach.experience?.toString() || '');
        // Scroll to form (simple implementation)
        const formElement = document.getElementById('coach-form');
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
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

        // Bàn 10+ tính tiền giờ (70k/h)
        if (t.table_number >= 10) {
            const hours = getDuration(t.start_time);
            return Math.floor(hours * 70000);
        }

        // Bàn 1-9: 40,000đ × số người chơi
        const playerCount = t.player_count || 2;
        return playerCount * 40000;
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
            // payload = { playerName, playerCount }
            updateData = {
                status: 'occupied',
                start_time: new Date().toISOString(),
                player_name: payload?.playerName || 'Khách vãng lai',
                player_count: payload?.playerCount || 2,
                services: []
            };
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

    // Helper: Format Duration HH:mm:ss for Live Timer
    const formatDurationHMS = (startTime: string, now: Date) => {
        if (!startTime) return "00:00:00";
        const start = new Date(startTime).getTime();
        const current = now.getTime();
        const diff = Math.max(0, current - start) / 1000;

        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = Math.floor(diff % 60);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Override existing formatDuration in utils (since helpers is external, we can just define a local variant for UI usage)
    // Actually, let's just use formatDurationHMS in the UI directly.

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
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-emerald-500/10 w-full max-w-md text-center border border-emerald-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-6">
                        <LayoutDashboard size={36} className="text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">CLB Bóng Bàn</h2>
                    <p className="text-emerald-600 font-bold text-sm mt-1">Hoa Lư - Admin Panel</p>
                    <form className="mt-8 space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        setIsSubmitting(true);
                        const form = e.target as any;
                        try {
                            const { data, error } = await supabase
                                .from('admin_users')
                                .select('*')
                                .eq('email', form.user.value)
                                .eq('password_hash', form.pass.value)
                                .single();

                            if (data && !error) {
                                localStorage.setItem('adminUser', JSON.stringify(data));
                                localStorage.setItem('adminRole', data.role || 'staff');
                                setUserRole(data.role || 'staff');
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
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left mb-2 ml-1">Tài khoản</label>
                            <input name="user" type="text" placeholder="Nhập tên đăng nhập" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-emerald-500/30 focus:bg-white transition-all font-medium" required />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left mb-2 ml-1">Mật khẩu</label>
                            <input name="pass" type="password" placeholder="••••••" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-emerald-500/30 focus:bg-white transition-all font-medium" required />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-6 shadow-xl shadow-emerald-500/30 disabled:opacity-50 transition-all active:scale-[0.98]">
                            {isSubmitting ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><LogIn size={20} /> Đăng Nhập</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-sans pb-24 md:pb-10 transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
            <SEO title="Tổng Quan Tài Chính" description="Admin Dashboard" />

            {/* Header - Mobile Optimized */}
            <header className={`py-4 px-4 md:px-8 sticky top-0 z-[100] shadow-xl transition-colors ${darkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-emerald-600/20'}`}>
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src="/logo.png" alt="Logo CLB Hoa Lư" className="w-full h-full object-cover scale-110" />
                        </div>
                        <div>
                            <span className="font-black text-lg tracking-tight block leading-tight text-white">Hoa Lư</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-emerald-400' : 'text-emerald-100'}`}>Admin Panel</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2.5 rounded-xl transition-colors touch-target ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-amber-400' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                            title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-bold text-white">{user?.full_name || 'Admin'}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 justify-end ${darkMode ? 'text-emerald-400' : 'text-emerald-200'}`}>
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-sm border-2 border-white/30 backdrop-blur-sm">
                            {user?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <button
                            onClick={() => { localStorage.removeItem('adminUser'); setIsLoggedIn(false) }}
                            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors touch-target"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-10">
                {/* Top Row: Title & Filter - Desktop Only */}
                <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            {activeTab === 'finance' ? 'Tổng Quan Tài Chính' : (activeTab === 'tables' ? 'Quản Lý Bàn' : 'Quản Lý Lịch Tập')}
                        </h1>
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                            <button
                                onClick={() => setActiveTab('finance')}
                                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'finance' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                            >
                                <Wallet size={18} /> Tài Chính
                            </button>
                            <button
                                onClick={() => setActiveTab('tables')}
                                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'tables' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                            >
                                <LayoutDashboard size={18} /> Quản Lý Bàn
                            </button>
                            {isOwner && (
                                <button
                                    onClick={() => setActiveTab('schedule')}
                                    className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'schedule' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                                >
                                    <Calendar size={18} /> Lịch Tập
                                </button>
                            )}
                        </div>
                    </div>

                    {activeTab === 'finance' && (
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className={`appearance-none shadow-sm rounded-2xl px-5 py-3 pr-12 font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all ${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-200' : 'bg-white border border-slate-100 text-slate-600'}`}
                                >
                                    <option value="today">Hôm nay</option>
                                    <option value="week">Tuần này</option>
                                    <option value="month">Tháng này</option>
                                    <option value="year">Năm nay</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={18} />
                            </div>
                            {isOwner && (
                                <button onClick={exportExcel} className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-sm text-sm font-bold transition-all ${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}>
                                    <FileSpreadsheet size={18} className="text-emerald-500" /> Xuất Excel
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile: Quick Stats Header for Tables */}
                {activeTab === 'tables' && (
                    <div className="md:hidden mb-6">
                        <h1 className={`text-xl font-black mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Quản Lý Bàn</h1>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            <div className={`flex-shrink-0 rounded-2xl p-4 border min-w-[120px] ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                                    <LayoutDashboard size={16} />
                                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Đang chơi</span>
                                </div>
                                <div className={`text-2xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    {tables.filter((t: any) => t.status === 'occupied').length}/{tables.length || 15}
                                </div>
                            </div>
                            <div className={`flex-shrink-0 rounded-2xl p-4 border min-w-[120px] ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <div className="flex items-center gap-2 text-orange-600 mb-1">
                                    <Users size={16} />
                                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Khách</span>
                                </div>
                                <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {tables.filter((t: any) => t.status !== 'available').reduce((acc: number, t: any) => acc + (t.player_count || 2), 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB CONTENT: TABLES MANAGER --- */}
                {activeTab === 'tables' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                        {/* Left: Table Grid (2 Columns on Mobile) */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
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
                                        className={`relative min-h-[140px] md:min-h-[160px] rounded-2xl p-4 md:p-5 cursor-pointer transition-all border-2 
                                            ${selectedTable?.id === t.id ? 'ring-4 ring-offset-2 ring-emerald-500 scale-[1.02] z-10' : 'hover:scale-[1.02] active:scale-[0.98]'} 
                                            ${t.status === 'occupied'
                                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                                                : t.status === 'paused'
                                                    ? darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-300'
                                                    : t.status === 'reserved'
                                                        ? darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-white border-orange-200'
                                                        : darkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-600' : 'bg-white border-slate-100 hover:border-emerald-200'} 
                                            ${t.isTemp ? 'opacity-70 border-dashed' : ''} ${t.isTemp && darkMode ? 'border-slate-600' : t.isTemp ? 'border-slate-300' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`text-2xl md:text-3xl font-black tracking-tight ${t.status === 'occupied' ? 'text-white' : t.status === 'paused' ? 'text-amber-500' : darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                {t.table_number < 10 ? `0${t.table_number}` : t.table_number}
                                            </span>
                                            <div className={`w-2.5 h-2.5 rounded-full 
                                                ${t.status === 'occupied' ? 'bg-white animate-pulse' : t.status === 'paused' ? 'bg-amber-400' : t.isTemp ? 'bg-slate-500' : 'bg-emerald-400'}`}
                                            />
                                        </div>

                                        <div className="mt-4 md:mt-6">
                                            {t.status === 'occupied' ? (
                                                <>
                                                    <div className="text-[10px] md:text-xs text-emerald-100 truncate flex items-center gap-1">
                                                        {t.table_number >= 10 ? (
                                                            <><Clock size={10} /> 70k/giờ</>
                                                        ) : (
                                                            <><Users size={10} /> {t.player_count || 2} người</>
                                                        )}
                                                        <span className="opacity-60">• {t.player_name || 'Khách'}</span>
                                                    </div>
                                                    <div className="text-lg md:text-xl font-black text-white mt-1 font-mono tracking-wider">
                                                        {formatDurationHMS(t.start_time, currentTime)}
                                                    </div>
                                                    <div className="text-[10px] text-emerald-200 font-bold mt-0.5">
                                                        {calculateTableFee(t).toLocaleString()}đ
                                                    </div>
                                                </>
                                            ) : t.status === 'paused' ? (
                                                <>
                                                    <div className="text-xs text-amber-600 truncate">
                                                        {t.player_name || 'Khách'}
                                                    </div>
                                                    <div className="text-lg font-bold text-amber-700 mt-1 font-mono">
                                                        Tạm dừng
                                                    </div>
                                                </>
                                            ) : (
                                                <div className={`flex flex-col items-center justify-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {t.isTemp ? (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Bấm để tạo</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Sẵn sàng</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Sidebar Actions */}
                        <div className={`lg:col-span-4 transition-all duration-300 ${selectedTable ? 'fixed inset-0 z-[200] p-4 bg-slate-900/50 backdrop-blur-sm lg:static lg:p-0 lg:bg-transparent' : 'hidden lg:block'}`}>
                            <div className={`p-5 md:p-6 rounded-3xl shadow-2xl lg:min-h-[600px] lg:sticky lg:top-28 flex flex-col h-full lg:h-auto overflow-y-auto max-h-[90vh] lg:max-h-none animate-slide-up lg:animate-none transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
                                {selectedTable ? (
                                    <>
                                        {/* Top: HeaderInfo */}
                                        <div className={`flex justify-between items-center mb-5 pb-5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                            <div>
                                                <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                                                    <button onClick={() => setSelectedTable(null)} className={`lg:hidden p-1 -ml-2 ${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-800'}`}><ChevronDown size={20} className="rotate-90" /></button>
                                                    Bàn đang chọn
                                                </div>
                                                <div className={`text-3xl font-black ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>Bàn {selectedTable.table_number}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setSelectedTable(null)} className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center touch-target ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                                                    <CloseIcon size={20} />
                                                </button>
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${selectedTable.status === 'occupied' ? 'bg-emerald-600 shadow-emerald-500/30' : darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-400'}`}>
                                                    <LayoutDashboard size={22} />
                                                </div>
                                            </div>
                                        </div>

                                        {selectedTable.status === 'available' ? (
                                            <div className="space-y-4 flex-grow flex flex-col justify-center animate-fade-in">
                                                {/* Tên khách */}
                                                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                                                    <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Tên khách hàng</label>
                                                    <input
                                                        type="text"
                                                        className={`w-full p-3 border-none rounded-xl mt-2 font-bold outline-none shadow-sm focus:ring-2 ring-emerald-500/20 transition-all ${darkMode ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-white text-slate-800'}`}
                                                        placeholder="Nhập tên khách..."
                                                        value={playerNameInput}
                                                        onChange={(e) => setPlayerNameInput(e.target.value)}
                                                    />
                                                </div>

                                                {/* Số người chơi - Chỉ cho bàn 1-9 */}
                                                {selectedTable.table_number < 10 ? (
                                                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Số người chơi</label>

                                                        {/* Preset buttons */}
                                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                                            <button
                                                                onClick={() => setPlayerCountInput(2)}
                                                                className={`h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${playerCountInput === 2
                                                                    ? (darkMode ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                                                                    : (darkMode ? 'border-slate-600 bg-slate-700 text-slate-400 hover:border-emerald-500/50' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200')
                                                                    }`}
                                                            >
                                                                <Users size={16} className="mb-0.5" />
                                                                <span className="font-bold text-xs">2 Người</span>
                                                            </button>

                                                            <button
                                                                onClick={() => setPlayerCountInput(3)}
                                                                className={`h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${playerCountInput === 3
                                                                    ? (darkMode ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                                                                    : (darkMode ? 'border-slate-600 bg-slate-700 text-slate-400 hover:border-emerald-500/50' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200')
                                                                    }`}
                                                            >
                                                                <Users size={16} className="mb-0.5" />
                                                                <span className="font-bold text-xs">3 Người</span>
                                                            </button>

                                                            <button
                                                                onClick={() => setPlayerCountInput(4)}
                                                                className={`h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${playerCountInput === 4
                                                                    ? (darkMode ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                                                                    : (darkMode ? 'border-slate-600 bg-slate-700 text-slate-400 hover:border-emerald-500/50' : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200')
                                                                    }`}
                                                            >
                                                                <Users size={16} className="mb-0.5" />
                                                                <span className="font-bold text-xs">4 Người</span>
                                                            </button>
                                                        </div>

                                                        {/* Custom adjust */}
                                                        <div className={`flex items-center justify-between rounded-xl p-2 shadow-sm ${darkMode ? 'bg-slate-700 border border-slate-600' : 'bg-white'}`}>
                                                            <span className="text-xs font-bold text-slate-500 ml-2">Tùy chỉnh</span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setPlayerCountInput(Math.max(1, playerCountInput - 1))}
                                                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors touch-target ${darkMode ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                                >
                                                                    <Minus size={16} />
                                                                </button>
                                                                <span className={`w-8 text-center font-black text-lg ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{playerCountInput}</span>
                                                                <button
                                                                    onClick={() => setPlayerCountInput(playerCountInput + 1)}
                                                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors touch-target ${darkMode ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* Bàn 10+ - Thông tin tính theo giờ */
                                                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'}`}>
                                                        <div className="flex items-center gap-2 text-amber-700 mb-2">
                                                            <Clock size={18} />
                                                            <span className="font-bold text-sm">Bàn tính theo giờ</span>
                                                        </div>
                                                        <p className="text-amber-600 text-xs">Bàn {selectedTable.table_number} được tính phí <span className="font-bold">70,000đ/giờ</span></p>
                                                    </div>
                                                )}

                                                {/* Price Preview - Chỉ cho bàn 1-9 */}
                                                {selectedTable.table_number < 10 && (
                                                    <div className={`flex justify-between items-center p-4 rounded-2xl border ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                                                        <div>
                                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Tạm tính</span>
                                                            <span className="text-[10px] text-emerald-500">{playerCountInput} × 40,000đ</span>
                                                        </div>
                                                        <span className="text-2xl font-black text-emerald-700">{(playerCountInput * 40000).toLocaleString()}đ</span>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        handleTableAction('start', {
                                                            playerName: playerNameInput || 'Khách vãng lai',
                                                            playerCount: playerCountInput
                                                        });
                                                        setPlayerCountInput(2); // Reset về mặc định
                                                    }}
                                                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-3"
                                                >
                                                    <Play size={22} fill="currentColor" /> Bắt đầu chơi
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full animate-fade-in">
                                                {/* Timer Display */}
                                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-xl shadow-emerald-500/30 mb-5 relative overflow-hidden">
                                                    <div className="relative z-10 flex justify-between items-end">
                                                        <div>
                                                            <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                                <Clock size={12} /> Thời gian
                                                            </div>
                                                            <div className="text-3xl md:text-4xl font-black font-mono tracking-wider text-white">
                                                                {formatDurationHMS(selectedTable.start_time, currentTime)}
                                                            </div>
                                                            <div className="text-[10px] text-emerald-200 mt-1 flex items-center gap-1">
                                                                {selectedTable.table_number >= 10 ? (
                                                                    <><Clock size={10} /> Tính theo giờ</>
                                                                ) : (
                                                                    <><Users size={10} /> {selectedTable.player_count || 2} người</>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1">Tạm tính</div>
                                                            <div className="text-xl font-bold text-white">{calculateTableFee(selectedTable).toLocaleString()}đ</div>
                                                            <div className="text-[10px] text-emerald-200">
                                                                {selectedTable.table_number >= 10
                                                                    ? '70,000đ/giờ'
                                                                    : `${selectedTable.player_count || 2} × 40,000đ`
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                                </div>

                                                {/* Quick Addons - Menu */}
                                                <div className="flex-grow overflow-y-auto mb-4 -mx-1 px-1">
                                                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 sticky top-0 z-10 py-2 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'}`}>Thêm dịch vụ</div>
                                                    <div className="space-y-2">
                                                        {ADMIN_CONFIG.ADDITIONAL_SERVICES.map((item, idx) => {
                                                            const inCart = selectedTable.services?.find((s: any) => s.item === item.name);
                                                            const qty = inCart ? inCart.qty : 0;
                                                            const icons: any = {
                                                                'Sting': <Coffee size={16} className="text-rose-500" />,
                                                                'Nước suối': <Coffee size={16} className="text-blue-500" />,
                                                                'Revive': <Coffee size={16} className="text-amber-500" />,
                                                                'Thuê vợt': <Search size={16} className="text-purple-500" />,
                                                                'Bóng': <Circle size={16} className="text-orange-500" />
                                                            };

                                                            return (
                                                                <div key={idx} className={`flex justify-between items-center p-3 rounded-xl transition-colors ${darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${darkMode ? 'bg-slate-600' : 'bg-white'}`}>
                                                                            {icons[item.name] || <Coffee size={16} />}
                                                                        </div>
                                                                        <div>
                                                                            <div className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.name}</div>
                                                                            <div className="text-[10px] font-bold text-slate-400">{item.price.toLocaleString()}đ</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className={`flex items-center gap-2 rounded-lg p-1 shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                                                        <button
                                                                            onClick={() => qty > 0 && handleTableAction('update_service', { item: item.name, price: item.price, qty: -1 })}
                                                                            className={`w-8 h-8 flex items-center justify-center rounded-md transition-all touch-target ${qty > 0 ? (darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600') : 'text-slate-300 cursor-not-allowed'}`}
                                                                        >
                                                                            <Minus size={14} />
                                                                        </button>
                                                                        <span className="text-sm font-black w-4 text-center">{qty}</span>
                                                                        <button
                                                                            onClick={() => handleTableAction('update_service', { item: item.name, price: item.price, qty: 1 })}
                                                                            className="w-8 h-8 flex items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm touch-target"
                                                                        >
                                                                            <Plus size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Bill Summary Footer */}
                                                <div className={`mt-auto p-4 rounded-2xl space-y-2 border ${darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-100'}`}>
                                                    <div className={`flex justify-between text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        <span>{selectedTable.table_number >= 10 ? `Tiền giờ` : 'Phí lượt chơi'}</span>
                                                        <span className="font-bold">{calculateTableFee(selectedTable).toLocaleString()}đ</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-slate-600">
                                                        <span>Dịch vụ ({selectedTable.services?.reduce((acc: any, cur: any) => acc + cur.qty, 0) || 0})</span>
                                                        <span className="font-bold">{(calculateTotal(selectedTable) - calculateTableFee(selectedTable)).toLocaleString()}đ</span>
                                                    </div>
                                                    <div className="pt-3 border-t border-emerald-200 flex justify-between items-center">
                                                        <span className="font-bold text-emerald-700 text-xs uppercase tracking-wider">Tổng</span>
                                                        <span className="text-2xl font-black text-emerald-700">{calculateTotal(selectedTable).toLocaleString()}đ</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleTableAction('stop')}
                                                    className="w-full mt-4 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                >
                                                    <Square size={18} fill="currentColor" /> Thanh Toán
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
                            <div className={`p-10 rounded-[2.5rem] shadow-sm border relative overflow-hidden group hover:shadow-xl transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <span className={`font-black uppercase text-[10px] tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Tổng Thu Nhập Thực Tế</span>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <h2 className={`text-5xl font-black tracking-tighter ${darkMode ? 'text-emerald-400' : 'text-slate-800'}`}>{stats.income.toLocaleString()}đ</h2>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-500 text-sm mt-6 font-black">
                                    <TrendingUp size={18} /> <span>Dữ liệu ổn định</span>
                                </div>
                                <Wallet className="absolute -right-8 -bottom-8 w-44 h-44 text-emerald-500 opacity-[0.05] group-hover:scale-110 transition-transform duration-700" />
                            </div>

                            {isOwner && (
                                <div className={`lg:col-span-2 p-10 rounded-[2.5rem] shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <h3 className={`text-sm font-black mb-8 uppercase tracking-wider flex justify-between items-center ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                        Thống Kê Nhanh
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div
                                            onClick={() => setShowHistoryModal(true)}
                                            className={`p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform border border-transparent hover:border-emerald-500/30 shadow-sm hover:shadow-emerald-500/10 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className={`text-3xl font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{records.length}</div>
                                                <div className={`p-2 rounded-full ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}><FileSpreadsheet size={16} /></div>
                                            </div>
                                            <div className={`text-xs font-bold mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Giao dịch trong kỳ</div>
                                            <div className="text-[10px] text-emerald-500 font-bold mt-1">Bấm để xem chi tiết →</div>
                                        </div>
                                        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                            <div className={`text-3xl font-black ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{tables.filter((t: any) => t.status === 'occupied').length}</div>
                                            <div className={`text-xs font-bold mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bàn đang chơi</div>
                                        </div>
                                        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                            <div className={`text-3xl font-black ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{coaches.length}</div>
                                            <div className={`text-xs font-bold mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Huấn luyện viên</div>
                                        </div>
                                        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                                            <div className={`text-3xl font-black ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{sessions.length}</div>
                                            <div className={`text-xs font-bold mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Lịch tập trong tuần</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form & Table Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Left: Form */}
                            <div className="lg:col-span-4">
                                <div className={`p-10 rounded-[2.5rem] shadow-xl border sticky top-28 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <h3 className={`font-black text-xl mb-10 flex items-center gap-3 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div> Ghi Chép Giao Dịch
                                    </h3>
                                    <form className="space-y-6" onSubmit={handleAddTransaction}>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Hạng Mục</label>
                                            <select
                                                className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none focus:ring-2 ring-emerald-500/10 transition-all appearance-none ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-50 text-slate-700'}`}
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
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Số tiền (VNĐ)</label>
                                            <input
                                                type="text"
                                                className={`w-full p-4 border-none rounded-2xl mt-2 font-black text-xl md:text-2xl outline-none focus:ring-2 ring-emerald-500/10 transition-all ${darkMode ? 'bg-slate-700 text-emerald-400 placeholder:text-slate-500' : 'bg-slate-50 text-slate-800 placeholder:text-slate-200'}`}
                                                value={amount}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                                    setAmount(raw ? parseInt(raw).toLocaleString() : '');
                                                }}
                                                placeholder="Ví dụ: 100 = 100,000" required
                                            />
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Ngày thực hiện</label>
                                            <div className="relative w-full mt-2 group">
                                                <input
                                                    type="date"
                                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                                    value={date} onChange={(e) => setDate(e.target.value)} required
                                                />
                                                <div className={`w-full p-4 rounded-2xl font-bold flex justify-between items-center group-focus-within:ring-2 ring-emerald-500/10 transition-all ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                                                    <span>{date ? date.split('-').reverse().join('/') : 'dd/mm/yyyy'}</span>
                                                    <Calendar size={20} className={darkMode ? 'text-slate-400' : 'text-slate-400'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Họ và tên người nộp</label>
                                            <input
                                                type="text"
                                                className={`w-full p-4 border-none rounded-2xl mt-2 font-black outline-none uppercase placeholder:normal-case ${darkMode ? 'bg-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 text-slate-800'}`}
                                                value={desc} onChange={(e) => setDesc(e.target.value.toUpperCase())}
                                                placeholder="Tên khách hàng..."
                                            />
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Tên dụng cụ (nếu có)</label>
                                            <input
                                                type="text"
                                                className={`w-full p-4 border-none rounded-2xl mt-2 font-medium outline-none ${darkMode ? 'bg-slate-700 text-slate-300 placeholder:text-slate-500' : 'bg-slate-50 text-slate-600'}`}
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
                                <div className={`rounded-[2.5rem] shadow-sm border overflow-hidden min-h-[700px] flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <div className={`p-8 border-b flex justify-between items-center ${darkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                                        <div className="relative w-full max-w-sm group">
                                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-300'}`} size={18} />
                                            <input
                                                type="text"
                                                placeholder="Tìm tên khách, nội dung..."
                                                className={`w-full pl-12 pr-6 py-4 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-emerald-500/10 outline-none transition-all ${darkMode ? 'bg-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-slate-50 text-slate-800'}`}
                                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto flex-grow">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className={`text-[10px] font-black uppercase tracking-[0.15em] ${darkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-50/50 text-slate-400'}`}>
                                                    <th className="px-4 md:px-10 py-6 hidden md:table-cell">Ngày</th>
                                                    <th className="px-4 md:px-10 py-6">Hạng mục</th>
                                                    <th className="px-4 md:px-10 py-6">Dụng cụ</th>
                                                    <th className="px-4 md:px-10 py-6">Họ và tên</th>
                                                    <th className="px-4 md:px-10 py-6 text-right">Số tiền</th>
                                                    <th className="px-4 md:px-10 py-6 text-center">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                                                {records.filter((r: any) =>
                                                    r.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                                    (r.equipment_name && r.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                ).map((r: any) => (
                                                    <tr key={r.id} className={`transition-all group ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50/80'}`}>
                                                        <td className={`px-4 md:px-10 py-7 text-sm font-bold hidden md:table-cell ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                                                            {new Date(r.transaction_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 md:px-10 py-7">
                                                            <span className={`font-black block text-base ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{r.category_name}</span>
                                                            <span className="bg-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider mt-1 inline-block">Đã duyệt</span>
                                                        </td>
                                                        <td className={`px-4 md:px-10 py-7 text-sm font-medium italic line-clamp-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{r.equipment_name || '-'}</td>
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
                                                            {isOwner && (
                                                                <button
                                                                    onClick={() => { setDeleteTargetId(r.id); setShowDeleteModal(true) }}
                                                                    className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all shadow-sm"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            )}
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
                            <div id="coach-form" className={`p-10 rounded-[2.5rem] shadow-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <h3 className={`font-black text-xl mb-10 flex items-center gap-3 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    <Users size={24} className="text-emerald-500" /> {editingCoachId ? 'Cập Nhật Huấn Luyện Viên' : 'Quản Lý Huấn Luyện Viên'}
                                </h3>
                                <form className="space-y-6" onSubmit={handleAddCoach}>
                                    <div>
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Họ và tên</label>
                                        <input type="text" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={coachName} onChange={e => setCoachName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Trình độ</label>
                                        <select className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={coachLevel} onChange={e => setCoachLevel(e.target.value)}>
                                            <option value="HLV Cơ bản">HLV Cơ bản</option>
                                            <option value="HLV Nâng cao">HLV Nâng cao</option>
                                            <option value="HLV Chuyên nghiệp">HLV Chuyên nghiệp</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Học phí (VND/Buổi)</label>
                                        <input type="number" step="50000" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} placeholder="300000" value={coachFee} onChange={e => setCoachFee(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Tiền thuê bàn (VND/Giờ)</label>
                                        <input type="number" step="50000" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} placeholder="50000" value={coachTableFee} onChange={e => setCoachTableFee(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Học sinh</label>
                                            <input type="number" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} placeholder="0" value={coachStudents} onChange={e => setCoachStudents(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Số năm KN</label>
                                            <input type="number" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} placeholder="0" value={coachExp} onChange={e => setCoachExp(e.target.value)} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button type="submit" className={`flex-1 p-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl transition-all ${darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                            {editingCoachId ? 'CẬP NHẬT' : 'THÊM HLV MỚI'} <PlusCircle size={20} className={editingCoachId ? 'hidden' : ''} />
                                        </button>
                                        {editingCoachId && (
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setEditingCoachId(null);
                                                    setCoachName(''); setCoachFee(''); setCoachTableFee('');
                                                    setCoachStudents(''); setCoachExp('');
                                                }}
                                                className={`px-6 rounded-3xl font-bold flex items-center justify-center ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                            >
                                                Hủy
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className={`mt-10 border-t pt-8 ${darkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-4 block ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Danh sách HLV</label>
                                    <div className="space-y-4">
                                        {coaches.map(c => (
                                            <div key={c.id} className={`flex justify-between items-center p-4 rounded-2xl ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ background: c.color }}></div>
                                                    <div>
                                                        <div className={`text-sm font-black ${darkMode ? 'text-slate-100' : 'text-slate-700'}`}>{c.name}</div>
                                                        <div className={`text-[10px] font-bold uppercase ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{c.level}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditCoach(c)} className={`p-2 ${darkMode ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`}><Pencil size={16} /></button>
                                                    <button onClick={() => deleteTableItem('coaches', c.id)} className={`p-2 ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-300 hover:text-red-500'}`}><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            {/* Session Form */}
                            <div className={`p-10 rounded-[2.5rem] shadow-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <h3 className={`font-black text-xl mb-10 flex items-center gap-3 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    <Calendar size={24} className="text-amber-400" /> Xếp Lịch Huấn Luyện
                                </h3>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleAddSession}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Huấn luyện viên</label>
                                            <select className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={sessCoachId} onChange={e => setSessCoachId(e.target.value)} required>
                                                <option value="">-- Chọn HLV --</option>
                                                {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Số bàn</label>
                                            <select className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={sessLoc} onChange={e => setSessLoc(e.target.value)} required>
                                                <option value="">-- Chọn Bàn --</option>
                                                {[...Array(15)].map((_, i) => (
                                                    <option key={i + 1} value={`Bàn ${i + 1}`}>Bàn {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Ngày (Thứ)</label>
                                            <select className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={sessDay} onChange={e => setSessDay(e.target.value)}>
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
                                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Bắt đầu</label>
                                                <input type="time" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={sessStart} onChange={e => setSessStart(e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Kết thúc</label>
                                                <input type="time" className={`w-full p-4 border-none rounded-2xl mt-2 font-bold outline-none ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-50 text-slate-700'}`} value={sessEnd} onChange={e => setSessEnd(e.target.value)} required />
                                            </div>
                                        </div>
                                        <button type="submit" className={`w-full h-[68px] rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl transition-all mt-4 ${darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                            LƯU THỜI KHÓA BIỂU
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Sessions Table */}
                            <div className={`rounded-[2.5rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                <div className={`p-8 border-b ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-50 bg-slate-50/50'}`}>
                                    <h3 className={`font-black uppercase text-xs tracking-widest flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                        <FileSpreadsheet size={16} className="text-emerald-500" /> Bảng phân phối lịch tuần
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-50/50 text-slate-400'}`}>
                                                <th className="px-8 py-5">Thứ</th>
                                                <th className="px-8 py-5">Giờ tập</th>
                                                <th className="px-8 py-5">HLV</th>
                                                <th className="px-8 py-5">Bàn số</th>
                                                <th className="px-8 py-5 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                                            {sessions.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className={`text-center py-8 font-bold ${darkMode ? 'text-slate-500 bg-slate-700/30' : 'text-slate-400 bg-slate-50/30'}`}>
                                                        Chưa có lịch tập nào. Hãy "Lưu thời khóa biểu" ở form trên.
                                                    </td>
                                                </tr>
                                            )}
                                            {sessions.map((s: any) => (
                                                <tr key={s.id} className={`transition-colors group ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}>
                                                    <td className={`px-8 py-5 text-sm font-black ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{s.day === 'Monday' ? 'Thứ 2' : s.day === 'Tuesday' ? 'Thứ 3' : s.day === 'Wednesday' ? 'Thứ 4' : s.day === 'Thursday' ? 'Thứ 5' : s.day === 'Friday' ? 'Thứ 6' : s.day === 'Saturday' ? 'Thứ 7' : 'Chủ nhật'}</td>
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
            <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[300] flex flex-col gap-3 max-w-[calc(100vw-2rem)]">
                {toasts.map(t => (
                    <div key={t.id} className={`bg-white px-5 py-4 rounded-2xl shadow-2xl border-l-4 ${t.type === 'error' ? 'border-rose-500' : t.type === 'warning' ? 'border-amber-500' : 'border-emerald-500'} flex items-center gap-3 animate-slide-in`}>
                        <div className={`${t.type === 'error' ? 'text-rose-500 bg-rose-50' : t.type === 'warning' ? 'text-amber-500 bg-amber-50' : 'text-emerald-500 bg-emerald-50'} p-2 rounded-full flex-shrink-0`}>
                            {t.type === 'error' ? <AlertTriangle size={18} /> : t.type === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{t.msg}</span>
                    </div>
                ))}
            </div>

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <div className={`fixed bottom-0 left-0 right-0 pb-safe pt-2 px-4 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.15)] z-[100] md:hidden transition-colors ${darkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-slate-100'}`}>
                <div className="flex justify-around items-center h-16 max-w-md mx-auto gap-2">
                    <button
                        onClick={() => setActiveTab('finance')}
                        className={`flex flex-col items-center justify-center w-16 transition-colors ${activeTab === 'finance' ? 'text-emerald-500' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}
                    >
                        <Wallet size={24} strokeWidth={activeTab === 'finance' ? 2.5 : 2} />
                        <span className="text-[10px] font-bold mt-1">Tài chính</span>
                    </button>
                    
                    {/* Highlighted 'Tables' Button */}
                    <button
                        onClick={() => setActiveTab('tables')}
                        className={`flex flex-col items-center justify-center w-16 h-16 -mt-6 rounded-full border-4 shadow-xl transition-all ${
                            activeTab === 'tables' 
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-white text-white shadow-emerald-500/30 scale-110' 
                            : darkMode 
                                ? 'bg-slate-700 border-slate-800 text-slate-400' 
                                : 'bg-white border-slate-50 text-slate-400'
                        }`}
                    >
                        <LayoutDashboard size={24} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold mt-0.5">Bàn</span>
                    </button>

                    {isOwner && (
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`flex flex-col items-center justify-center w-16 transition-colors ${activeTab === 'schedule' ? 'text-emerald-500' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}
                        >
                            <Calendar size={24} strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
                            <span className="text-[10px] font-bold mt-1">Lịch tập</span>
                        </button>
                    )}
                </div>
            </div>
            {/* --- TRANSACTION HISTORY MODAL (PC + MOBILE RESPONSIVE) --- */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-10">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}></div>
                    <div className={`relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                        {/* Header */}
                        <div className={`p-6 md:p-8 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                            <div>
                                <h3 className={`text-xl font-black flex items-center gap-3 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                    <FileSpreadsheet className="text-emerald-500" /> Lịch Sử Giao Dịch
                                </h3>
                                <p className={`text-xs font-bold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                                    Tổng: {records.length} giao dịch • {records.reduce((acc: number, r: any) => acc + Number(r.amount), 0).toLocaleString()}đ
                                </p>
                            </div>
                            <button onClick={() => setShowHistoryModal(false)} className={`p-3 rounded-full hover:rotate-90 transition-all ${darkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                <CloseIcon size={24} />
                            </button>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            {records.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 opacity-60">
                                    <FileSpreadsheet size={48} className="mb-4" />
                                    <p className="font-bold">Chưa có giao dịch nào</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mobile View: Cards */}
                                    <div className="md:hidden space-y-3">
                                        {records.map((r: any) => (
                                            <div key={r.id} className={`p-4 rounded-2xl border flex flex-col gap-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500'}`}>
                                                            {r.category_name || 'Khác'}
                                                        </span>
                                                        <h4 className={`text-lg font-black mt-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                            +{parseFloat(r.amount).toLocaleString()}
                                                        </h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {new Date(r.transaction_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className={`text-[10px] font-bold ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                                            {new Date(r.transaction_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`h-px w-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200/50'}`}></div>

                                                <div className="flex justify-between items-end">
                                                    <div className="flex-1 mr-4">
                                                        <p className={`text-xs font-medium line-clamp-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                            {r.description || 'Không có ghi chú'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-bold">
                                                            {r.creator_name ? r.creator_name.charAt(0) : 'S'}
                                                        </div>
                                                        <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {r.creator_name || 'System'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* PC View: Table */}
                                    <div className="hidden md:block">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className={`text-[10px] uppercase tracking-wider font-black ${darkMode ? 'text-slate-500 border-b border-slate-800' : 'text-slate-400 border-b border-slate-100'}`}>
                                                    <th className="pb-4 pl-4">Thời gian</th>
                                                    <th className="pb-4">Nội dung</th>
                                                    <th className="pb-4">Phân loại</th>
                                                    <th className="pb-4 text-right">Số tiền</th>
                                                    <th className="pb-4 pr-4 text-right">Người tạo</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                                {records.map((r: any) => (
                                                    <tr key={r.id} className={`group transition-colors ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                                        <td className="py-4 pl-4">
                                                            <div className={`font-bold text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                                {new Date(r.transaction_date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                {new Date(r.transaction_date).toLocaleDateString('vi-VN')}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 max-w-[250px]">
                                                            <div className={`text-sm font-medium truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{r.description}</div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                                {r.category_name}
                                                            </span>
                                                        </td>
                                                        <td className={`py-4 text-right font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                            {parseFloat(r.amount).toLocaleString()}
                                                        </td>
                                                        <td className="py-4 pr-4 text-right">
                                                            <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                {r.creator_name || 'System'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
