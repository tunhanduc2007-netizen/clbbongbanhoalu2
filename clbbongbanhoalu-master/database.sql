-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS clb_bongban_hoalu;
USE clb_bongban_hoalu;

-- 1. Bảng Người dùng (Phân quyền)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('CHUNHIEM', 'THUQUY', 'THANHVIEN') DEFAULT 'THANHVIEN',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Danh mục Thu/Chi
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('THU', 'CHI') NOT NULL, -- THU: Phí hội viên, Tài trợ... | CHI: Mua đồ, Thuê sân...
    description TEXT
);

-- 3. Bảng Giao dịch (Thu/Chi)
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(15, 2) NOT NULL, -- Số tiền
    category_id INT(11) NOT NULL,
    description TEXT NOT NULL, -- Mục đích/Nội dung
    proof_image VARCHAR(255) NOT NULL, -- Đường dẫn ảnh hóa đơn/biên lai (BẮT BUỘC)
    created_by INT(11) NOT NULL, -- Người tạo
    status ENUM('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'NGUNG_HIEU_LUC') DEFAULT 'CHO_DUYET',
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 4. Bảng Lịch sử Chỉnh sửa (Audit Log - Minh bạch tuyệt đối)
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT(11) NOT NULL,
    actor_id INT(11) NOT NULL, -- Người thực hiện sửa
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, SOFT_DELETE
    old_value JSON, -- Dữ liệu cũ (Lưu dạng JSON)
    new_value JSON, -- Dữ liệu mới
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Dữ liệu mẫu (Seed Data)
INSERT INTO categories (name, type) VALUES 
('Phí hội viên', 'THU'), ('Tài trợ', 'THU'), ('Bán áo CLB', 'THU'),
('Mua dụng cụ', 'CHI'), ('Thuê sân', 'CHI'), ('Tổ chức giải', 'CHI');

-- Tài khoản Admin mặc định (Pass: 123456 - Cần hash khi deploy thật)
INSERT INTO users (username, password_hash, full_name, role) VALUES 
('admin', '123456', 'Chủ Nhiệm CLB', 'CHUNHIEM'),
('thuquy', '123456', 'Thủ Quỹ Hoa Lư', 'THUQUY');
