
export interface Achievement {
  year: string;
  title: string;
  description: string;
}

export interface TrainingSession {
  day: string;
  time: string;
  level: string;
  coach: string;
}

export interface GalleryItem {
  url: string;
  title: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  isHot?: boolean;
}
