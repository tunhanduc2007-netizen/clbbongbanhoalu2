
import React from 'react';
import { ACHIEVEMENTS } from '../constants';

import SEO from '../components/SEO';


const About: React.FC = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "SportsClub",
      "name": "CLB Bóng Bàn Hoa Lư",
      "foundingDate": "2020",
      "description": "Hành trình phát triển và những thành tựu tiêu biểu của CLB Bóng bàn Hoa Lư."
    }
  };

  return (
    <main className="px-6 py-8">
      <SEO
        title="Giới Thiệu - Hành Trình & Thành Tích CLB Hoa Lư"
        description="Khám phá lịch sử hình thành, tầm nhìn và bảng vàng thành tích của CLB Bóng bàn Hoa Lư. Nơi hội tụ đam mê và tài năng bóng bàn."
        keywords="lịch sử CLB Hoa Lư, thành tích bóng bàn, câu lạc bộ bóng bàn uy tín"
        schema={aboutSchema}
      />
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Hành trình Hoa Lư</h1>
        <div className="w-20 h-1.5 bg-[#7AC943] mx-auto rounded-full"></div>
        <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm">
          Từ những ngày đầu khởi nghiệp đến khi trở thành trung tâm đào tạo bóng bàn hàng đầu khu vực TP. Hồ Chí Minh.
        </p>
      </header>

      {/* Timeline Section */}
      <section className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        <h2 className="sr-only">Cột mốc lịch sử</h2>

        <article className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white text-[#4E9F3D] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <span className="font-bold serif-logo">HL</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <time className="font-bold text-[#4E9F3D]">2020 - Khởi nguồn</time>
            </div>
            <h3 className="text-gray-800 font-bold mb-1">Gắn kết đam mê</h3>
            <p className="text-gray-500 text-sm">CLB Hoa Lư bắt đầu từ những buổi giao lưu nhỏ lẻ của các anh em yêu bóng bàn, dần trở thành biểu tượng bóng bàn khu vực.</p>
          </div>
        </article>

        <article className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#7AC943] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <span className="font-bold">26</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <time className="font-bold text-[#4E9F3D]">2026 - Hiện tại</time>
            </div>
            <h3 className="text-gray-800 font-bold mb-1">Vươn tầm chuyên nghiệp</h3>
            <p className="text-gray-500 text-sm">Hiện sở hữu hàng chục VĐV đạt thứ hạng cao trong các giải đấu chuyên nghiệp toàn quốc và hệ thống cơ sở vật chất hiện đại.</p>
          </div>
        </article>
      </section>

      {/* Achievement Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Bảng vàng thành tích 🏆
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((item, idx) => (
            <article key={idx} className="bg-gradient-to-br from-[#7AC943]/5 to-transparent p-6 rounded-3xl border border-[#7AC943]/10 shadow-sm">
              <div className="text-xs font-bold text-[#4E9F3D] uppercase tracking-wider mb-1">{item.year}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 glass p-8 rounded-[40px] text-center border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tầm nhìn & sứ mệnh</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Chúng tôi không chỉ dạy bóng bàn, chúng tôi xây dựng một cộng đồng thể thao lành mạnh, nơi mỗi cá nhân đều có cơ hội phát triển tối đa tiềm năng bản thân thông qua sự rèn luyện và kỷ luật.
        </p>
      </section>
    </main>
  );
};

export default About;
