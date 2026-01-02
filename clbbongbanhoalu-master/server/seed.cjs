
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
});

const sqlStatements = `
CREATE DATABASE IF NOT EXISTS clb_bongbanhoalu_admin;
USE clb_bongbanhoalu_admin;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

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

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('THU', 'CHI') NOT NULL,
    description TEXT
);

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(15, 2) NOT NULL,
    category_id INT(11) NOT NULL,
    description TEXT NOT NULL,
    proof_image VARCHAR(255) NOT NULL,
    created_by INT(11) NOT NULL,
    status ENUM('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'NGUNG_HIEU_LUC') DEFAULT 'CHO_DUYET',
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT(11) NOT NULL,
    actor_id INT(11) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (actor_id) REFERENCES users(id)
);

INSERT INTO categories (name, type) VALUES 
('Phí hội viên', 'THU'), ('Tài trợ', 'THU'), ('Bán áo CLB', 'THU'),
('Mua dụng cụ', 'CHI'), ('Thuê sân', 'CHI'), ('Tổ chức giải', 'CHI');

INSERT INTO users (username, password_hash, full_name, role) VALUES 
('admin', '123456', 'Chủ Nhiệm CLB', 'CHUNHIEM'),
('thuquy', '123456', 'Thủ Quỹ Hoa Lư', 'THUQUY');
`;

console.log("Dang khoi tao database...");

db.query(sqlStatements, (err, results) => {
    if (err) {
        console.error("Loi khi tao database:", err);
        process.exit(1);
    }
    console.log("Tao database va bang thanh cong!");
    console.log("Tai khoan Admin mac dinh: admin / 123456");
    db.end();
});
