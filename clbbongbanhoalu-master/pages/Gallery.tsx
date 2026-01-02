
import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { GALLERY } from '../constants';

import SEO from '../components/SEO';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Thư viện ảnh CLB Bóng bàn Hoa Lư",
    "description": "Những hình ảnh đẹp nhất của các thành viên trong các buổi tập và thi đấu.",
    "image": GALLERY.map(img => img.url)
  };

  return (
    <main className="px-6 py-8">
      <SEO
        title="Thư Viện Ảnh - Những Khoảnh Khắc Đẹp Tại CLB Hoa Lư"
        description="Tổng hợp những hình ảnh đẹp, khoảnh khắc đáng nhớ trong tập luyện và thi đấu của các thành viên CLB Bóng bàn Hoa Lư."
        keywords="ảnh bóng bàn, hoạt động CLB Hoa Lư, thành viên CLB bóng bàn"
        schema={gallerySchema}
      />
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Khoảnh khắc Hoa Lư</h1>
        <p className="text-gray-500 text-sm">Ghi lại những dấu ấn đáng nhớ trong hành trình đam mê</p>
      </header>

      {/* Masonry Grid using Tailwind Columns */}
      <section className="columns-2 gap-4 space-y-4" aria-label="Bộ sưu tập hình ảnh">
        {GALLERY.map((item, idx) => (
          <article
            key={idx}
            className="relative break-inside-avoid rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-gray-100"
            onClick={() => setSelectedImage(item.url)}
          >
            <img
              src={item.url}
              alt={item.title || "Hình ảnh sinh hoạt tại CLB Bóng bàn Hoa Lư"}
              width="400"
              height="400"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white" size={32} />
            </div>
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform"
            aria-label="Đóng ảnh"
          >
            <X size={40} />
          </button>
          <img
            src={selectedImage}
            alt="Ảnh phóng to"
            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <footer className="mt-12 text-center p-10 bg-gray-50 rounded-[40px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bạn có khoảnh khắc đẹp tại CLB?</h2>
        <p className="text-sm text-gray-500 mb-8">Chia sẻ những hình ảnh tập luyện và thi đấu của bạn với cộng đồng Hoa Lư.</p>
        <button className="px-8 py-3 bg-white border-2 border-[#7AC943] text-[#4E9F3D] rounded-full font-bold hover:bg-[#7AC943] hover:text-white transition-all">
          GỬI ẢNH CỦA BẠN CHO CHÚNG TÔI
        </button>
      </footer>
    </main>
  );
};

export default Gallery;
