
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Table, Trophy, Users, Calendar, Image as ImageIcon, MessageSquare, ShoppingBag, Phone, Facebook, MessageCircle } from 'lucide-react';
import logo from './src/assets/logo.png';

// Tải trang lười (Lazy load) để chia nhỏ mã - giảm kích thước gói ban đầu
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Register = lazy(() => import('./pages/Register'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Admin = lazy(() => import('./pages/Admin'));
const Shop = lazy(() => import('./pages/Shop'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Trình tải khung xương (Skeleton Loader) khớp với index.html để ngăn CLS
const PageLoader = () => (
  <div className="relative h-[450px] bg-gradient-to-br from-[#bdffff] to-[#0891b2] rounded-b-[40px] flex items-center justify-center overflow-hidden">
    <div className="w-full max-w-[800px] px-5 text-center">
      <div className="h-10 w-[70%] bg-white/20 rounded-lg mx-auto mb-5 animate-pulse"></div>
      <div className="h-10 w-[50%] bg-white/20 rounded-lg mx-auto mb-8 animate-pulse"></div>
      <div className="h-[50px] w-[200px] bg-[#FFD800] rounded-full mx-auto animate-pulse"></div>
    </div>
  </div>
);

// Điều hướng dưới cùng trên di động để tăng khả năng truy cập (đặc biệt cho người lớn tuổi)
const MobileBottomNav: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-5 h-16">
        <Link to="/" className={`flex flex-col items-center justify-center gap-1 ${isActive('/') ? 'text-[#0891b2]' : 'text-gray-500'}`}>
          <Table size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Trang chủ</span>
        </Link>

        <Link to="/schedule" className={`flex flex-col items-center justify-center gap-1 ${isActive('/schedule') ? 'text-[#0891b2]' : 'text-gray-500'}`}>
          <Calendar size={20} strokeWidth={isActive('/schedule') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Lịch tập</span>
        </Link>

        {/* Nút Gọi Giữa - Nổi đẹp mắt */}
        <div className="relative flex flex-col items-center justify-end pb-1.5 h-full">
          <a
            href="tel:0913909012"
            aria-label="Gọi ngay"
            className="absolute -top-6 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#bdffff] to-[#FFD800] text-white shadow-xl ring-4 ring-white transform transition-transform active:scale-95 z-10"
          >
            <Phone size={24} fill="currentColor" />
          </a>
          <span className="text-[10px] font-black text-[#0891b2] tracking-tight">GỌI NGAY</span>
        </div>

        <Link to="/shop" className={`flex flex-col items-center justify-center gap-1 ${isActive('/shop') ? 'text-[#0891b2]' : 'text-gray-500'}`}>
          <ShoppingBag size={20} strokeWidth={isActive('/shop') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Cửa hàng</span>
        </Link>

        <button onClick={onMenuClick} className="flex flex-col items-center justify-center gap-1 text-gray-500">
          <Menu size={20} />
          <span className="text-[10px] font-bold">Menu</span>
        </button>
      </div>
    </nav>
  );
};

// Thành phần Bố cục
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Trang chủ', path: '/', icon: <Table size={18} /> },
    { name: 'Giới thiệu', path: '/about', icon: <Users size={18} /> },
    { name: 'Lịch tập', path: '/schedule', icon: <Calendar size={18} /> },
    { name: 'Cửa hàng', path: '/shop', icon: <ShoppingBag size={18} /> },
    { name: 'Thư viện', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'Đăng ký', path: '/register', icon: <Trophy size={18} /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'px-4 py-2' : 'px-0 py-0'
      }`}>
      <nav className={`container mx-auto max-w-7xl flex items-center justify-between transition-all duration-300 glass ${scrolled ? 'rounded-full shadow-lg px-6 py-3' : 'rounded-b-3xl px-6 py-4 bg-gradient-to-r from-[#bdffff] to-[#FFD800]'
        }`}>
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="w-14 h-14 rounded-full shadow-md overflow-hidden shrink-0">
            <picture>
              <source srcSet={logo} type="image/png" />
              <img
                src={logo}
                alt="Logo CLB Hoa Lư"
                className="w-full h-full object-cover"
                width="56"
                height="56"
              />
            </picture>
          </div>
          <div className={`flex flex-col ${!scrolled ? 'text-white' : 'text-gray-800'}`}>
            <span className="font-bold leading-none text-lg">Bóng bàn</span>
            <span className="text-sm opacity-100 font-medium">Hoa Lư</span>
          </div>
        </Link>

        {/* Menu Máy tính */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`font-bold text-sm transition-colors flex items-center gap-2 ${location.pathname === item.path
                  ? (scrolled ? 'text-[#0891b2]' : 'text-white')
                  : (scrolled ? 'text-gray-600 hover:text-[#0891b2]' : 'text-white/90 hover:text-white')
                  }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>


      </nav>
      {/* Nút kích hoạt Menu Di động Ẩn cho Điều hướng Dưới cùng */}
      <button
        id="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="hidden"
        aria-hidden="true"
      />
      {/* Lớp phủ Menu Di động */}
      <div className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}>
        <div
          className={`absolute top-20 right-4 left-4 glass rounded-3xl p-6 transition-transform duration-300 ${isOpen ? 'translate-y-0 scale-100' : '-translate-y-10 scale-95'}`}
          onClick={e => e.stopPropagation()}
        >
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${location.pathname === item.path
                    ? 'bg-gradient-to-r from-[#bdffff] to-[#FFD800] text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  <ChevronRight size={18} className="ml-auto opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-gray-50 pt-16 pb-24 border-t border-gray-100">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Thương hiệu */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl p-2 overflow-hidden">
            <picture>
              <source srcSet={logo} type="image/png" />
              <img src={logo} alt="Logo CLB Hoa Lư" className="w-full h-full object-cover" width="96" height="96" loading="lazy" />
            </picture>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">CLB bóng bàn Hoa Lư</h3>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CLB bóng bàn Hoa Lư. All rights reserved.
            </p>
          </div>
        </div>

        {/* Điều hướng */}
        <nav className="flex flex-col space-y-4">
          <h4 className="font-bold text-gray-800">Liên kết nhanh</h4>
          <Link to="/about" className="text-gray-500 hover:text-[#0891b2] transition-colors">Giới thiệu về CLB</Link>
          <Link to="/schedule" className="text-gray-500 hover:text-[#0891b2] transition-colors">Lịch tập luyện</Link>
          <Link to="/shop" className="text-gray-500 hover:text-[#0891b2] transition-colors">Cửa hàng dụng cụ</Link>
          <Link to="/register" className="text-gray-500 hover:text-[#0891b2] transition-colors">Đăng ký hội viên</Link>
        </nav>

        {/* Liên hệ */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-bold text-gray-800">Liên hệ</h4>
          <p className="text-gray-600 text-sm">2 Đinh Tiên Hoàng, Đa Kao, Quận 1, Thành phố Hồ Chí Minh (Trung tâm TDTT Hoa Lư)</p>
          <p className="text-gray-600 text-sm">Hotline: 0913.909.012</p>
          <div className="flex gap-4 justify-center md:justify-start pt-2">
            {/* Logo Gọi điện thoại - Xanh lá và Trắng */}
            <a href="tel:0913909012" aria-label="Gọi điện thoại" title="Gọi điện thoại" className="w-10 h-10 rounded-full bg-[#0891b2] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-all">
              <Phone size={20} fill="currentColor" />
            </a>
            {/* Logo Zalo - Xanh lá */}
            <a href="https://zalo.me/0913909012" aria-label="Chat Zalo" target="_blank" rel="noopener noreferrer" title="Chat Zalo" className="w-10 h-10 rounded-full bg-[#0891b2] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-all">
              <MessageCircle size={22} fill="currentColor" />
            </a>
            {/* Logo FB - Xanh dương chính thức */}
            <a href="https://facebook.com" aria-label="Facebook Fanpage" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-10 h-10 rounded-full bg-[#1877F2] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-all">
              <Facebook size={20} fill="currentColor" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center md:text-left text-xs text-gray-500 border-t border-gray-200 pt-8 mt-12 w-full">
        &copy; 2026 CLB Bóng Bàn Hoa Lư. Tinh thần thể thao vươn tầm.
      </div>
    </div>
  </footer>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isShopPath = location.pathname === '/shop';

  return (
    <div className={`min-h-screen flex flex-col bg-white ${!isAdminPath ? 'shadow-2xl overflow-x-hidden' : ''}`}>
      {!isAdminPath && !isShopPath && <Header />}

      <main className={`${!isAdminPath ? 'flex-grow' : 'min-h-screen'} ${!isAdminPath && !isShopPath ? 'mt-20' : ''}`}>
        <div className={`${!isAdminPath && !isShopPath ? 'container mx-auto max-w-7xl' : 'w-full'}`}>
          <div key={location.pathname} className={!isAdminPath ? "page-enter-active" : ""}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/admin/login" element={<AdminLogin />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </main>

      {!isAdminPath && <Footer />}

      {!isAdminPath && <MobileBottomNav onMenuClick={() => document.getElementById('mobile-menu-btn')?.click()} />}

      {!isAdminPath && (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 items-end md:bottom-6 md:right-6">
           <Link to="/register" className="ripple flex items-center gap-2 bg-gradient-to-r from-[#0891b2] to-[#bdffff] text-white px-5 py-3 rounded-full shadow-xl font-bold transition-transform active:scale-90 whitespace-nowrap text-sm md:text-base md:px-6">
            <MessageSquare size={18} />
            <span>TƯ VẤN NGAY</span>
          </Link>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
