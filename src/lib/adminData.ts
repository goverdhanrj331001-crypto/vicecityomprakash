export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  country: string;
  countryFlag: string;
  modTitle: string;
  modSlug: string;
  modCategory: string;
  paymentMethod: 'upi' | 'razorpay' | 'paypal' | 'binance' | 'nowpayments';
  amountUsd: number;
  amountInr: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  gatewayTxnId: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  author: string;
  downloads: number;
  rating: number;
  status: 'active' | 'featured' | 'hidden';
  fileSize: string;
  version: string;
  coverImage: string;
  zipUrl: string;
  description: string;
  createdDate: string;
  thumbnailImages?: string[];
  videoUrl?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  modsCount: number;
  revenue: number;
  status: 'active' | 'disabled';
}

export interface AdminTransaction {
  id: string;
  orderId: string;
  gateway: 'upi' | 'razorpay' | 'paypal' | 'binance' | 'nowpayments';
  gatewayRef: string;
  grossUsd: number;
  feeUsd: number;
  netUsd: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  customer: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'super_admin' | 'modder' | 'customer';
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'suspended';
  joinedDate: string;
  avatar: string;
}

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-9842',
    customerName: 'omprakasah Sharma',
    customerEmail: 'omprakasah@example.com',
    customerMobile: '0000000000',
    country: 'India',
    countryFlag: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
    modTitle: 'Purple Cat Girl Livery - Annis Elegy RH8',
    modSlug: 'purple-cat-girl-livery-annis-elegy-rh-7',
    modCategory: 'Paint Jobs',
    paymentMethod: 'upi',
    amountUsd: 4.99,
    amountInr: 415,
    status: 'completed',
    date: '2026-08-21 11:42 AM',
    gatewayTxnId: 'UPI/23984710293/PAYTM',
  },
  {
    id: 'ORD-9841',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@gmail.com',
    customerMobile: '14155552671',
    country: 'United States',
    countryFlag: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg',
    modTitle: 'Bugatti Chiron Super Sport 300+ Custom',
    modSlug: 'bugatti-chiron-super-sport-300',
    modCategory: 'Vehicles',
    paymentMethod: 'paypal',
    amountUsd: 9.99,
    amountInr: 830,
    status: 'completed',
    date: '2026-08-21 10:15 AM',
    gatewayTxnId: 'PAYPAL_883291049281',
  },
  {
    id: 'ORD-9840',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram.singh@yahoo.com',
    customerMobile: '9988776655',
    country: 'India',
    countryFlag: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
    modTitle: 'Realistic GTA 5 Graphics ENB ReShade 2026',
    modSlug: 'realistic-graphics-enb-reshade',
    modCategory: 'Scripts',
    paymentMethod: 'razorpay',
    amountUsd: 6.50,
    amountInr: 540,
    status: 'completed',
    date: '2026-08-21 09:30 AM',
    gatewayTxnId: 'pay_N83921839218',
  },
  {
    id: 'ORD-9839',
    customerName: 'Dmitry Volkov',
    customerEmail: 'dmitry.v@binance.me',
    customerMobile: '79123456789',
    country: 'Other Country',
    countryFlag: '',
    modTitle: 'Lamborghini Revuelto Hybrid 2025 Add-On',
    modSlug: 'lamborghini-revuelto-2025',
    modCategory: 'Vehicles',
    paymentMethod: 'binance',
    amountUsd: 12.00,
    amountInr: 1000,
    status: 'completed',
    date: '2026-08-21 08:05 AM',
    gatewayTxnId: 'BINANCE_USDT_881920192',
  },
  {
    id: 'ORD-9838',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@hotmail.com',
    customerMobile: '9123456780',
    country: 'India',
    countryFlag: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
    modTitle: 'Ultra Sound Pack - Real V8 & V10 Engines',
    modSlug: 'ultra-sound-pack-real-v8',
    modCategory: 'Scripts',
    paymentMethod: 'upi',
    amountUsd: 3.50,
    amountInr: 290,
    status: 'completed',
    date: '2026-08-21 07:45 AM',
    gatewayTxnId: 'UPI_SUCCESS_PAYTM',
  },
  {
    id: 'ORD-9837',
    customerName: 'Michael De Santa',
    customerEmail: 'michael@los-santos.com',
    customerMobile: '13105550192',
    country: 'United States',
    countryFlag: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg',
    modTitle: 'Los Santos Customs Interior Expanded',
    modSlug: 'lsc-interior-expanded',
    modCategory: 'Maps',
    paymentMethod: 'paypal',
    amountUsd: 7.99,
    amountInr: 665,
    status: 'completed',
    date: '2026-08-20 11:20 PM',
    gatewayTxnId: 'PAYPAL_881029381029',
  },
];

