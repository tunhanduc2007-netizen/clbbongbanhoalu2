
import React, { useState } from 'react';
import { ShoppingBag, Search, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';

const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const categories = ['Tất cả', 'Cốt vợt', 'Mặt vợt', 'Giày', 'Phụ kiện'];

  const filteredProducts = activeCategory === 'Tất cả'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

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
        "offers": {
          "@type": "Offer",
          "price": p.price.replace(/[^0-9]/g, ''),
          "priceCurrency": "VND"
        }
      }
    }))
  };

  return (
    <main className="px-6 py-8">
      <SEO
        title="Cửa Hàng Dụng Cụ Bóng Bàn Chính Hãng - Hoa Lư"
        description="Mua sắm cốt vợt, mặt vợt, giày và phụ kiện bóng bàn chính hãng từ các thương hiệu hàng đầu: Butterfly, DHS, Stiga. Tư vấn chuyên nghiệp từ HLV."
        keywords="dụng cụ bóng bàn, mua vợt bóng bàn, mặt vợt bóng bàn, giày bóng bàn, Butterfly, DHS"
        schema={shopSchema}
      />
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Dụng cụ bóng bàn chuyên nghiệp</h1>
        <p className="text-gray-500 text-sm">Trang bị tốt nhất cho hành trình chinh phục đỉnh cao của bạn</p>
      </header>

      {/* Search & Filter UI */}
      <section className="mb-8 space-y-4" aria-label="Bộ lọc sản phẩm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Bạn đang tìm kiếm dụng cụ gì?"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7AC943] transition-all"
          />
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Danh mục sản phẩm">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                ? 'bg-[#7AC943] text-white shadow-md'
                : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-2 gap-4" aria-label="Danh sách sản phẩm">
        {filteredProducts.map((product) => (
          <article key={product.id} className="group relative glass rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            {product.isHot && (
              <div className="absolute top-3 left-3 z-10 bg-[#FFD800] text-[#4E9F3D] text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
                HOT
              </div>
            )}

            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src={product.image}
                alt={`Sản phẩm ${product.name}`}
                loading="lazy"
                width="200"
                height="200"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="p-4">
              <span className="text-[10px] font-bold text-[#7AC943] uppercase tracking-wider">{product.category}</span>
              <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-1">{product.name}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[#4E9F3D] font-black text-xs">{product.price}</span>
                <button aria-label={`Thêm ${product.name} vào giỏ hàng`} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#7AC943] hover:text-white transition-all">
                  <ShoppingBag size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Promo Banner */}
      <section className="mt-12 bg-gradient-to-r from-[#FFD800] to-[#FFF3A0] p-8 rounded-[40px] relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <ShoppingBag size={120} className="text-[#4E9F3D]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-black text-[#4E9F3D] mb-2">Đặc quyền hội viên</h2>
          <p className="text-xs text-[#4E9F3D]/80 mb-6 leading-relaxed">Giảm ngay 10% khi mua các loại mặt vợt và phụ kiện bóng bàn dành riêng cho hội viên chính thức của CLB Hoa Lư.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-[#4E9F3D] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg">
            ĐĂNG KÝ HỘI VIÊN NGAY <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <footer className="mt-12 text-center p-8 bg-gray-50 rounded-[32px]">
        <h4 className="font-bold text-gray-800 mb-2">Tư vấn chọn dụng cụ?</h4>
        <p className="text-xs text-gray-500 mb-6">Đội ngũ HLV chuyên nghiệp sẽ giúp bạn tìm được cốt vợt và mặt vợt phù hợp nhất với lối đánh của mình.</p>
        <Link to="/register" className="block w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold text-sm hover:border-[#7AC943] hover:text-[#7AC943] transition-all">
          CHAT TƯ VẤN CÙNG HLV
        </Link>
      </footer>
    </main>
  );
};

export default Shop;
