# CLB Bóng Bàn Hoa Lư - Hệ Thống Quản Lý

Website quản lý tài chính và hoạt động CLB Bóng Bàn Hoa Lư

## 🚀 Cài Đặt Trên Máy Mới

### Bước 1: Clone Repository
```bash
git clone https://github.com/tunhanduc2007-netizen/clbbongbanhoalu2.git
cd clbbongbanhoalu2
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Supabase
1. Copy file `.env.example` thành `.env`:
   ```bash
   copy .env.example .env
   ```
   
2. File `.env` đã có sẵn thông tin Supabase, bạn không cần thay đổi gì

### Bước 4: Chạy Website
```bash
npm run dev
```

Website sẽ chạy tại: http://localhost:5173

## 📝 Workflow Làm Việc Song Song Giữa 2 Máy

### ✅ **TRƯỚC KHI** bắt đầu làm việc (trên máy nào cũng vậy):
```bash
git pull origin main
```

### ✅ **SAU KHI** hoàn thành công việc (hoặc trước khi tắt máy):
```bash
git add .
git commit -m "Mô tả công việc vừa làm"
git push origin main
```

## ⚠️ Lưu Ý Quan Trọng

1. **Luôn pull trước khi bắt đầu** để tránh conflict
2. **Luôn push sau khi làm xong** để máy kia có code mới nhất
3. **File .env không được đẩy lên Git** (đã có trong .gitignore)
4. **Supabase sử dụng chung** - không cần cấu hình riêng

## 🔧 Supabase Configuration

Dự án sử dụng Supabase cho:
- ✅ Database (PostgreSQL)
- ✅ Authentication
- ✅ Real-time subscriptions

Thông tin Supabase đã được cấu hình sẵn trong `.env.example`

## 📦 Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS
- **Charts**: Chart.js

## 🎯 Scripts Có Sẵn

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

---

**Developed with ❤️ by CLB Bóng Bàn Hoa Lư**
