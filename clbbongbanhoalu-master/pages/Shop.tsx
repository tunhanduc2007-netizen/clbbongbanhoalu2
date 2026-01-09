import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Circle, Layers, Shirt, Briefcase, Footprints, SlidersHorizontal, ArrowDownAZ, X, ChevronRight, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import SEO from '../components/SEO';

// --- DATA CONSTANTS ---
const SHOP_CATEGORIES = [
  { id: 'mat-vot', name: 'Mặt vợt', icon: Circle, color: '#E53935' },
  { id: 'cot-vot', name: 'Cốt vợt', icon: Layers, color: '#1E88E5' },
  { id: 'quan-ao', name: 'Quần áo', icon: Shirt, color: '#8E24AA' },
  { id: 'tui-xach', name: 'Túi xách', icon: Briefcase, color: '#F9A825' },
  { id: 'giay', name: 'Giày', icon: Footprints, color: '#43A047' },
  { id: 'bong', name: 'Bóng', icon: Circle, color: '#FB8C00' },
  { id: 'phu-kien', name: 'Phụ kiện', icon: ShoppingBag, color: '#00ACC1' }
];

const BRANDS = ['Butterfly', 'DHS', 'Stiga', 'Yasaka', 'Nittaku', 'Tibhar', 'Donic', 'Xiom'];

