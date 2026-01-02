const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// DB Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "clb_admin_standalone"
});

db.connect(err => {
    if (err) {
        console.error("Lỗi kết nối MySQL:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// API Routes

// 1. Dashboard Stats & Charts Data
app.get("/api/dashboard/summary", (req, res) => {
    const { start, end } = req.query;
    let dateFilter = "WHERE is_active = 1 ";
    const params = [];

    if (start && end) {
        dateFilter += " AND transaction_date BETWEEN ? AND ?";
        params.push(start + " 00:00:00", end + " 23:59:59");
    }

    const sql = `
        SELECT 
            SUM(CASE WHEN c.type = 'income' AND t.status = 'APPROVED' THEN t.amount ELSE 0 END) as total_income,
            SUM(CASE WHEN c.type = 'expense' AND t.status = 'APPROVED' THEN t.amount ELSE 0 END) as total_expense
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        ${dateFilter}
    `;

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);
        const income = results[0].total_income || 0;
        const expense = results[0].total_expense || 0;
        res.json({ income, expense, balance: income - expense });
    });
});

// 2. Chart Data: Income vs Expense by Month
app.get("/api/dashboard/chart-series", (req, res) => {
    const sql = `
        SELECT 
            DATE_FORMAT(transaction_date, '%Y-%m') as month,
            SUM(CASE WHEN c.type = 'income' AND t.status = 'APPROVED' THEN t.amount ELSE 0 END) as income,
            SUM(CASE WHEN c.type = 'expense' AND t.status = 'APPROVED' THEN t.amount ELSE 0 END) as expense
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.is_active = 1
        GROUP BY month
        ORDER BY month ASC
        LIMIT 12
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 3. Chart Data: Expense by Category (Pie Chart)
app.get("/api/dashboard/chart-pie", (req, res) => {
    const sql = `
        SELECT c.name, SUM(t.amount) as value
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE c.type = 'expense' AND t.status = 'APPROVED' AND t.is_active = 1
        GROUP BY c.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 4. Enhanced Transactions List (Search, Filter, Pagination)
app.get("/api/transactions", (req, res) => {
    const { page = 1, limit = 10, search = '', type = '', start = '', end = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE t.is_active = 1";
    const params = [];

    if (search) {
        whereClause += " AND (t.description LIKE ? OR u.full_name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }
    if (type) {
        whereClause += " AND c.type = ?";
        params.push(type);
    }
    if (start && end) {
        whereClause += " AND t.transaction_date BETWEEN ? AND ?";
        params.push(start + " 00:00:00", end + " 23:59:59");
    }

    const countSql = `SELECT COUNT(*) as total FROM transactions t JOIN categories c ON t.category_id = c.id JOIN users u ON t.created_by = u.id ${whereClause}`;
    const dataSql = `
        SELECT t.*, c.name as category_name, c.type as category_type, u.full_name as creator_name
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        JOIN users u ON t.created_by = u.id
        ${whereClause}
        ORDER BY t.transaction_date DESC
        LIMIT ? OFFSET ?
    `;

    db.query(countSql, params, (err, countResult) => {
        if (err) return res.status(500).json(err);
        const total = countResult[0].total;

        db.query(dataSql, [...params, parseInt(limit), parseInt(offset)], (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json({ total, rows, page: parseInt(page), limit: parseInt(limit) });
        });
    });
});

// 5. Add Transaction
app.post("/api/transactions", (req, res) => {
    const { amount, description, category_id, created_by, transaction_date } = req.body;
    const sql = "INSERT INTO transactions (amount, description, category_id, created_by, transaction_date) VALUES (?, ?, ?, ?, ?)";
    const dateValue = transaction_date || new Date();

    db.query(sql, [amount, description, category_id, created_by, dateValue], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Thêm thành công", id: result.insertId });
    });
});

// 6. Update / Soft Delete Transaction
app.put("/api/transactions/:id", (req, res) => {
    const { id } = req.params;
    const { status, is_active, amount, description, category_id } = req.body;

    let sql = "UPDATE transactions SET ";
    const fields = [];
    const params = [];

    if (status !== undefined) { fields.push("status = ?"); params.push(status); }
    if (is_active !== undefined) { fields.push("is_active = ?"); params.push(is_active); }
    if (amount !== undefined) { fields.push("amount = ?"); params.push(amount); }
    if (description !== undefined) { fields.push("description = ?"); params.push(description); }
    if (category_id !== undefined) { fields.push("category_id = ?"); params.push(category_id); }

    if (fields.length === 0) return res.json({ message: "No changes" });

    sql += fields.join(", ") + " WHERE id = ?";
    params.push(id);

    db.query(sql, params, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cập nhật thành công" });
    });
});

// Login & Categories
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password_hash = ?", [username, password], (err, results) => {
        if (results && results.length > 0) res.json(results[0]);
        else res.status(401).json({ message: "Sai tài khoản" });
    });
});

app.get("/api/categories", (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => res.json(results));
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
