
import React from 'react';

import SEO from '../components/SEO';


const About: React.FC = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "SportsClub",
      "name": "CLB Bóng Bàn Hoa Lư",
      "foundingDate": "2026",
      "description": "CLB Bóng bàn Hoa Lư - điểm đến mới dành cho những người yêu thích bóng bàn."
    }
  };

  return (
    <main className="px-6 py-8">
      <SEO
        title="Giới Thiệu - CLB Bóng Bàn Hoa Lư"
        description="Tìm hiểu về CLB Bóng bàn Hoa Lư - điểm đến mới dành cho những người yêu thích bóng bàn với cơ sở vật chất hiện đại và đội ngũ huấn luyện viên tâm huyết."
        keywords="CLB Hoa Lư, bóng bàn, câu lạc bộ bóng bàn mới"
        schema={aboutSchema}
      />
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Về CLB Hoa Lư</h1>
        <div className="w-20 h-1.5 bg-[#7AC943] mx-auto rounded-full"></div>
        <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm">
          Điểm đến mới dành cho những người yêu thích bóng bàn - nơi bạn có thể tập luyện, giao lưu và phát triển kỹ năng.
        </p>
      </header>

      {/* Timeline Section */}
      <section className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        <h2 className="sr-only">Khởi đầu</h2>

        <article className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#7AC943] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <span className="font-bold">26</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <time className="font-bold text-[#4E9F3D]">2026 - Khởi đầu hành trình</time>
            </div>
            <h3 className="text-gray-800 font-bold mb-1">Chính thức thành lập</h3>
            <p className="text-gray-500 text-sm">CLB Bóng bàn Hoa Lư được thành lập với sứ mệnh mang đến môi trường tập luyện chuyên nghiệp, hiện đại cho những người yêu thích bóng bàn tại khu vực.</p>
          </div>
        </article>
      </section>

      {/* Mục tiêu phát triển - thay thế phần thành tích */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Mục tiêu phát triển 🎯
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="bg-gradient-to-br from-[#7AC943]/5 to-transparent p-6 rounded-3xl border border-[#7AC943]/10 shadow-sm">
            <div className="text-xs font-bold text-[#4E9F3D] uppercase tracking-wider mb-1">2026</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Xây dựng nền tảng</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Hoàn thiện cơ sở vật chất, thu hút hội viên và xây dựng đội ngũ huấn luyện viên chất lượng.</p>
          </article>
          <article className="bg-gradient-to-br from-[#7AC943]/5 to-transparent p-6 rounded-3xl border border-[#7AC943]/10 shadow-sm">
            <div className="text-xs font-bold text-[#4E9F3D] uppercase tracking-wider mb-1">2027</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Mở rộng cộng đồng</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Tổ chức các giải đấu giao lưu, phát triển chương trình đào tạo trẻ em và mở rộng mạng lưới hội viên.</p>
          </article>
          <article className="bg-gradient-to-br from-[#7AC943]/5 to-transparent p-6 rounded-3xl border border-[#7AC943]/10 shadow-sm">
            <div className="text-xs font-bold text-[#4E9F3D] uppercase tracking-wider mb-1">2028</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Tham gia thi đấu</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Đưa các vận động viên tham gia các giải đấu cấp thành phố và khu vực.</p>
          </article>
          <article className="bg-gradient-to-br from-[#7AC943]/5 to-transparent p-6 rounded-3xl border border-[#7AC943]/10 shadow-sm">
            <div className="text-xs font-bold text-[#4E9F3D] uppercase tracking-wider mb-1">2030</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Vươn tầm chuyên nghiệp</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Trở thành một trong những CLB bóng bàn uy tín hàng đầu khu vực với đội ngũ VĐV đạt thành tích cao.</p>
          </article>
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
