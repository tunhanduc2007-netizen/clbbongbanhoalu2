// ===========================================
// UTILITY FUNCTIONS - Business Logic Helpers
// ===========================================

// --- Currency Formatting ---
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
};

// --- Time Formatting ---
export const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
};

// --- Duration from start time ---
export const formatDuration = (startTime: string | null, currentTime: Date): string => {
    if (!startTime) return '00:00:00';
    const start = new Date(startTime).getTime();
    const now = currentTime.getTime();
    const diffMs = Math.max(0, now - start);
    return new Date(diffMs).toISOString().substr(11, 8);
};

// --- Pricing Logic ---
// QUAN TRỌNG: Giá cố định 40,000 VND / người / lượt
export const PRICE_PER_PERSON = 40000;

export const calculatePrice = (playerCount: number): number => {
    // Logic: 40,000 VND per person per session (unlimited time)
    return playerCount * PRICE_PER_PERSON;
};

// --- Admin Config (CMS-style) ---
// Cho phép admin tùy chỉnh sau này
export const ADMIN_CONFIG = {
    // Số bàn mặc định
    DEFAULT_TABLE_COUNT: 15,

    // Giá tiền
    PRICE_PER_PERSON: 40000,

    // Giá thuê theo giờ (cho bàn >= 10)
    HOURLY_RATE: 70000,

    // Giá lượt chơi (cho bàn < 10)
    SESSION_RATE: 40000,

    // Dịch vụ bổ sung
    ADDITIONAL_SERVICES: [
        { name: 'Sting', price: 15000, icon: 'coffee' },
        { name: 'Nước suối', price: 10000, icon: 'water' },
        { name: 'Revive', price: 15000, icon: 'bottle' },
        { name: 'Thuê vợt', price: 20000, icon: 'racket' },
        { name: 'Bóng', price: 130000, icon: 'ball' },
    ],

    // Theme colors
    THEME: {
        primary: '#10b981', // emerald-500
        primaryDark: '#059669', // emerald-600
        secondary: '#1e293b', // slate-800
        accent: '#fbbf24', // yellow-400
    },
};

// --- Table Status Types ---
export type TableStatus = 'available' | 'occupied' | 'paused' | 'reserved';

export interface TableData {
    id: number | string;
    table_number: number;
    status: TableStatus;
    player_name?: string;
    start_time?: string | null;
    services?: Array<{
        item: string;
        price: number;
        qty: number;
    }>;
    player_count?: number;
    accumulated_duration?: number;
}

// --- Calculate table fee based on table number and player count ---
export const calculateTableFee = (table: TableData, currentTime: Date): number => {
    if (!table || table.status === 'available') return 0;

    // Bàn 10+ tính tiền giờ (70k/h)
    // Bàn 1-9 tính tiền lượt: 40k × số người chơi
    if (table.table_number >= 10) {
        const hours = getDuration(table.start_time, currentTime);
        return Math.floor(hours * ADMIN_CONFIG.HOURLY_RATE);
    }

    // 40,000 VND × số người chơi (mặc định 2 người nếu không có)
    const playerCount = table.player_count || 2;
    return playerCount * ADMIN_CONFIG.PRICE_PER_PERSON;
};

// --- Get duration in hours ---
export const getDuration = (startTime: string | null | undefined, currentTime: Date): number => {
    if (!startTime) return 0;
    const start = new Date(startTime).getTime();
    const now = currentTime.getTime();
    return Math.max(0, (now - start) / 1000 / 3600); // hours
};

// --- Calculate total including services ---
export const calculateTotal = (table: TableData, currentTime: Date): number => {
    if (!table || table.status === 'available') return 0;

    const tableFee = calculateTableFee(table, currentTime);
    const serviceTotal = (table.services || []).reduce((sum, s) => sum + (s.price * s.qty), 0);
    return tableFee + serviceTotal;
};

// --- Format input currency ---
export const formatInputCurrency = (val: string | number): string => {
    if (!val) return "";
    const digits = val.toString().replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat('vi-VN').format(parseInt(digits));
};

// --- Date Range Calculator ---
export const calculateDateRange = (range: string) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    let start = new Date(y, m, 1);
    let end = new Date(y, m + 1, 0);

    if (range === 'today') {
        start = now; end = now;
    } else if (range === 'day') {
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
