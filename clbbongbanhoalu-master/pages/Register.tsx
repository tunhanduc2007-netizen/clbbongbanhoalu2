
import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const Input: React.FC<{ label: string, type: string, id: string }> = ({ label, type, id }) => {
  return (
    <div className="relative w-full mb-6 group">
      <input
        type={type}
        id={id}
        name={id}
        className="block py-4 px-4 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bdffff] peer transition-all"
        placeholder=" "
        required
      />
      <label
        htmlFor={id}
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-focus:text-[#0891b2] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
};

const Register: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const registerSchema = {
    "@context": "https://schema.org",
    "@type": "RegisterAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://clbbongbanhoalu.vn/register",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    },
    "object": {
      "@type": "SportEvent",
      "name": "Khóa học bóng bàn Hoa Lư"
    }
  };

  if (submitted) {
    return (
      <main className="px-6 py-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-[#bdffff]/20 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 size={60} className="text-[#0891b2]" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Ghi danh thành công!</h2>
        <p className="text-gray-500 max-w-xs mx-auto mb-10">
          Cảm ơn bạn đã lựa chọn Hoa Lư. Đội ngũ tư vấn sẽ sớm liên hệ với bạn qua số điện thoại để hoàn tất các thủ tục.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="ripple px-10 py-4 bg-[#bdffff] text-[#0891b2] rounded-full font-bold shadow-lg"
        >
          QUAY LẠI TRANG ĐĂNG KÝ
        </button>
      </main>
    );
  }

  return (
    <main className="px-6 py-8">
      <SEO
        title="Đăng Ký Hội Viên & Khóa Học - CLB Hoa Lư"
        description="Đăng ký gia nhập CLB Bóng bàn Hoa Lư trực tuyến. Nhận tư vấn lộ trình học bóng bàn từ chuyên gia và hưởng các đặc quyền hội viên hấp dẫn."
        keywords="đăng ký học bóng bàn, hội viên bóng bàn, ghi danh CLB Hoa Lư, học bóng bàn Ninh Bình"
        schema={registerSchema}
      />
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Gia nhập Hoa Lư</h1>
        <p className="text-gray-500 text-sm">Chỉ mất 30 giây để bắt đầu hành trình đam mê của bạn</p>
      </header>

      <form onSubmit={handleSubmit} className="glass p-8 rounded-[40px] shadow-sm border border-gray-100">
        <Input label="Họ và tên" type="text" id="full-name" />
        <Input label="Số điện thoại" type="tel" id="phone" />
        <Input label="Email liên hệ" type="email" id="email" />

        <section className="mb-8" aria-labelledby="goal-label">
          <label id="goal-label" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Mục tiêu tập luyện</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'health', label: 'Rèn luyện sức khỏe' },
              { id: 'basic', label: 'Học cơ bản' },
              { id: 'advanced', label: 'Nâng cao trình độ' },
              { id: 'pro', label: 'Thi đấu chuyên nghiệp' }
            ].map((goal) => (
              <label key={goal.id} htmlFor={goal.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border-2 border-transparent has-[:checked]:border-[#bdffff] has-[:checked]:bg-[#bdffff]/5 cursor-pointer transition-all">
                <input type="checkbox" id={goal.id} name="goal" className="w-4 h-4 text-[#0891b2] rounded" />
                <span className="text-[11px] font-bold text-gray-700 leading-tight">{goal.label}</span>
              </label>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="ripple w-full py-4 bg-gradient-to-r from-[#bdffff] to-[#0891b2] text-white rounded-[24px] font-bold shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          GỬI YÊU CẦU GHI DANH <Send size={20} />
        </button>

        <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
          Bằng cách đăng ký, bạn đồng ý với các chính sách bảo mật và nội quy hoạt động của CLB Bóng bàn Hoa Lư.
        </p>
      </form>

      <div className="mt-12 flex gap-4 overflow-x-auto pb-4 no-scrollbar" aria-label="Cam kết của chúng tôi">
        {[
          { icon: "🛡️", label: "Uy tín 5 năm" },
          { icon: "⚡", label: "Liên hệ trong 2h" },
          { icon: "💎", label: "Ưu đãi hội viên" }
        ].map((item, idx) => (
          <div key={idx} className="flex-shrink-0 bg-gray-50 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold text-gray-600">
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Register;
