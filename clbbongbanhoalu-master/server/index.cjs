
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clb_bongbanhoalu_admin'
});

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'evidence-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username=? AND password_hash=?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            // Trả về thông tin user (trừ password)
            const { password_hash, ...userData } = result[0];
            res.json(userData);
        } else {
            res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }
    });
});

app.get('/api/dashboard', (req, res) => {
    const sql = `
    SELECT 
      SUM(CASE WHEN c.type = 'THU' AND t.status = 'DA_DUYET' THEN t.amount ELSE 0 END) as total_income,
      SUM(CASE WHEN c.type = 'CHI' AND t.status = 'DA_DUYET' THEN t.amount ELSE 0 END) as total_expense
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        const income = results[0].total_income || 0;
        const expense = results[0].total_expense || 0;
        res.json({
            income,
            expense,
            balance: income - expense
        });
    });
});

app.get('/api/transactions', (req, res) => {
    const sql = `
    SELECT t.*, c.name as category_name, c.type as category_type, u.full_name as creator_name
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    JOIN users u ON t.created_by = u.id
    ORDER BY t.transaction_date DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/transactions', upload.single('proof'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Bắt buộc phải có ảnh minh chứng!' });

    const { amount, category_id, description, created_by } = req.body;
    const proof_image = '/uploads/' + req.file.filename;

    const sql = `INSERT INTO transactions (amount, category_id, description, proof_image, created_by) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [amount, category_id, description, proof_image, created_by], (err, result) => {
        if (err) return res.status(500).json(err);

        const logSql = `INSERT INTO audit_logs (transaction_id, actor_id, action_type, new_value) VALUES (?, ?, 'CREATE', ?)`;
        const logData = JSON.stringify({ amount, category_id, description, proof_image });
        db.query(logSql, [result.insertId, created_by, logData]);

        res.json({ message: 'Thêm giao dịch thành công!', id: result.insertId });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
