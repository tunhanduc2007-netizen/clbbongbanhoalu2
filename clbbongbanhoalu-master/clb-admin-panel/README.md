# CLB Table Tennis Admin Panel

Hệ thống quản lý tài chính CLB Bóng Bàn Hoa Lư (Standalone Version).

## 1. Yêu cầu
- Node.js installed
- MySQL Server installed & running

## 2. Cài đặt

Bước 1: Cài đặt dependencies
```bash
cd clb-admin-panel
npm install
```

Bước 2: Khởi tạo Database
- Mở PHPMyAdmin hoặc MySQL Workbench
- Chạy toàn bộ file `database.sql` để tạo DB `clb_admin_standalone` và các bảng.

Bước 3: Chạy Server
```bash
node server/index.js
```
Server sẽ chạy tại: `http://localhost:3005` (Đã đổi port để tránh xung đột hệ thống cũ).

## 3. Sử dụng
- Mở trình duyệt truy cập: `http://localhost:3005/login.html`
- Tài khoản Demo:
  - Admin: `admin` / `123456`
  - Thủ quỹ: `thuquy` / `123456`
