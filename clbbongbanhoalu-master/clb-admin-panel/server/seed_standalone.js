const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

const sqlStatements = `
CREATE DATABASE IF NOT EXISTS clb_admin_standalone;
USE clb_admin_standalone;

-- Drop tables to reset schema for new requirements
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  full_name VARCHAR(100)
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  default_amount DECIMAL(15, 2) DEFAULT 0 -- Column to store fixed prices
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  category_id INT,
  created_by INT,
  proof_image VARCHAR(255),
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  is_active BOOLEAN DEFAULT TRUE,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(50),
  table_name VARCHAR(50),
  record_id INT,
  old_data JSON,
  new_data JSON,
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_by INT
);

INSERT INTO users (username, password_hash, role, full_name) VALUES 
('admin', '123456', 'chu_nhiem', 'Chủ Nhiệm'),
('thuquy', '123456', 'thu_quy', 'Thủ Quỹ');

INSERT INTO categories (name, type, default_amount) VALUES 
('Vé Lượt', 'income', 40000),
('Thuê Bàn (1 Giờ)', 'income', 60000),
('Hội Viên (Tháng)', 'income', 700000),
('Chi Phí Khác', 'expense', 0);
`;

console.log("Bat dau cap nhat database...");
db.connect(err => {
  if (err) {
    console.error("Ket noi MySQL that bai", err);
    process.exit(1);
  }
  db.query(sqlStatements, (err, result) => {
    if (err) {
      console.error("Loi update bang:", err);
      process.exit(1);
    }
    console.log("Cap nhat Database & Gia tien mac dinh THANH CONG!");
    process.exit(0);
  });
});
