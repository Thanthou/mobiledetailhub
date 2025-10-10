// Gallery image types - shared across features

export interface GalleryImage {
  id: string;
  src: string;
  type: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  title: string;
  thumbnailUrl: string;
  variants: ImageVariant[];
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  datePublished: string;
  dateModified: string;
  author: string;
  license: string;
  tags: string[];
  hash: string;
}

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
  type: string;
}

