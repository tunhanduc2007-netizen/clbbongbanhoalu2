
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Calendar, Users, Star, ShoppingBag, CreditCard, Ticket, User, Check } from 'lucide-react';
import { PRODUCTS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[450px] bg-gradient-to-br from-[#7AC943] to-[#4E9F3D] overflow-hidden rounded-b-[40px] flex items-center justify-center">
      {/* Decorative Animated Ball - Updated to match logo yellow-green style */}
      <div className="absolute w-12 h-12 bg-[#FFD800] rounded-full shadow-lg z-10 animate-bounce" style={{ left: '10%', top: '20%', animationDuration: '3s' }}>
        <div className="w-full h-full border-t-2 border-white/30 rounded-full"></div>
      </div>
      <div className="absolute w-8 h-8 bg-white rounded-full shadow-lg z-10 animate-pulse" style={{ right: '15%', bottom: '30%' }}></div>

      {/* Dynamic Swoosh Lines Mimicking Logo */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <path d="M0,200 Q100,100 200,200 T400,200" fill="none" stroke="#FFD800" strokeWidth="40" className="opacity-30" />
          <path d="M0,250 Q120,150 220,250 T450,250" fill="none" stroke="white" strokeWidth="20" className="opacity-20" />
        </svg>
      </div>

      <div className="relative z-20 text-center px-6 max-w-3xl">
        {/* H1 - SEO Optimized với Primary Keywords */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
          CLB Bóng Bàn <span className="text-[#FFD800]">Hoa Lư Quận 1</span>
          <br className="hidden md:block" />
          <span className="text-2xl md:text-3xl"> Đào Tạo Chuyên Nghiệp</span>
        </h1>

        {/* Trust Signals - Above the fold */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4 text-white/95 text-xs md:text-sm font-medium">
          <span className="flex items-center gap-1">
            🏆 <strong>HLV Đội Tuyển Quốc Gia</strong>
          </span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-1">
            🏃 <strong>Thảm Enlio Chuẩn Quốc Tế</strong>
          </span>
          <span className="hidden md:inline">|</span>
          <span className="flex items-center gap-1">
            ⭐ <strong>500+ Hội Viên</strong>
          </span>
        </div>

        <p className="text-white/90 text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed">
          Môi trường tập luyện <strong>bóng bàn chuyên nghiệp</strong> hàng đầu tại <strong>trung tâm Quận 1, TP.HCM</strong>.
          Từ người mới bắt đầu đến vận động viên chuyên nghiệp.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            to="/register"
            className="ripple inline-flex items-center gap-2 bg-[#FFD800] text-[#4E9F3D] px-8 py-3 rounded-full font-bold shadow-xl transition-all hover:bg-white hover:scale-105"
          >
            ĐĂNG KÝ NGAY - NHẬN TƯ VẤN MIỄN PHÍ <ArrowRight size={20} />
          </Link>
          <Link to="/shop" className="text-white text-xs font-bold underline underline-offset-4 flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            MUA SẮM DỤNG CỤ CHÍNH HÃNG <ShoppingBag size={14} />
          </Link>
        </div>
      </div>

      {/* Abstract Shapes */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/20 backdrop-blur-md clip-path-slant"></div>
    </section>
  );
};

import SEO from '../components/SEO';


const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Schema is now pre-rendered in index.html - no need for client-side injection

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <SEO
        title="Trang Chủ - Đào Tạo & Giao Lưu Bóng Bàn Chuyên Nghiệp"
        description="Chào mừng đến với CLB Bóng bàn Hoa Lư - Môi trường tập luyện bóng bàn chuyên nghiệp, hiện đại hàng đầu với huấn luyện viên đội tuyển quốc gia."
        keywords="bóng bàn Hoa Lư, CLB bóng bàn Ninh Bình, học bóng bàn, thuê bàn bóng bàn, dụng cụ bóng bàn"
      />
      <Hero />

      {/* Intro Section - EXPANDED for SEO */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main About Section - Expanded */}
          <article className="glass p-8 md:p-12 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden relative mb-12">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7AC943]/10 rounded-full blur-2xl"></div>

            <header className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Users className="text-[#4E9F3D]" size={36} />
                Về CLB Bóng Bàn Hoa Lư - Điểm Đến Lý Tưởng Cho Người Yêu Bóng Bàn
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#7AC943] to-[#FFD800] rounded-full"></div>
            </header>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="text-lg">
                <strong className="text-gray-800">CLB Bóng bàn Hoa Lư</strong> tọa lạc tại <strong>2 Đinh Tiên Hoàng, Đa Kao, Quận 1, TP.HCM</strong>,
                là một trong những <em className="text-[#4E9F3D]">câu lạc bộ bóng bàn uy tín hàng đầu khu vực trung tâm thành phố</em>.
                Với hơn 10 năm kinh nghiệm đào tạo và phát triển phong trào <strong>bóng bàn tại Quận 1</strong>, chúng tôi tự hào là
                nơi hội tụ của những tay vợt đam mê từ người mới bắt đầu đến vận động viên chuyên nghiệp.
              </p>

              {/* Key Features Grid */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-gradient-to-br from-[#7AC943]/5 to-[#FFD800]/5 p-6 rounded-2xl border-l-4 border-[#7AC943]">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🏆 Đội Ngũ Huấn Luyện Viên Chuyên Nghiệp
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    CLB sở hữu đội ngũ <strong>huấn luyện viên là cựu tuyển thủ quốc gia</strong> với nhiều năm kinh nghiệm
                    thi đấu quốc tế. Phương pháp giảng dạy kết hợp lý thuyết khoa học và thực hành chuyên sâu,
                    giúp học viên tiến bộ nhanh chóng từ kỹ thuật cơ bản đến chiến thuật thi đấu nâng cao.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#4E9F3D]/5 to-[#7AC943]/5 p-6 rounded-2xl border-l-4 border-[#4E9F3D]">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🏃 Cơ Sở Vật Chất Đạt Chuẩn Quốc Tế
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2 leading-relaxed">
                    <li>✓ <strong>Thảm Enlio chuyên nghiệp</strong>: Bảo vệ khớp gối, giảm chấn thương tối đa</li>
                    <li>✓ <strong>Bàn thi đấu chuẩn ITTF</strong>: Độ nảy chuẩn quốc tế</li>
                    <li>✓ <strong>Hệ thống chiếu sáng LED</strong>: Không bóng chết, bảo vệ thị lực</li>
                    <li>✓ <strong>Điều hòa hiện đại</strong>: Môi trường thoáng mát suốt năm</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                📅 Đa Dạng Hình Thức Tập Luyện Phù Hợp Mọi Đối Tượng
              </h3>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">👶</span>
                    <div>
                      <strong className="text-gray-800">Lớp năng khiếu trẻ em</strong> (6-15 tuổi):
                      <span className="text-sm text-gray-600"> Xây dựng nền tảng kỹ thuật vững chắc, phát triển tư duy chiến thuật từ nhỏ</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <strong className="text-gray-800">Lớp người lớn mới bắt đầu</strong>:
                      <span className="text-sm text-gray-600"> Học bóng bàn từ zero, phương pháp dễ hiểu, tiến bộ nhanh</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <strong className="text-gray-800">Lớp nâng cao</strong>:
                      <span className="text-sm text-gray-600"> Chiến thuật thi đấu, training sparring với vận động viên chuyên nghiệp</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🏓</span>
                    <div>
                      <strong className="text-gray-800">Thuê bàn tự do</strong>:
                      <span className="text-sm text-gray-600"> Giao lưu cộng đồng, tự rèn luyện, linh hoạt thời gian</span>
                    </div>
                  </li>
                </ul>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
                💎 Tại Sao Chọn CLB Bóng Bàn Hoa Lư?
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: "📍", title: "Vị trí trung tâm Quận 1", desc: "Gần Nhà hát TP, dễ dàng di chuyển" },
                  { icon: "💰", title: "Giá cả hợp lý", desc: "Từ 40.000đ/lượt, phù hợp mọi đối tượng" },
                  { icon: "🤝", title: "Cộng đồng văn minh", desc: "Hơn 500 hội viên thường xuyên" },
                  { icon: "🛍️", title: "Cửa hàng dụng cụ", desc: "Butterfly, DHS, Stiga chính hãng" },
                  { icon: "⏰", title: "Lịch linh hoạt", desc: "Mở cửa cả tuần kể cả Chủ nhật" },
                  { icon: "🎯", title: "Cam kết chất lượng", desc: "Đào tạo đúng phương pháp quốc tế" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-[#7AC943]/5 transition-colors">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#7AC943]/10 to-[#FFD800]/10 p-6 md:p-8 rounded-2xl mt-8 border-l-4 border-[#7AC943]">
                <p className="text-lg font-bold text-[#4E9F3D] mb-3">
                  🎯 Bạn đang tìm kiếm nơi học bóng bàn uy tín tại Quận 1, TP.HCM?
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Hãy đến <strong>CLB Bóng Bàn Hoa Lư</strong> để trải nghiệm môi trường tập luyện chuyên nghiệp,
                  được hướng dẫn bởi HLV quốc gia và kết nối với cộng đồng đam mê bóng bàn!
                  Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho mọi học viên.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-[#4E9F3D] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#7AC943] transition-colors"
                  >
                    Đăng ký ngay <ArrowRight size={16} />
                  </Link>
                  <a
                    href="tel:0913909012"
                    className="inline-flex items-center gap-2 bg-white text-[#4E9F3D] px-6 py-2 rounded-full font-bold text-sm border-2 border-[#4E9F3D] hover:bg-[#4E9F3D] hover:text-white transition-colors"
                  >
                    Gọi tư vấn: 0913.909.012
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Quick Links Cards */}
          <nav className="grid grid-cols-2 gap-4" aria-label="Quick links">
            <Link to="/schedule" className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center group transition-all hover:bg-[#7AC943]/5 h-full">
              <div className="w-16 h-16 bg-[#FFD800]/20 text-[#4E9F3D] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Lịch tập luyện</h3>
              <p className="text-sm text-gray-500 mt-2">Giao lưu & huấn luyện</p>
            </Link>
            <Link to="/shop" className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center group transition-all hover:bg-[#7AC943]/5 h-full">
              <div className="w-16 h-16 bg-[#7AC943]/20 text-[#4E9F3D] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Cửa hàng</h3>
              <p className="text-sm text-gray-500 mt-2">Dụng cụ chính hãng</p>
            </Link>
          </nav>
        </div>
      </section>

      {/* Pricing Section - Premium Card Style */}
      <section className="px-6 py-8 bg-[#f8fafc] rounded-[40px] my-4" id="pricing">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-[#7AC943]/30"></span>
            <span className="text-[#4E9F3D] font-black uppercase tracking-[0.2em] text-[10px]">BẢNG GIÁ DỊCH VỤ</span>
            <span className="w-12 h-[2px] bg-[#7AC943]/30"></span>
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase mb-4">GIÁ TẬP LUYỆN</h2>
          <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto mb-10 leading-relaxed">
            Đến là chơi - không cần đăng ký hội viên. Chọn hình thức phù hợp với bạn!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Card 1: Vé chơi lượt */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl hover:shadow-[#7AC943]/10 transition-all duration-500">
            <div className="w-16 h-16 bg-[#7AC943] rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-[#7AC943]/20 group-hover:scale-110 transition-transform">
              <Ticket size={28} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight leading-tight">VÉ CHƠI LƯỢT</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-[#4E9F3D] tracking-tighter">40.000đ</span>
              <span className="text-slate-400 font-bold text-[10px]">/lượt</span>
            </div>
            <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed px-2">
              Dành cho khách vãng lai, đến chơi bất cứ khi nào bạn rảnh.
            </p>
            <ul className="space-y-4 mb-10 text-left w-full">
              {['Không cần đăng ký trước', 'Đến là chơi ngay', 'Trải nghiệm sân bãi chuẩn'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                  <div className="w-4 h-4 rounded-full bg-[#7AC943]/10 flex items-center justify-center">
                    <Check size={10} className="text-[#4E9F3D]" strokeWidth={4} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto w-full py-4 border-2 border-[#7AC943] text-[#4E9F3D] rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all text-center">
              ĐẾN LÀ CHƠI!!!
            </div>
          </div>

          {/* Card 2: Thẻ hội viên - Featured */}
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-[#7AC943]/20 border-2 border-[#7AC943] flex flex-col items-center text-center relative transform md:-translate-y-6 lg:scale-105 z-10">
            <div className="absolute -top-4 bg-[#FFD800] text-[#4E9F3D] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              TIẾT KIỆM
            </div>
            <div className="w-16 h-16 bg-[#4E9F3D] rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-[#4E9F3D]/30 group-hover:scale-110 transition-transform">
              <User size={28} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight leading-tight">THẺ HỘI VIÊN</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-[#4E9F3D] tracking-tighter">700.000đ</span>
              <span className="text-slate-400 font-bold text-[10px]">/tháng</span>
            </div>
            <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed px-2">
              Tập luyện không giới hạn. Tiết kiệm tối đa cho hội viên thường xuyên.
            </p>
            <ul className="space-y-4 mb-10 text-left w-full">
              {['Chơi không giới hạn lượt', 'Ưu tiên đặt bàn tập', 'Giao lưu cộng đồng Hội viên', 'Hỗ trợ kỹ thuật cơ bản'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                  <div className="w-4 h-4 rounded-full bg-[#7AC943]/10 flex items-center justify-center">
                    <Check size={10} className="text-[#4E9F3D]" strokeWidth={4} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="mt-auto w-full py-4 bg-gradient-to-r from-[#7AC943] to-[#4E9F3D] text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#7AC943]/30 hover:brightness-110 transition-all text-center">
              ĐĂNG KÝ NGAY
            </Link>
          </div>

          {/* Card 3: Thuê bàn riêng */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl hover:shadow-[#7AC943]/10 transition-all duration-500">
            <div className="w-16 h-16 bg-[#FFD800] rounded-full flex items-center justify-center text-[#4E9F3D] mb-8 shadow-lg shadow-[#FFD800]/20 group-hover:scale-110 transition-transform">
              <Calendar size={28} fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight leading-tight">THUÊ BÀN RIÊNG</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-[#4E9F3D] tracking-tighter">70.000đ</span>
              <span className="text-slate-400 font-bold text-[10px]">/giờ</span>
            </div>
            <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed px-2">
              Sân chơi riêng tư. Dành cho nhóm bạn muốn tập luyện độc lập.
            </p>
            <ul className="space-y-4 mb-10 text-left w-full">
              {['Không gian tập riêng tư', 'Chuẩn thi đấu quốc tế', 'Tự do thời gian tập', 'Đặt bàn trước tiện lợi'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                  <div className="w-4 h-4 rounded-full bg-[#7AC943]/10 flex items-center justify-center">
                    <Check size={10} className="text-[#4E9F3D]" strokeWidth={4} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="mt-auto w-full py-4 border-2 border-[#7AC943] text-[#4E9F3D] rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all text-center">
              CHỌN NGAY
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-6 py-12">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Dụng cụ bóng bàn nổi bật</h2>
          <Link to="/shop" className="text-[#4E9F3D] text-xs font-bold flex items-center gap-1">
            XEM TẤT CẢ <ArrowRight size={14} />
          </Link>
        </header>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {PRODUCTS.slice(0, 3).map((product) => (
            <Link to="/shop" key={product.id} className="flex-shrink-0 w-40 glass rounded-2xl p-3 border border-gray-100 shadow-sm group">
              <div className="overflow-hidden rounded-xl mb-3">
                <img
                  src={product.image}
                  alt={`Sản phẩm ${product.name}`}
                  loading="lazy"
                  width="160"
                  height="160"
                  className="w-full aspect-square object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-[11px] font-bold text-gray-800 line-clamp-1">{product.name}</h3>
              <p className="text-[#4E9F3D] font-black text-[10px] mt-1">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Câu hỏi thường gặp (FAQ)</h2>
        <div className="space-y-6">
          {[
            { q: "CLB có lớp học cho trẻ em không?", a: "Có, CLB bóng bàn Hoa Lư thường xuyên chiêu sinh các lớp năng khiếu cho trẻ em từ 6 tuổi trở lên." },
            { q: "Tôi có thể mua vợt tại CLB không?", a: "Chúng tôi có cửa hàng cung cấp đầy đủ cốt vợt, mặt vợt và phụ kiện chính hãng từ các thương hiệu như Butterfly, DHS, Stiga." },
            { q: "Địa chỉ CLB ở đâu?", a: "CLB tọa lạc tại 2 Đinh Tiên Hoàng, Đa Kao, Quận 1, Thành phố Hồ Chí Minh (Trung tâm TDTT Hoa Lư). Vị trí trung tâm Quận 1, thuận tiện đi lại." }
          ].map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-800 mb-2 italic">? {faq.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-gray-50 px-6 py-12 rounded-t-[40px]">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tại sao chọn CLB Hoa Lư?</h2>
          <Star className="text-[#FFD800] fill-[#FFD800]" />
        </header>

        <div className="space-y-4">
          {[
            { title: "Huấn luyện viên nhiều năm kinh nghiệm", icon: "🥇", desc: "Học phương pháp chuẩn nhất" },
            { title: "Thảm Enlio chuyên nghiệp đạt chuẩn", icon: "🏃", desc: "Bảo vệ đôi chân và khớp" },
            { title: "Cộng đồng văn minh, đoàn kết", icon: "🤝", desc: "Nơi giao lưu kết nối cùng đam mê" }
          ].map((item, idx) => (
            <article key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <div>
                <h3 className="font-bold text-gray-700">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
