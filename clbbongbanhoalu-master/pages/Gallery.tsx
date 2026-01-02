
import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { GALLERY } from '../constants';

import SEO from '../components/SEO';

const Gallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Thư viện ảnh CLB Bóng bàn Hoa Lư",
    "description": "Những hình ảnh đẹp nhất của các thành viên trong các buổi tập và thi đấu.",
    "image": GALLERY.map(img => img.url)
  };

  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % GALLERY.length);
    }
  };

  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + GALLERY.length) % GALLERY.length);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') setSelectedIndex(null);
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
        <div className="flex items-center justify-center gap-2 text-[#4E9F3D] mb-3">
          <ImageIcon size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Thư Viện</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Khoảnh Khắc Hoa Lư</h1>
        <p className="text-gray-500 text-sm font-medium">Ghi lại những dấu ấn đáng nhớ trong hành trình đam mê bóng bàn</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-700">{GALLERY.length} ảnh trong bộ sưu tập</span>
        </div>
      </header>

      {/* Masonry Grid */}
      <section className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" aria-label="Bộ sưu tập hình ảnh">
        {GALLERY.map((item, idx) => (
          <article
            key={idx}
            className="relative break-inside-avoid rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-gray-100 hover:shadow-xl transition-all"
            onClick={() => setSelectedIndex(idx)}
          >
            <img
              src={item.url}
              alt={item.title || "Hình ảnh sinh hoạt tại CLB Bóng bàn Hoa Lư"}
              width="400"
              height="400"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <ZoomIn className="text-white" size={28} strokeWidth={2.5} />
              </div>
            </div>
            {item.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Enhanced Lightbox with Navigation */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center p-6"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={handleKeyPress}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-full transition-all z-10"
            aria-label="Đóng ảnh"
            onClick={() => setSelectedIndex(null)}
          >
            <X size={32} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold">
            {selectedIndex + 1} / {GALLERY.length}
          </div>

          {/* Previous Button */}
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full text-white transition-all"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Main Image */}
          <div className="max-w-6xl max-h-[85vh] relative">
            <img
              src={GALLERY[selectedIndex].url}
              alt={GALLERY[selectedIndex].title || "Ảnh phóng to"}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {GALLERY[selectedIndex].title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-2xl">
                <p className="text-white text-base font-bold">{GALLERY[selectedIndex].title}</p>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full text-white transition-all"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight size={32} />
          </button>

          {/* Keyboard Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ChevronLeft size={14} /> Trước
            </span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1">
              Kế tiếp <ChevronRight size={14} />
            </span>
            <span className="text-white/40">|</span>
            <span>ESC để đóng</span>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center p-12 bg-gradient-to-r from-green-50 to-yellow-50 rounded-[40px] border border-green-100">
        <h2 className="text-2xl font-black text-gray-800 mb-3">Bạn có khoảnh khắc đẹp tại CLB?</h2>
        <p className="text-sm text-gray-600 mb-8 font-medium">Chia sẻ những hình ảnh tập luyện và thi đấu của bạn với cộng đồng Hoa Lư.</p>
        <button className="px-8 py-4 bg-white border-2 border-[#7AC943] text-[#4E9F3D] rounded-full font-black uppercase text-sm hover:bg-[#7AC943] hover:text-white transition-all shadow-lg hover:shadow-xl">
          📸 Gửi Ảnh Của Bạn Cho Chúng Tôi
        </button>
      </footer>
    </main>
  );
};

export default Gallery;
