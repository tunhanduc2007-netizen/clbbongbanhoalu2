
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Table, Trophy, Users, Calendar, Image as ImageIcon, MessageSquare, ShoppingBag, Phone, Facebook, MessageCircle } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Schedule from './pages/Schedule';
import Register from './pages/Register';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin'; // Đường dẫn admin mới
import Shop from './pages/Shop';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

// Layout Components
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
      <nav className={`container mx-auto max-w-7xl flex items-center justify-between transition-all duration-300 glass ${scrolled ? 'rounded-full shadow-lg px-6 py-3' : 'rounded-b-3xl px-6 py-4 bg-gradient-to-r from-[#7AC943] to-[#FFD800]'
        }`}>
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="w-14 h-14 rounded-full shadow-md overflow-hidden shrink-0">
            <img
              src="/logo.png"
              alt="Logo CLB Hoa Lư"
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`flex flex-col ${!scrolled ? 'text-white' : 'text-gray-800'}`}>
            <span className="font-bold leading-none text-lg">Bóng bàn</span>
            <span className="text-sm opacity-90">Hoa Lư</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`font-bold text-sm transition-colors flex items-center gap-2 ${location.pathname === item.path
                  ? (scrolled ? 'text-[#4E9F3D]' : 'text-white')
                  : (scrolled ? 'text-gray-500 hover:text-[#4E9F3D]' : 'text-white/80 hover:text-white')
                  }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 rounded-full transition-colors ${scrolled ? 'bg-gray-100 text-[#4E9F3D]' : 'bg-white/20 text-white'}`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
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
                    ? 'bg-gradient-to-r from-[#7AC943] to-[#FFD800] text-white shadow-md'
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
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl p-2 overflow-hidden">
            <img src="/logo.png" alt="Logo CLB Hoa Lư" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">CLB bóng bàn Hoa Lư</h3>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} CLB bóng bàn Hoa Lư. All rights reserved.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          <h4 className="font-bold text-gray-800">Liên kết nhanh</h4>
          <Link to="/about" className="text-gray-500 hover:text-[#7AC943] transition-colors">Giới thiệu về CLB</Link>
          <Link to="/schedule" className="text-gray-500 hover:text-[#7AC943] transition-colors">Lịch tập luyện</Link>
          <Link to="/shop" className="text-gray-500 hover:text-[#7AC943] transition-colors">Cửa hàng dụng cụ</Link>
          <Link to="/register" className="text-gray-500 hover:text-[#7AC943] transition-colors">Đăng ký hội viên</Link>
        </nav>

        {/* Contact */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-bold text-gray-800">Liên hệ</h4>
          <p className="text-gray-500 text-sm">2 Đinh Tiên Hoàng, Đa Kao, Quận 1, Thành phố Hồ Chí Minh (Trung tâm TDTT Hoa Lư)</p>
          <p className="text-gray-500 text-sm">Hotline: 0913.909.012</p>
          <div className="flex gap-4 justify-center md:justify-start pt-2">
            {/* Phone Call Logo - Green and White */}
            <a href="tel:0913909012" title="Gọi điện thoại" className="w-10 h-10 rounded-full bg-[#7AC943] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-all">
              <Phone size={20} fill="currentColor" />
            </a>
            {/* Zalo Logo - Green */}
            <a href="https://zalo.me/0913909012" target="_blank" rel="noopener noreferrer" title="Chat Zalo" className="w-10 h-10 rounded-full bg-[#4E9F3D] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-all">
              <MessageCircle size={22} fill="currentColor" />
            </a>
            {/* FB Logo - Official Blue */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-10 h-10 rounded-full bg-[#1877F2] text-white shadow-sm flex items-center justify-center hover:scale-110 transition-all">
              <Facebook size={20} fill="currentColor" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center md:text-left text-xs text-gray-400 border-t border-gray-200 pt-8 mt-12 w-full">
        &copy; 2026 CLB Bóng Bàn Hoa Lư. Tinh thần thể thao vươn tầm.
      </div>
    </div>
  </footer>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col bg-white ${!isAdminPath ? 'shadow-2xl overflow-x-hidden' : ''}`}>
      {!isAdminPath && <Header />}

      <main className={`${!isAdminPath ? 'flex-grow mt-20' : 'min-h-screen'}`}>
        <div className={`${!isAdminPath ? 'container mx-auto max-w-7xl' : 'w-full'}`}>
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
        </div>
      </main>

      {!isAdminPath && <Footer />}

      {!isAdminPath && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <a href="tel:0913909012" className="ripple flex items-center justify-center w-14 h-14 bg-[#7AC943] text-white rounded-full shadow-2xl transition-transform active:scale-90 animate-bounce">
            <Phone size={28} />
          </a>
          <Link to="/register" className="ripple flex items-center gap-2 bg-gradient-to-r from-[#4E9F3D] to-[#7AC943] text-white px-6 py-3 rounded-full shadow-2xl font-bold transition-transform active:scale-90">
            <MessageSquare size={20} />
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
