// ─── Mod / File Types ───────────────────────────────────────────────────────

export type ModCategory =
  | 'tools'
  | 'vehicles'
  | 'paintjobs'
  | 'weapons'
  | 'scripts'
  | 'player'
  | 'maps'
  | 'misc';

export interface ModVersion {
  version: string;
  isCurrent: boolean;
  downloads: number;
  fileSize: string;
  uploadedAt: string;
  downloadUrl: string;
  virusTotalUrl?: string;
  virusTotalHash?: string;
}

export interface ModStats {
  downloads: number;
  likes: number;
  rating?: number;
  commentsCount: number;
}

export interface ModTag {
  name: string;
  slug: string;
}

export interface Mod {
  id: number;
  slug: string;
  title: string;
  version: string;
  category: ModCategory;
  subCategories: string[];
  author: ModAuthor;
  stats: ModStats;
  tags: ModTag[];
  description: string;
  coverImage: string;
  thumbnailImages: string[];
  videoUrl?: string;
  allVersions: ModVersion[];
  firstUploadedAt: string;
  lastUpdatedAt: string;
  isFeatured?: boolean;
  price?: number;
  fileSize?: string;
}

export interface FeaturedMod {
  slug: string;
  title: string;
  version: string;
  author: string;
  coverImage: string;
  thumbnailImage: string;
  category: ModCategory;
}

// ─── User Types ─────────────────────────────────────────────────────────────

export interface ModAuthor {
  username: string;
  avatarUrl?: string;
  discordUrl?: string;
  twitterUrl?: string;
  patreonUrl?: string;
  socialClubUrl?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  authenticated: boolean;
}

// ─── Comment Types ───────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  author: ModAuthor;
  body: string;
  createdAt: string;
  isPinned?: boolean;
}

// ─── Navigation Types ────────────────────────────────────────────────────────

export interface NavCategory {
  slug: ModCategory;
  label: string;
  image: string;
}

export interface Language {
  code: string;
  name: string;
  flagClass: string;
  path: string;
}

// ─── Page / Layout Types ─────────────────────────────────────────────────────

export interface SiteMetadata {
  title: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  locale?: string;
  alternateLocales?: { hreflang: string; href: string }[];
  structuredData?: Record<string, unknown>;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
  isImage?: boolean;
  imageSrc?: string;
}

export interface FooterSection {
  links: FooterLink[];
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export type SortOption = 'latest-uploads' | 'most-liked' | 'most-downloaded' | 'highest-rated';
