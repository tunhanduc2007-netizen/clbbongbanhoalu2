const API_URL = `http://${window.location.hostname}:3005/api`;

// --- CONFIG & STATE ---
let lineChartInstance = null;
let currentPage = 1;
let priceMap = {};
let currentDeleteId = null;

// --- INITIALIZATION ---
async function initApp() {
    await loadCategories();
    updateDashboard(); // Stats & Chart
    loadRecords(1);    // Table
    initCurrencyMask();
    initSearch();
}

// --- CORE: STATS & CHART ---
async function updateDashboard() {
    const range = document.getElementById('timeRange').value;
    const { start, end } = getDateRange(range);

    // Update UI Subtitle
    const rangeTexts = {
        'today': 'Hôm nay',
        'week': 'Tuần này',
        'month': 'Tháng này',
        'lastMonth': 'Tháng trước',
        'year': 'Năm nay'
    };
    document.getElementById('currentRangeText').textContent = rangeTexts[range];

    try {
        const res = await fetch(`${API_URL}/dashboard/summary?start=${start}&end=${end}`);
        const summary = await res.json();

        animateValue("totalIncome", summary.income || 0);
        loadChart();
    } catch (e) {
        console.error("Dashboard error:", e);
    }
}

async function loadChart() {
    try {
        const res = await fetch(`${API_URL}/dashboard/chart-series`);
        const data = await res.json();

        const ctx = document.getElementById('lineChart').getContext('2d');
        if (lineChartInstance) lineChartInstance.destroy();

        lineChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(i => i.month),
                datasets: [{
                    label: 'Doanh Thu',
                    data: data.map(i => i.income),
                    backgroundColor: '#7AC943',
                    borderRadius: 8,
                    borderSkipped: false,
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
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 14 },
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => `Doanh thu: ${ctx.raw.toLocaleString()} đ`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
                        ticks: { callback: (val) => val.toLocaleString() + ' đ' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (e) { console.error(e); }
}

// --- TABLE & DATA ---
async function loadRecords(page = 1) {
    currentPage = page;
    const search = document.getElementById('searchInput').value;
    const range = document.getElementById('timeRange').value;
    const { start, end } = getDateRange(range);

    try {
        const res = await fetch(`${API_URL}/transactions?page=${page}&search=${search}&start=${start}&end=${end}`);
        const data = await res.json();

        const tbody = document.getElementById('transTableBody');
        tbody.innerHTML = '';

        data.rows.forEach(t => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(t.transaction_date).toLocaleDateString()}</td>
                <td><span class="font-bold">${t.category_name}</span></td>
                <td style="color: var(--text-muted); font-size: 0.8rem;">${t.description || '-'}</td>
                <td><span class="font-medium">${t.creator_name}</span></td>
                <td class="text-right" style="font-weight: 800; color: var(--accent); font-size: 1rem;">
                    +${parseFloat(t.amount).toLocaleString()} đ
                </td>
                <td class="text-center">
                    <span class="badge ${t.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}">
                        ${t.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                </td>
                <td class="text-center">
                    <button onclick="showDeleteConfirm(${t.id})" class="action-btn">
                        <i data-lucide="trash-2" size="18"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        lucide.createIcons();
        renderPagination(data.total, data.limit, data.page);
    } catch (e) { console.error(e); }
}

function renderPagination(total, limit, current) {
    const pages = Math.ceil(total / limit);
    const div = document.getElementById('pagination');
    div.innerHTML = '';

    if (pages <= 1) return;

    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `page-btn ${i === current ? 'active' : ''}`;
        btn.onclick = () => loadRecords(i);
        div.appendChild(btn);
    }
}

// --- FORM HANDLING ---
const transForm = document.getElementById('transForm');
transForm.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const amountStr = document.getElementById('amountInput').value.replace(/\./g, "");

    const payload = {
        category_id: document.getElementById('catSelect').value,
        amount: parseFloat(amountStr),
        transaction_date: document.getElementById('transDate').value,
        description: document.getElementById('description').value,
        created_by: JSON.parse(localStorage.getItem('adminUser')).id
    };

    // UI Loading
    btn.disabled = true;
    btn.classList.add('loading');

    try {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast("Thêm giao dịch thành công!");
            transForm.reset();
            document.getElementById('transDate').valueAsDate = new Date();
            initApp();
        } else {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    } catch (e) {
        alert("Không thể kết nối Backend!");
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
};

// --- EXPORTS ---
async function exportToExcel() {
    const range = document.getElementById('timeRange').value;
    const { start, end } = getDateRange(range);
    const res = await fetch(`${API_URL}/transactions?limit=1000&start=${start}&end=${end}`);
    const data = await res.json();

    const wsData = [
        ["NGÀY GIAO DỊCH", "HẠNG MỤC", "MÔ TẢ", "NGƯỜI TẠO", "SỐ TIỀN", "TRẠNG THÁI"],
        ...data.rows.map(r => [
            new Date(r.transaction_date).toLocaleDateString(),
            r.category_name,
            r.description || "-",
            r.creator_name,
            parseFloat(r.amount),
            r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'
        ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "BaoCaoThuChi");
    XLSX.writeFile(wb, `BaoCao_HoaLu_${new Date().toISOString().split('T')[0]}.xlsx`);
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const range = document.getElementById('timeRange').value;
    const { start, end } = getDateRange(range);
    const res = await fetch(`${API_URL}/transactions?limit=1000&start=${start}&end=${end}`);
    const data = await res.json();

    doc.setFont("Inter", "bold");
    doc.text("CLB BONG BAN HOA LU - BAO CAO TAI CHINH", 14, 15);
    doc.setFontSize(10);
    doc.text(`Ngay xuat: ${new Date().toLocaleString()}`, 14, 22);

    const columns = ["Ngay", "Hang muc", "Mo ta", "Nguoi tao", "So tien", "Trang thai"];
    const rows = data.rows.map(r => [
        new Date(r.transaction_date).toLocaleDateString(),
        r.category_name,
        r.description || "-",
        r.creator_name,
        parseFloat(r.amount).toLocaleString() + " d",
        r.status
    ]);

    doc.autoTable({
        startY: 30,
        head: [columns],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save(`BaoCao_HoaLu_${new Date().toISOString().split('T')[0]}.pdf`);
}

// --- UTILS ---
function animateValue(id, value) {
    const obj = document.getElementById(id);
    obj.textContent = new Intl.NumberFormat('vi-VN').format(value) + " đ";
}

function getDateRange(range) {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (range === 'today') {
        // Today
    } else if (range === 'week') {
        start.setDate(now.getDate() - now.getDay());
    } else if (range === 'month') {
        start.setDate(1);
    } else if (range === 'lastMonth') {
        start.setMonth(now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (range === 'year') {
        start.setMonth(0, 1);
    }

    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
}

function initCurrencyMask() {
    const input = document.getElementById('amountInput');
    input.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, "");
        if (val) e.target.value = new Intl.NumberFormat('vi-VN').format(val);
    });
}

function initSearch() {
    const input = document.getElementById('searchInput');
    let timeout;
    input.onkeyup = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => loadRecords(1), 500);
    };
}

async function loadCategories() {
    const res = await fetch(`${API_URL}/categories`);
    const cats = await res.json();
    const select = document.getElementById('catSelect');
    select.innerHTML = '<option value="">-- Chọn hạng mục --</option>';
    cats.forEach(c => {
        if (c.type === 'expense') return;
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${parseInt(c.default_amount).toLocaleString()} đ)`;
        select.appendChild(opt);
        priceMap[c.id] = c.default_amount;
    });
    select.onchange = (e) => {
        const p = priceMap[e.target.value];
        if (p > 0) document.getElementById('amountInput').value = new Intl.NumberFormat('vi-VN').format(p);
    };
}

// --- UI HELPERS ---
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" style="color:var(--success)"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => toast.classList.add('active'), 100);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function toggleProfileModal() {
    document.getElementById('profileModal').classList.toggle('active');
}

function showDeleteConfirm(id) {
    currentDeleteId = id;
    document.getElementById('confirmModal').classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

document.getElementById('confirmDeleteBtn').onclick = async () => {
    if (!currentDeleteId) return;
    await fetch(`${API_URL}/transactions/${currentDeleteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: 0 })
    });
    closeModal('confirmModal');
    showToast("Đã xóa giao dịch!");
    initApp();
};

function handleTimeFilterChange() {
    initApp();
}

function handleLogout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('adminUser', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.textContent = "Sai tài khoản hoặc mật khẩu!";
            }
        } catch (err) {
            errorMsg.textContent = "Lỗi kết nối Server (Cổng 3005)!";
        }
    };
}

// Check session on dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const savedUser = localStorage.getItem('adminUser');
    if (!savedUser) {
        window.location.href = 'login.html';
    } else {
        initApp();
    }
}