export const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'MOD-001',
    title: 'Purple Cat Girl Livery - Annis Elegy RH8',
    slug: 'purple-cat-girl-livery-annis-elegy-rh-7',
    category: 'Paint Jobs',
    price: 4.99,
    author: 'GtaModderPro',
    downloads: 1420,
    rating: 4.9,
    status: 'featured',
    fileSize: '48.5 MB',
    version: '1.2.0',
    coverImage: 'https://files.gta5-mods.com/images/purple-cat-girl-livery-annis-elegy-rh-8/3fa18f-2.jpg',
    zipUrl: '/downloads/purple-cat-girl-livery.zip',
    description: 'High resolution 4K anime cat girl custom livery for the Annis Elegy RH8 with metallic gloss finish.',
    createdDate: '2026-07-15',
  },
  {
    id: 'MOD-002',
    title: 'Bugatti Chiron Super Sport 300+ Custom',
    slug: 'bugatti-chiron-super-sport-300',
    category: 'Vehicles',
    price: 9.99,
    author: 'SuperCarStudio',
    downloads: 3890,
    rating: 5.0,
    status: 'featured',
    fileSize: '124 MB',
    version: '2.1.0',
    coverImage: 'https://files.gta5-mods.com/images/2021-bugatti-chiron-super-sport-300-add-on-tuning-auto-spoiler/792c0b-1.jpg',
    zipUrl: '/downloads/bugatti-chiron.zip',
    description: 'Ultra detailed Bugatti Chiron Super Sport with custom engine sound, auto-spoiler, and tuning options.',
    createdDate: '2026-06-10',
  },
  {
    id: 'MOD-003',
    title: 'Realistic GTA 5 Graphics ENB ReShade 2026',
    slug: 'realistic-graphics-enb-reshade',
    category: 'Scripts',
    price: 6.50,
    author: 'VisualFX_Labs',
    downloads: 8210,
    rating: 4.8,
    status: 'active',
    fileSize: '310 MB',
    version: '4.0.1',
    coverImage: 'https://files.gta5-mods.com/images/naturalvision-evolved/5bb36d-1.jpg',
    zipUrl: '/downloads/enb-reshade-2026.zip',
    description: 'Photorealistic weather, reflections, ray-traced lighting presets, and zero FPS loss optimizer.',
    createdDate: '2026-05-20',
  },
  {
    id: 'MOD-004',
    title: 'Lamborghini Revuelto Hybrid 2025 Add-On',
    slug: 'lamborghini-revuelto-2025',
    category: 'Vehicles',
    price: 12.00,
    author: 'ExoticMotors',
    downloads: 2150,
    rating: 4.9,
    status: 'featured',
    fileSize: '98 MB',
    version: '1.0.4',
    coverImage: 'https://files.gta5-mods.com/images/2024-lamborghini-revuelto-add-on-template/a408c0-1.jpg',
    zipUrl: '/downloads/lambo-revuelto.zip',
    description: 'V12 hybrid engine, working digital dashboard, active aerodynamics, and full tuning parts.',
    createdDate: '2026-08-01',
  },
  {
    id: 'MOD-005',
    title: 'Ultra Sound Pack - Real V8 & V10 Engines',
    slug: 'ultra-sound-pack-real-v8',
    category: 'Scripts',
    price: 3.50,
    author: 'AudioEngineers',
    downloads: 5410,
    rating: 4.7,
    status: 'active',
    fileSize: '215 MB',
    version: '3.0.0',
    coverImage: 'https://files.gta5-mods.com/images/real-engine-sounds-pack/129a01-1.jpg',
    zipUrl: '/downloads/ultra-sound-pack.zip',
    description: 'Over 60 authentic engine sound recordings for supercars, muscle, and JDM vehicles in GTA V.',
    createdDate: '2026-04-11',
  },
  {
    id: 'MOD-006',
    title: 'Los Santos Customs Interior Expanded',
    slug: 'lsc-interior-expanded',
    category: 'Maps',
    price: 7.99,
    author: 'MapMakerLS',
    downloads: 1890,
    rating: 4.8,
    status: 'active',
    fileSize: '64 MB',
    version: '1.1.0',
    coverImage: 'https://files.gta5-mods.com/images/los-santos-customs-interior-mlo/8182cd-1.jpg',
    zipUrl: '/downloads/lsc-interior.zip',
    description: 'Full MLO interior for Los Santos Customs with dyno room, waiting lounge, and custom mechanics.',
    createdDate: '2026-07-22',
  },
];

