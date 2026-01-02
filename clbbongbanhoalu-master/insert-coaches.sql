-- Tạo bảng coaches nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS coaches (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    hourly_rate INTEGER,
    trial_rate INTEGER,
    rating DECIMAL(2,1) DEFAULT 5.0,
    students_count INTEGER DEFAULT 0,
    experience INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    avatar VARCHAR(255),
    schedule JSONB,
    additional_schedule VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert HLV data into coaches table
INSERT INTO coaches (name, hourly_rate, trial_rate, rating, students_count, experience, is_featured, schedule, additional_schedule) VALUES 
(
    'Võ Hoàng Nhật Sơn',
    250000,
    50000,
    5.0,
    8,
    5,
    true,
    '{"T2-T6": "16:00 - 20:00", "T6": "07:00 - 08:30"}',
    '+1 lịch khác'
),
(
    'Văn Huỳnh Phương Huy',
    230000,
    50000,
    5.0,
    6,
    4,
    true,
    '{"T3": "10:00 - 20:00", "T5": "18:00 - 20:00"}',
    '+2 lịch khác'
),
(
    'Trần Thị Ngọc Thơ',
    200000,
    50000,
    5.0,
    5,
    3,
    true,
    '{"T2, T4, T6": "7:00, 8:00, 9:00, 9:30", "T3, T7": "6:00 - 7:30"}',
    NULL
),
(
    'Võ Kỳ Long',
    250000,
    50000,
    5.0,
    7,
    6,
    false,
    '{"T2, T4, T6": "17:30 - 20:30", "T7": "09:30 - 16:30"}',
    '+1 lịch khác'
);
