import React from 'react';

// ===========================================
// REUSABLE UI COMPONENTS - Mobile-First Design System
// Theme: Emerald Green + Slate Gray
// ===========================================

// --- Card Component ---
interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'glass' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    variant = 'default'
}) => {
    const variants = {
        default: 'bg-white rounded-2xl shadow-sm border border-slate-100',
        glass: 'bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-white/20',
        elevated: 'bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100',
    };

    return (
        <div
            onClick={onClick}
            className={`${variants[variant]} ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
        >
            {children}
        </div>
    );
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100";

    const variants = {
        primary: "bg-emerald-600 text-white shadow-emerald-200 shadow-lg hover:bg-emerald-700",
        secondary: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-50",
        dark: "bg-slate-800 text-white shadow-slate-300 shadow-lg hover:bg-slate-900",
    };

    const sizes = {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-base",
        lg: "h-14 px-6 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

// --- Bottom Sheet Modal ---
interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex justify-center items-end sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Content */}
            <div className="bg-white w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 shadow-2xl relative z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
                <h2 className="text-xl font-black text-slate-800 mb-6">{title}</h2>
                <div className="mb-6">
                    {children}
                </div>
                {footer && (
                    <div className="pt-2 sticky bottom-0 bg-white">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Stats Card ---
interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: 'emerald' | 'blue' | 'orange' | 'purple';
    trend?: 'up' | 'down' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    color = 'emerald',
}) => {
    const colors = {
        emerald: 'text-emerald-600 bg-emerald-50',
        blue: 'text-blue-600 bg-blue-50',
        orange: 'text-orange-600 bg-orange-50',
        purple: 'text-purple-600 bg-purple-50',
    };

    return (
        <Card className="min-w-[140px] p-4 flex flex-col justify-between h-28 snap-center">
            <div className={`flex items-center gap-2 ${colors[color].split(' ')[0]} mb-2`}>
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
            </div>
            <div className="text-2xl font-black text-slate-800">{value}</div>
        </Card>
    );
};

// --- Table Card (For Table Manager) ---
interface TableCardProps {
    tableNumber: number;
    status: 'available' | 'occupied' | 'paused';
    playerName?: string;
    duration?: string;
    playerCount?: number;
    price?: number;
    isSelected?: boolean;
    onClick?: () => void;
}

export const TableCard: React.FC<TableCardProps> = ({
    tableNumber,
    status,
    playerName,
    duration,
    playerCount,
    price,
    isSelected,
    onClick,
}) => {
    const statusStyles = {
        available: 'bg-white border-slate-100 hover:border-emerald-200',
        occupied: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-200',
        paused: 'bg-amber-50 border-amber-200',
    };

    const statusDot = {
        available: 'bg-slate-300',
        occupied: 'bg-white animate-pulse',
        paused: 'bg-amber-400',
    };

    const statusLabels = {
        available: 'Sẵn sàng',
        occupied: 'Đang chơi',
        paused: 'Tạm dừng',
    };

    return (
        <div
            onClick={onClick}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer
                ${statusStyles[status]}
                ${isSelected ? 'ring-4 ring-offset-2 ring-blue-500 scale-105 z-10' : 'hover:scale-[1.02]'}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <span className={`text-2xl font-black tracking-tight ${status === 'occupied' ? 'text-white' : 'text-slate-700'}`}>
                    {tableNumber < 10 ? `0${tableNumber}` : tableNumber}
                </span>
                <div className={`w-3 h-3 rounded-full ${statusDot[status]}`} />
            </div>

            {/* Content */}
            <div className="min-h-[60px]">
                {status === 'occupied' && (
                    <>
                        <div className="text-sm text-emerald-100 truncate mb-1">
                            {playerName || 'Khách'}
                        </div>
                        <div className="text-2xl font-black text-white font-mono tracking-wider">
                            {duration || '00:00'}
                        </div>
                        {playerCount && price !== undefined && (
                            <div className="text-xs text-emerald-100 mt-2">
                                {playerCount} người · {price.toLocaleString()}đ
                            </div>
                        )}
                    </>
                )}
                {status === 'paused' && (
                    <>
                        <div className="text-sm text-amber-700 truncate mb-1">
                            {playerName || 'Khách'}
                        </div>
                        <div className="text-xl font-bold text-amber-600 font-mono">
                            {duration || '00:00'}
                        </div>
                    </>
                )}
                {status === 'available' && (
                    <div className="flex flex-col items-center justify-center text-slate-300 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {statusLabels[status]}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Bottom Navigation (Mobile) ---
interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface BottomNavProps {
    items: NavItem[];
    current: string;
    onChange: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, current, onChange }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-2 px-4 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-40 md:hidden">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
            {items.map((item) => {
                const isActive = current === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onChange(item.id)}
                        className={`flex flex-col items-center justify-center w-16 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                    >
                        <div className={isActive ? 'scale-110' : ''}>{item.icon}</div>
                        <span className="text-[10px] font-bold mt-1">{item.label}</span>
                    </button>
                );
            })}
        </div>
    </div>
);

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => (
    <div className="w-full">
        {label && (
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                {label}
            </label>
        )}
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </div>
            )}
            <input
                className={`w-full p-4 ${icon ? 'pl-12' : ''} bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 ring-emerald-500/20 transition-all ${className}`}
                {...props}
            />
        </div>
    </div>
);

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
    <div className="w-full">
        {label && (
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                {label}
            </label>
        )}
        <select
            className={`w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 ring-emerald-500/20 transition-all appearance-none ${className}`}
            {...props}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// --- Toast Notification ---
interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
    const colors = {
        success: 'border-emerald-500 bg-emerald-50 text-emerald-700',
        error: 'border-rose-500 bg-rose-50 text-rose-700',
        warning: 'border-amber-500 bg-amber-50 text-amber-700',
    };

    return (
        <div className={`px-5 py-4 rounded-2xl shadow-xl border-l-4 ${colors[type]} animate-slide-in font-bold flex items-center gap-3`}>
            <span>{message}</span>
        </div>
    );
};
