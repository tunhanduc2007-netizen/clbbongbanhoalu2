
import { Achievement, TrainingSession, GalleryItem, Product } from './types';

export const COLORS = {
  primary: '#7AC943',
  primaryDark: '#4E9F3D',
  accent: '#FFD800',
  accentLight: '#FFF3A0',
  white: '#FFFFFF'
};

export const ACHIEVEMENTS: Achievement[] = [
  { year: '2023', title: 'Huy chương vàng', description: 'Giải bóng bàn học sinh toàn quốc - khối THCS.' },
  { year: '2022', title: 'Giải nhất đồng đội', description: 'Giải đấu giao lưu các CLB khu vực phía Bắc.' },
  { year: '2021', title: 'Top 3 CLB xuất sắc', description: 'Được vinh danh bởi Liên đoàn bóng bàn TP.' }
];

export const SCHEDULE: TrainingSession[] = [
  { day: 'Thứ 2, 4, 6', time: '17:00 - 19:00', level: 'Cơ bản', coach: 'Thầy Hùng' },
  { day: 'Thứ 3, 5, 7', time: '18:00 - 20:00', level: 'Nâng cao', coach: 'Cô Lan' },
  { day: 'Chủ nhật', time: '08:00 - 11:00', level: 'Giao lưu', coach: 'Ban Quản lý' }
];

export const GALLERY: GalleryItem[] = [
  { url: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&q=80&w=800', title: 'Lễ ra mắt CLB' },
  { url: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&q=80&w=800', title: 'Giải đấu thường niên 2023' },
  { url: 'https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?auto=format&fit=crop&q=80&w=800', title: 'Buổi tập huấn kỹ thuật' },
  { url: 'https://images.unsplash.com/photo-1620067933100-845914498308?auto=format&fit=crop&q=80&w=800', title: 'Đội tuyển tham dự HKPĐ' }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vợt Butterfly Timo Boll ALC',
    price: '3.850.000đ',
    category: 'Cốt vợt',
    image: 'https://images.unsplash.com/photo-1620067933100-845914498308?auto=format&fit=crop&q=80&w=400',
    isHot: true
  },
  {
    id: '2',
    name: 'Mặt vợt Dignics 05',
    price: '1.950.000đ',
    category: 'Mặt vợt',
    image: 'https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?auto=format&fit=crop&q=80&w=400',
    isHot: true
  },
  {
    id: '3',
    name: 'Bóng Double Fish 3 Sao',
    price: '150.000đ/hộp',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    name: 'Giày Mizuno Wave Medal 6',
    price: '2.400.000đ',
    category: 'Giày',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'
  }
];
