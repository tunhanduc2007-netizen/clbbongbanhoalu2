
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Calendar, Users, Star, ShoppingBag, CreditCard, Ticket, User, Check } from 'lucide-react';
import { PRODUCTS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[400px] bg-gradient-to-br from-[#7AC943] to-[#4E9F3D] overflow-hidden rounded-b-[40px] flex items-center justify-center">
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

      <div className="relative z-20 text-center px-6">
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
          Chinh Phục <br /> Đam Mê <span className="text-[#FFD800]">Hoa Lư</span>
        </h1>
        <p className="text-white/90 text-sm mb-8 max-w-xs mx-auto">
          Môi trường tập luyện chuyên nghiệp, năng động và thân thiện hàng đầu tại khu vực Hoa Lư.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link
            to="/register"
            className="ripple inline-flex items-center gap-2 bg-[#FFD800] text-[#4E9F3D] px-8 py-3 rounded-full font-bold shadow-xl transition-all hover:bg-white hover:scale-105"
          >
            THAM GIA NGAY <ArrowRight size={20} />
          </Link>
          <Link to="/shop" className="text-white text-xs font-bold underline underline-offset-4 flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            MUA SẮM DỤNG CỤ <ShoppingBag size={14} />
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

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": "CLB Bóng Bàn Hoa Lư",
    "description": "Câu lạc bộ bóng bàn uy tín hàng đầu khu vực Hoa Lư. Đào tạo bóng bàn chuyên nghiệp cho mọi lứa tuổi.",
    "url": "https://clbbongbanhoalu.vn",
    "logo": "https://clbbongbanhoalu.vn/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2 Đinh Tiên Hoàng, Đa Kao, Quận 1",
      "addressLocality": "Thành phố Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "CLB Bóng bàn Hoa Lư có lớp học cho người mới bắt đầu không?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Có, chúng tôi có các lớp đào tạo bóng bàn từ cơ bản đến nâng cao dành cho mọi lứa tuổi, từ trẻ em đến người lớn."
          }
        },
        {
          "@type": "Question",
          "name": "Chi phí thuê bàn bóng bàn tại Hoa Lư là bao nhiêu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Chi phí thuê bàn là 70.000đ/giờ. Ngoài ra chúng tôi còn có vé lượt 40.000đ và thẻ hội viên tháng 700.000đ."
          }
        },
        {
          "@type": "Question",
          "name": "Thời gian hoạt động của CLB như thế nào?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CLB mở cửa tất cả các ngày trong tuần. Thứ 2, 4, 6 từ 17h-19h; Thứ 3, 5, 7 từ 18h-20h; Chủ nhật từ 8h-11h."
          }
        }
      ]
    }
  };

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <SEO
        title="Trang Chủ - Đào Tạo & Giao Lưu Bóng Bàn Chuyên Nghiệp"
        description="Chào mừng đến với CLB Bóng bàn Hoa Lư - Môi trường tập luyện bóng bàn chuyên nghiệp, hiện đại hàng đầu với huấn luyện viên đội tuyển quốc gia."
        keywords="bóng bàn Hoa Lư, CLB bóng bàn Ninh Bình, học bóng bàn, thuê bàn bóng bàn, dụng cụ bóng bàn"
        schema={homeSchema}
      />
      <Hero />

      {/* Intro Section */}
      <section className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <article className="glass p-8 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden relative h-full">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7AC943]/10 rounded-full blur-2xl"></div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="text-[#4E9F3D]" size={32} /> Về CLB Bóng Bàn Hoa Lư
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              <strong>CLB Bóng bàn Hoa Lư</strong> tự hào là điểm đến mới dành cho những người yêu thích bóng bàn tại khu vực. Với trang thiết bị hiện đại, hệ thống bàn thi đấu đạt tiêu chuẩn ITTF, thảm Enlio chuyên nghiệp và đội ngũ huấn luyện viên tâm huyết, chúng tôi cam kết mang đến trải nghiệm tập luyện chất lượng nhất.
            </p>
            <p className="text-gray-500 text-sm italic">
              Dù bạn là người mới bắt đầu hay vận động viên có kinh nghiệm, Hoa Lư luôn có không gian phù hợp để bạn khám phá đam mê và phát triển kỹ năng.
            </p>
          </article>

          <nav className="grid grid-cols-2 gap-4 h-full" aria-label="Quick links">
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