export const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: 'cat-1', name: 'Vehicles', slug: 'vehicles', icon: 'fa-car', modsCount: 142, revenue: 12450, status: 'active' },
  { id: 'cat-2', name: 'Paint Jobs', slug: 'paintjobs', icon: 'fa-paint-brush', modsCount: 68, revenue: 4890, status: 'active' },
  { id: 'cat-3', name: 'Scripts', slug: 'scripts', icon: 'fa-code', modsCount: 52, revenue: 3820, status: 'active' },
  { id: 'cat-4', name: 'Weapons', slug: 'weapons', icon: 'fa-crosshairs', modsCount: 24, revenue: 1120, status: 'active' },
  { id: 'cat-5', name: 'Player & Peds', slug: 'player', icon: 'fa-user-secret', modsCount: 19, revenue: 950, status: 'active' },
  { id: 'cat-6', name: 'Maps & MLO', slug: 'maps', icon: 'fa-map-marker', modsCount: 15, revenue: 1620, status: 'active' },
  { id: 'cat-7', name: 'Tools & Utilities', slug: 'tools', icon: 'fa-wrench', modsCount: 8, revenue: 0, status: 'active' },
];

export const INITIAL_TRANSACTIONS: AdminTransaction[] = [
  { id: 'TXN-77491', orderId: 'ORD-9842', gateway: 'upi', gatewayRef: 'UPI/23984710293/PAYTM', grossUsd: 4.99, feeUsd: 0.05, netUsd: 4.94, status: 'success', date: '2026-08-21 11:42 AM', customer: 'omprakasah Sharma' },
  { id: 'TXN-77490', orderId: 'ORD-9841', gateway: 'paypal', gatewayRef: 'PAYPAL_883291049281', grossUsd: 9.99, feeUsd: 0.49, netUsd: 9.50, status: 'success', date: '2026-08-21 10:15 AM', customer: 'Alex Rivera' },
  { id: 'TXN-77489', orderId: 'ORD-9840', gateway: 'razorpay', gatewayRef: 'pay_N83921839218', grossUsd: 6.50, feeUsd: 0.13, netUsd: 6.37, status: 'success', date: '2026-08-21 09:30 AM', customer: 'Vikram Singh' },
  { id: 'TXN-77488', orderId: 'ORD-9839', gateway: 'binance', gatewayRef: 'BINANCE_USDT_881920192', grossUsd: 12.00, feeUsd: 0.12, netUsd: 11.88, status: 'success', date: '2026-08-21 08:05 AM', customer: 'Dmitry Volkov' },
  { id: 'TXN-77487', orderId: 'ORD-9838', gateway: 'upi', gatewayRef: 'UPI/88392183120/PAYTM', grossUsd: 3.50, feeUsd: 0.04, netUsd: 3.46, status: 'success', date: '2026-08-21 07:45 AM', customer: 'Rahul Verma' },
];

