CREATE DATABASE IF NOT EXISTS clb_admin_standalone;
USE clb_admin_standalone;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  full_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  category_id INT,
  created_by INT,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(50),
  table_name VARCHAR(50),
  record_id INT,
  old_data JSON,
  new_data JSON,
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_by INT
);

-- Seed Data
INSERT INTO users (username, password_hash, role, full_name) VALUES 
('admin', '123456', 'chu_nhiem', 'Chủ Nhiệm'),
('thuquy', '123456', 'thu_quy', 'Thủ Quỹ')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO categories (name, type) VALUES 
('Phí hội viên', 'income'),
('Tài trợ', 'income'),
('Bán áo', 'income'),
('Mua bóng', 'expense'),
('Thuê sân', 'expense'),
('Giải thưởng', 'expense');