// --- SUB-COMPONENT: ShopHeader ---
// Moved outside to prevent full page re-renders on scroll
const ShopHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
       const currentScrollY = window.scrollY;
       const splitOffset = 20;

       // 1. Logic Shape Change (Gradient vs Pill)
       if (currentScrollY > splitOffset) {
         setIsScrolled(true);
       } else {
         setIsScrolled(false);
       }

       // 2. Logic Smart Hide/Show
       if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
         // Scrolling DOWN -> Hide
         setIsVisible(false);
       } else {
         // Scrolling UP -> Show
         setIsVisible(true);
       }

       lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/about' },
    { name: 'Lịch tập', path: '/schedule' },
    { name: 'Cửa hàng', path: '/shop' },
    { name: 'Thư viện', path: '/gallery' },
    { name: 'Đăng ký', path: '/register' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'px-4 py-2' : 'px-0 py-0'}`}
    >
      <nav className={`container mx-auto max-w-7xl flex items-center justify-between transition-all duration-300 glass ${
           isScrolled 
           ? 'rounded-full shadow-lg px-6 py-3' 
           : 'rounded-b-3xl px-6 py-4'
      }`}>
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-full shadow-md overflow-hidden shrink-0">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </picture>
          </div>
          <div className="flex flex-col justify-center select-none">
             <span className="font-black leading-none text-xl uppercase tracking-tight text-[#81c341]">HOA LƯ</span>
             <span className="font-bold leading-none text-sm uppercase tracking-widest opacity-90 text-[#0e1b3c]">STORE</span>
          </div>
        </Link>

        {/* Main Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.path}>
                 <Link 
                   to={item.path}
                   className={`text-sm font-bold transition-colors ${
                      location.pathname === item.path
                        ? 'text-[#7AC943]'
                        : 'text-gray-600 hover:text-[#7AC943]'
                   }`}
                 >
                   {item.name}
                 </Link>
              </li>
            ))}
          </ul>
          <div className="w-px h-6 mx-2 bg-gray-300"></div>
          <a href="tel:0913909012" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg hover:scale-105 bg-gray-900 text-white hover:bg-[#7AC943]">
            <ShoppingBag size={14} />
            <span>0913.909.012</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

const Shop: React.FC = () => {
  // --- STATE ---
  // No longer tracking scroll here!
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Tên: A-Z');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = ['Tên: A-Z', 'Tên: Z-A', 'Giá: Thấp-Cao', 'Giá: Cao-Thấp', 'Mới nhất'];

  // --- LOGIC: FILTERING ---
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setActiveCategory('Tất cả');
  };

  const filteredProducts = activeCategory === 'Tất cả'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  // --- SCHEMA ---
  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Cửa hàng CLB Bóng bàn Hoa Lư",
    "description": "Cung cấp dụng cụ bóng bàn chính hãng chuyên nghiệp.",
    "itemListElement": PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "image": p.image,
        "offers": { "@type": "Offer", "price": p.price.replace(/[^0-9]/g, ''), "priceCurrency": "VND" }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 pb-20">
      <SEO
        title="Hoa Lu Store - Dụng Cụ Bóng Bàn Chính Hãng"
        description="Mua sắm cốt vợt, mặt vợt, giày và phụ kiện bóng bàn chính hãng từ các thương hiệu hàng đầu."
        keywords="dụng cụ bóng bàn, mua vợt bóng bàn, mặt vợt bóng bàn, giày bóng bàn"
        schema={shopSchema}
      />

      {/* --- HEADER (ISOLATED COMPONENT) --- */}
      <ShopHeader />

      {/* --- HERO SECTION (Cleaner, Less Glare) --- */}
      <section className="pt-32 pb-12 px-4 relative overflow-hidden bg-gradient-to-br from-gray-100 to-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7AC943]/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          
          {/* Breadcrumb - Clean */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium uppercase tracking-wide">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-black">{activeCategory}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-gray-200 pb-8">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                Bộ sưu tập <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7AC943] to-[#4E9F3D]">Chuyên Nghiệp</span>
              </h1>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                Các sản phẩm được tuyển chọn kỹ lưỡng bởi HLV đội tuyển quốc gia. Chuẩn thi đấu ITTF.
              </p>
            </div>
            
            {/* Search Bar - Modern Pill */}
            <div className="w-full md:w-auto min-w-[300px] relative group">
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent focus:border-[#7AC943] shadow-sm group-hover:shadow-md rounded-full outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7AC943]" size={20} />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 mt-8">
        
        {/* --- CONTROLS BAR (Categories + Filter) --- */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          
          {/* Categories Scroll - Elegant */}
          <div className="flex-1 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
            <div className="flex gap-3">
              {SHOP_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap ${
                      active 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#7AC943] hover:text-[#7AC943]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                    <span className="text-sm font-bold">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-3 shrink-0">
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold transition-all ${showFilters ? 'bg-[#7AC943] text-white border-[#7AC943]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
             >
               <SlidersHorizontal size={16} />
               <span>Bộ lọc</span>
             </button>
             <div className="h-8 w-px bg-gray-300"></div>
             <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent font-bold text-sm hover:text-[#7AC943] cursor-pointer outline-none pr-6"
                >
                  {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ArrowDownAZ size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"/>
             </div>
          </div>
        </div>

        {/* --- EXPANDABLE FILTERS --- */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${showFilters ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex flex-wrap gap-2">
               {BRANDS.map(brand => (
                 <button
                   key={brand}
                   onClick={() => toggleBrand(brand)}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                     selectedBrands.includes(brand)
                       ? 'bg-[#7AC943] text-white shadow-md'
                       : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                   }`}
                 >
                   {brand}
                 </button>
               ))}
               {(selectedBrands.length > 0 || activeCategory !== 'Tất cả') && (
                 <button onClick={clearAllFilters} className="px-4 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-1">
                   <X size={14} /> Reset
                 </button>
               )}
             </div>
          </div>
        </div>

        {/* --- PRODUCT GRID (Simple & Premium) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                 {/* Image */}
                 <img 
                   src={product.image} 
                   alt={product.name}
                   className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                   loading="lazy"
                 />

                 {/* Quick Action Overlay (Desktop) */}
                 <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                    <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#7AC943] hover:text-white transition-colors shadow-lg flex items-center gap-2">
                       <ShoppingBag size={14} /> Mua ngay
                    </button>
                 </div>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>{product.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[#7AC943]">Chính hãng</span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#7AC943] transition-colors leading-tight line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg font-black text-gray-900">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
             <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <ShoppingBag size={32} />
             </div>
             <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm phù hợp.</p>
             <button onClick={clearAllFilters} className="mt-4 text-[#7AC943] font-bold hover:underline">Xóa bộ lọc</button>
          </div>
        )}

      </div>

      {/* --- FOOTER CTA (Premium) --- */}
      <section className="container mx-auto max-w-6xl px-4 mt-24">
        <div className="bg-gray-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <img src="/logo.webp" className="w-64 h-64 grayscale invert" />
           </div>
           
           <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-2">Đăng ký thành viên Hoa Lư</h2>
              <p className="text-gray-400 max-w-md">Nhận ưu đãi 10% trọn đời cho mọi đơn hàng dụng cụ và vé thuê bàn tập luyện.</p>
           </div>
           
           <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-[#7AC943] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#68b037] transition-all transform hover:scale-105 shadow-xl shadow-green-900/20">
               Đăng Ký Ngay <ChevronRight size={18} />
             </Link>
             <a href="tel:0913909012" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
               Tư vấn HLV
             </a>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