export const INITIAL_USERS: AdminUser[] = [
  { id: 'USR-001', name: 'omprakasah Admin', email: 'om961074@gmail.com', mobile: '0000000000', role: 'super_admin', ordersCount: 18, totalSpent: 142.50, status: 'active', joinedDate: '2026-01-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  { id: 'USR-002', name: 'Alex Rivera', email: 'alex.rivera@gmail.com', mobile: '14155552671', role: 'customer', ordersCount: 4, totalSpent: 38.96, status: 'active', joinedDate: '2026-03-12', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
  { id: 'USR-003', name: 'GtaModderPro', email: 'modderpro@5mods.com', mobile: '9123456789', role: 'modder', ordersCount: 1, totalSpent: 4.99, status: 'active', joinedDate: '2026-02-18', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { id: 'USR-004', name: 'Vikram Singh', email: 'vikram.singh@yahoo.com', mobile: '9988776655', role: 'customer', ordersCount: 6, totalSpent: 52.00, status: 'active', joinedDate: '2026-04-05', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80' },
  { id: 'USR-005', name: 'Dmitry Volkov', email: 'dmitry.v@binance.me', mobile: '79123456789', role: 'customer', ordersCount: 2, totalSpent: 24.00, status: 'active', joinedDate: '2026-05-20', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80' },
];

export interface PaymentGatewaysConfig {
  upi: {
    enabled: boolean;
    vpaId: string;
    merchantName: string;
    qrCodeUrl: string;
    autoVerifySms: boolean;
  };
  razorpay: {
    enabled: boolean;
    keyId: string;
    keySecret: string;
    webhookSecret: string;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    secretKey: string;
    mode: 'sandbox' | 'live';
  };
  binance: {
    enabled: boolean;
    merchantId: string;
    apiKey: string;
    secretKey: string;
    currency: string;
  };
  nowpayments: {
    enabled: boolean;
    apiKey: string;
    ipnSecret: string;
    sandbox: boolean;
  };
}

export const INITIAL_PAYMENT_CONFIG: PaymentGatewaysConfig = {
  upi: {
    enabled: true,
    vpaId: '5mods@upi',
    merchantName: '5MODS Official Store',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=5mods@upi&pn=5MODS',
    autoVerifySms: true,
  },
  razorpay: {
    enabled: true,
    keyId: 'rzp_live_5MODS_983218',
    keySecret: '••••••••••••••••••••••••',
    webhookSecret: 'whsec_5mods_live_891',
  },
  paypal: {
    enabled: true,
    clientId: 'PAYPAL_CLIENT_ID_5MODS_LIVE',
    secretKey: '••••••••••••••••••••••••',
    mode: 'live',
  },
  binance: {
    enabled: true,
    merchantId: 'BINANCE_MERCHANT_391029',
    apiKey: 'bnc_api_key_5mods_2026',
    secretKey: '••••••••••••••••••••••••',
    currency: 'USDT',
  },
  nowpayments: {
    enabled: true,
    apiKey: 'now_api_key_5mods_2026',
    ipnSecret: 'whsec_nowpayments_5mods',
    sandbox: true,
  },
};

export interface SiteSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  commissionRate: number;
  usdToInrRate: number;
  smsApiUrl: string;
  smsApiKey: string;
  smsSenderId: string;
  maintenanceMode: boolean;
  forceSsl: boolean;
  requireMobileOtp: boolean;
}

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  storeName: '5MODS - GTA 5 Modding Hub',
  supportEmail: 'support@5mods.com',
  supportPhone: '+91 0000000000',
  commissionRate: 15,
  usdToInrRate: 83.50,
  smsApiUrl: 'https://api.textlocal.in/send/',
  smsApiKey: 'SMS_API_KEY_5MODS_SECURE',
  smsSenderId: '5MODS',
  maintenanceMode: false,
  forceSsl: true,
  requireMobileOtp: true,
};
