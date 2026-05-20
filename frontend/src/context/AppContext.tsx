'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../locales/dictionary';

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'ShopOwner' | 'SuperAdmin';
  languagePreference?: Language;
  darkModePreference?: boolean;
}

export interface Shop {
  id: string;
  shopName: string;
  shopLogo: string;
  shopBanner: string;
  description: string;
  ownerId: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  categories: string[];
  deliveryAvailability: boolean;
  ratings: number;
  isApproved: boolean;
  isSuspended?: boolean;
  followersCount: number;
}

export interface Product {
  id: string;
  shopId: string;
  title: string;
  description: string;
  category: 'Men' | 'Women' | 'Kids' | 'Accessories';
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  price: number;
  discount: number; // Percentage, e.g. 15 for 15% off
  ratings: number;
  reviewsCount: number;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  shopName: string;
  products: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    image: string;
  }[];
  totalAmount: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  shopId: string;
  rating: number;
  comment: string;
  isSpam: boolean;
  isHidden: boolean;
  createdAt: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  shops: Shop[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  cart: CartItem[];
  followedShops: string[];
  selectedShopId: string | null;
  language: Language;
  darkMode: boolean;
  
  // Auth Functions
  login: (email: string, role: string) => boolean;
  register: (name: string, email: string, role: 'Customer' | 'ShopOwner', shopDetails?: any) => boolean;
  logout: () => void;
  updateUserPreferences: (lang: Language, theme: boolean) => void;

  // Shop Owner / Super Admin Controls
  approveShop: (shopId: string) => void;
  suspendShop: (shopId: string) => void;
  deleteShop: (shopId: string) => void;
  updateShop: (shopId: string, updatedFields: Partial<Shop>) => void;
  followShop: (shopId: string) => void;
  selectShop: (shopId: string | null) => void;
  
  // Product Operations
  addProduct: (product: Omit<Product, 'id' | 'ratings' | 'reviewsCount'>) => void;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Cart Operations
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  checkout: (shippingAddress: string, couponCode?: string) => void;

  // Order Operations
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;

  // Review Operations
  addReview: (productId: string, shopId: string, rating: number, comment: string) => void;
  toggleReviewVisibility: (reviewId: string) => void;

  // User Operations
  deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- MOCK DATABASE PRELOADS ---
  const initialUsers: User[] = [
    { id: 'usr-1', name: 'Jane Doe', email: 'customer@luxe.com', role: 'Customer' },
    { id: 'usr-2', name: 'Alexander McQueen', email: 'owner1@luxe.com', role: 'ShopOwner' },
    { id: 'usr-3', name: 'Coco Chanel', email: 'owner2@luxe.com', role: 'ShopOwner' },
    { id: 'usr-4', name: 'Christian Dior', email: 'owner3@luxe.com', role: 'ShopOwner' },
    { id: 'usr-admin', name: 'Alex Mercer', email: 'admin@luxe.com', role: 'SuperAdmin' },
  ];

  const initialShops: Shop[] = [
    {
      id: 'shop-1',
      shopName: 'Aura Boutique',
      shopLogo: '✨',
      shopBanner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      description: 'Elegant minimalist designs featuring fine silk dresses, tailored linen silhouettes, and curated haute couture.',
      ownerId: 'usr-2',
      address: '742 Luxury Avenue, Fashion District, NY',
      contactEmail: 'contact@auraboutique.com',
      contactPhone: '+1 (555) 019-2834',
      categories: ['Women', 'Accessories'],
      deliveryAvailability: true,
      ratings: 4.8,
      isApproved: true,
      followersCount: 1420,
    },
    {
      id: 'shop-2',
      shopName: 'Vogue Atelier',
      shopLogo: '👠',
      shopBanner: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80',
      description: 'Contemporary street fashion, bold outerwear, and premium customized raw denim designed for the vanguard.',
      ownerId: 'usr-3',
      address: '109 Cyber Street, Brooklyn, NY',
      contactEmail: 'hello@vogueatelier.com',
      contactPhone: '+1 (555) 083-9912',
      categories: ['Men', 'Women'],
      deliveryAvailability: true,
      ratings: 4.6,
      isApproved: true,
      followersCount: 3120,
    },
    {
      id: 'shop-3',
      shopName: 'Dior Petits',
      shopLogo: '👑',
      shopBanner: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=1200&q=80',
      description: 'Charming, premium organic apparel and bespoke linen silhouettes for infants, toddlers, and young royalty.',
      ownerId: 'usr-4',
      address: '5 Avenue Montaigne, Paris, FR',
      contactEmail: 'info@diorpetits.com',
      contactPhone: '+33 1 40 73 73 73',
      categories: ['Kids'],
      deliveryAvailability: false,
      ratings: 4.2,
      isApproved: true,
      followersCount: 890,
    },
    {
      id: 'shop-4',
      shopName: 'Golden Weaves',
      shopLogo: '⚜️',
      shopBanner: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      description: 'Exquisite traditional handloom sarees, bespoke sherwanis, and high-fashion luxury ethnic apparel.',
      ownerId: 'usr-3', // Can register more than one, or simulate a new one
      address: 'Heritage Court, Jaipur, IN',
      contactEmail: 'weaves@goldenweaves.com',
      contactPhone: '+91 98765 43210',
      categories: ['Men', 'Women', 'Accessories'],
      deliveryAvailability: true,
      ratings: 0,
      isApproved: false, // Pending approval to demo Admin action
      followersCount: 0,
    }
  ];

  const initialProducts: Product[] = [
    // Shop 1 (Aura Boutique) Products
    {
      id: 'prod-1',
      shopId: 'shop-1',
      title: 'Minimalist Ivory Silk Slip Dress',
      description: 'Exquisitely tailored from double-faced Italian mulberry silk. Features a cowl neckline, elegant bias cut, and delicate adjustable spaghetti straps. Perfect for luxurious summer evenings.',
      category: 'Women',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Ivory', 'Midnight Black', 'Champagne Gold'],
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'],
      stock: 12,
      price: 249,
      discount: 10,
      ratings: 4.9,
      reviewsCount: 3
    },
    {
      id: 'prod-2',
      shopId: 'shop-1',
      title: 'Structured Cashmere Trench Coat',
      description: 'A timeless silhouette engineered in 100% premium Mongolian cashmere. Featuring sharp lapels, dynamic storm flaps, and an elegant waist tie belt for custom contours.',
      category: 'Women',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Camel Beige', 'Midnight Black', 'Slate Grey'],
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'],
      stock: 8,
      price: 599,
      discount: 0,
      ratings: 4.8,
      reviewsCount: 2
    },
    {
      id: 'prod-3',
      shopId: 'shop-1',
      title: 'Aura Quartz Statement Necklace',
      description: 'Bespoke hand-crafted necklace made with raw Brazilian clear quartz crystals wrapped in premium 24k gold-filled wire on a delicate 18-inch cable chain.',
      category: 'Accessories',
      sizes: ['One Size'],
      colors: ['24K Gold', 'Sterling Silver'],
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'],
      stock: 15,
      price: 135,
      discount: 15,
      ratings: 4.7,
      reviewsCount: 1
    },

    // Shop 2 (Vogue Atelier) Products
    {
      id: 'prod-4',
      shopId: 'shop-2',
      title: 'Sartorial Oversized Leather Moto Jacket',
      description: 'Constructed from top-grain distressed calfskin leather. Embellished with heavy duty silver hardware, asymmetrical zippers, and utility cargo pocket detailing.',
      category: 'Men',
      sizes: ['M', 'L', 'XL'],
      colors: ['Obsidian Black', 'Rust Brown'],
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'],
      stock: 5,
      price: 349,
      discount: 20,
      ratings: 4.6,
      reviewsCount: 4
    },
    {
      id: 'prod-5',
      shopId: 'shop-2',
      title: 'Premium Raw Selvedge Denim Jeans',
      description: '14.5oz Japanese selvedge denim woven on traditional vintage shuttle looms. Rigid indigo-dyed finish designed to fade beautifully and uniquely with time.',
      category: 'Men',
      sizes: ['30', '32', '34', '36'],
      colors: ['Indigo Raw', 'Bleached Acid'],
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80'],
      stock: 22,
      price: 189,
      discount: 0,
      ratings: 4.5,
      reviewsCount: 2
    },
    {
      id: 'prod-6',
      shopId: 'shop-2',
      title: 'Chunky Knit Wool Turtleneck Sweater',
      description: 'Super-soft heavyweight merino wool knit with an elegant traditional cable motif. Designed with drop shoulders for a relaxed, ultra-modern luxury aesthetic.',
      category: 'Women',
      sizes: ['S', 'M', 'L'],
      colors: ['Cream Alabaster', 'Forest Green', 'Burgundy'],
      images: ['https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80'],
      stock: 14,
      price: 155,
      discount: 10,
      ratings: 4.7,
      reviewsCount: 3
    },

    // Shop 3 (Dior Petits) Products
    {
      id: 'prod-7',
      shopId: 'shop-3',
      title: 'Organic Linen Baby Romper',
      description: 'Crafted from 100% hypoallergenic, breathable, pre-washed organic linen. Features natural coconut shell button closures and soft elasticized leg openings.',
      category: 'Kids',
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
      colors: ['Sage Green', 'Dusty Rose', 'Oatmeal'],
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'],
      stock: 30,
      price: 65,
      discount: 5,
      ratings: 4.8,
      reviewsCount: 2
    }
  ];

  const initialReviews: Review[] = [
    {
      id: 'rev-1',
      userId: 'usr-1',
      userName: 'Jane Doe',
      productId: 'prod-1',
      shopId: 'shop-1',
      rating: 5,
      comment: 'Absolutely breathtaking! The mulberry silk is so smooth and fits like an absolute dream. Worth every penny!',
      isSpam: false,
      isHidden: false,
      createdAt: '2026-05-18T10:30:00.000Z'
    },
    {
      id: 'rev-2',
      userId: 'usr-1',
      userName: 'Jane Doe',
      productId: 'prod-4',
      shopId: 'shop-2',
      rating: 4,
      comment: 'Very thick premium leather. It smells wonderful and the metallic detail is top quality. Fits a bit oversized.',
      isSpam: false,
      isHidden: false,
      createdAt: '2026-05-19T14:22:00.000Z'
    },
    {
      id: 'rev-3',
      userId: 'usr-5',
      userName: 'Anonymous Bot',
      productId: 'prod-4',
      shopId: 'shop-2',
      rating: 1,
      comment: 'SPAM BUY CRYPTO CHEAP WATCH NOW 100% FREE LINK HERE!!!',
      isSpam: true,
      isHidden: false, // Start unhidden so shop owner can moderate it!
      createdAt: '2026-05-20T08:15:00.000Z'
    }
  ];

  // --- STATE IMPLEMENTATIONS ---
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [followedShops, setFollowedShops] = useState<string[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // --- LOAD FROM LOCAL STORAGE ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('luxe_users');
      const storedShops = localStorage.getItem('luxe_shops');
      const storedProducts = localStorage.getItem('luxe_products');
      const storedOrders = localStorage.getItem('luxe_orders');
      const storedReviews = localStorage.getItem('luxe_reviews');
      const storedUser = localStorage.getItem('luxe_current_user');
      const storedFollows = localStorage.getItem('luxe_followed_shops');
      const storedSelectedShop = localStorage.getItem('luxe_selected_shop_id');
      const storedLang = localStorage.getItem('luxe_lang') as Language;
      const storedTheme = localStorage.getItem('luxe_theme');

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedShops) setShops(JSON.parse(storedShops));
      if (storedProducts) setProducts(JSON.parse(storedProducts));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      if (storedReviews) setReviews(JSON.parse(storedReviews));
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedFollows) setFollowedShops(JSON.parse(storedFollows));
      if (storedSelectedShop) setSelectedShopId(storedSelectedShop);
      if (storedLang) setLanguage(storedLang);
      if (storedTheme) {
        const isDark = storedTheme === 'true';
        setDarkMode(isDark);
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }

      setIsLoaded(true);
    }
  }, []);

  // --- SAVE TO LOCAL STORAGE ON STATE CHANGE ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('luxe_users', JSON.stringify(users));
      localStorage.setItem('luxe_shops', JSON.stringify(shops));
      localStorage.setItem('luxe_products', JSON.stringify(products));
      localStorage.setItem('luxe_orders', JSON.stringify(orders));
      localStorage.setItem('luxe_reviews', JSON.stringify(reviews));
      localStorage.setItem('luxe_followed_shops', JSON.stringify(followedShops));
      if (selectedShopId) localStorage.setItem('luxe_selected_shop_id', selectedShopId);
      else localStorage.removeItem('luxe_selected_shop_id');
      localStorage.setItem('luxe_lang', language);
      localStorage.setItem('luxe_theme', String(darkMode));

      if (currentUser) {
        localStorage.setItem('luxe_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('luxe_current_user');
      }
    }
  }, [users, shops, products, orders, reviews, currentUser, followedShops, selectedShopId, language, darkMode, isLoaded]);

  // --- AUTH SERVICES ---
  const login = (email: string, role: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      if (foundUser.languagePreference) setLanguage(foundUser.languagePreference);
      if (foundUser.darkModePreference !== undefined) {
        setDarkMode(foundUser.darkModePreference);
        if (foundUser.darkModePreference) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, role: 'Customer' | 'ShopOwner', shopDetails?: any): boolean => {
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) return false;

    const newUserId = `usr-${Date.now()}`;
    const newUser: User = { id: newUserId, name, email, role };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    // If registering as a ShopOwner, create their Boutique pending approval
    if (role === 'ShopOwner' && shopDetails) {
      const newShopId = `shop-${Date.now()}`;
      const newShop: Shop = {
        id: newShopId,
        shopName: shopDetails.shopName || 'My Elegant Boutique',
        shopLogo: shopDetails.shopLogo || '👔',
        shopBanner: shopDetails.shopBanner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        description: shopDetails.description || 'Welcome to our premium boutique. Crafting fashion experiences.',
        ownerId: newUserId,
        address: shopDetails.address || 'Fashion Hub, Main Plaza',
        contactEmail: email,
        contactPhone: shopDetails.contactPhone || '+1 (555) 123-4567',
        categories: shopDetails.categories || ['Women'],
        deliveryAvailability: shopDetails.deliveryAvailability !== undefined ? shopDetails.deliveryAvailability : true,
        ratings: 0,
        isApproved: false, // Admin must approve
        followersCount: 0
      };
      setShops(prev => [...prev, newShop]);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedShopId(null);
    setCart([]);
  };

  const updateUserPreferences = (lang: Language, theme: boolean) => {
    setLanguage(lang);
    setDarkMode(theme);
    if (theme) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, languagePreference: lang, darkModePreference: theme } : null);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, languagePreference: lang, darkModePreference: theme } : u));
    }
  };

  // --- SHOP MANAGEMENT ---
  const approveShop = (shopId: string) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isApproved: true } : s));
  };

  const suspendShop = (shopId: string) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isSuspended: !s.isSuspended } : s));
  };

  const deleteShop = (shopId: string) => {
    setShops(prev => prev.filter(s => s.id !== shopId));
    setProducts(prev => prev.filter(p => p.shopId !== shopId));
  };

  const updateShop = (shopId: string, updatedFields: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, ...updatedFields } : s));
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.role === 'ShopOwner') {
      const userShops = shops.filter(s => s.ownerId === userId);
      userShops.forEach(s => {
        setShops(prev => prev.filter(shop => shop.id !== s.id));
        setProducts(prev => prev.filter(prod => prod.shopId !== s.id));
      });
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
      setSelectedShopId(null);
      setCart([]);
    }
  };

  const followShop = (shopId: string) => {
    setFollowedShops(prev => {
      const isFollowing = prev.includes(shopId);
      if (isFollowing) {
        setShops(shopsPrev => shopsPrev.map(s => s.id === shopId ? { ...s, followersCount: Math.max(0, s.followersCount - 1) } : s));
        return prev.filter(id => id !== shopId);
      } else {
        setShops(shopsPrev => shopsPrev.map(s => s.id === shopId ? { ...s, followersCount: s.followersCount + 1 } : s));
        return [...prev, shopId];
      }
    });
  };

  const selectShop = (shopId: string | null) => {
    setSelectedShopId(shopId);
  };

  // --- INVENTORY / PRODUCTS ---
  const addProduct = (productData: Omit<Product, 'id' | 'ratings' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      ratings: 0,
      reviewsCount: 0
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // --- CART OPERATIONS ---
  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    setCart(prev => {
      // Find if exact variant exists in cart
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.size === size && 
        item.color === color
      );

      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx].quantity += quantity;
        return newCart;
      }

      return [...prev, { product, size, color, quantity }];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    setCart(prev => {
      const newCart = [...prev];
      if (newCart[index]) {
        newCart[index].quantity = quantity;
      }
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const checkout = (shippingAddress: string, couponCode?: string) => {
    if (!currentUser || cart.length === 0) return;

    // Deduct stock levels in mock database
    setProducts(prevProducts => prevProducts.map(p => {
      const cartItemsForProduct = cart.filter(c => c.product.id === p.id);
      const totalDeduction = cartItemsForProduct.reduce((acc, curr) => acc + curr.quantity, 0);
      return { ...p, stock: Math.max(0, p.stock - totalDeduction) };
    }));

    // Group items by shop to create multi-vendor split orders
    const itemsByShop: { [shopId: string]: CartItem[] } = {};
    cart.forEach(item => {
      const sId = item.product.shopId;
      if (!itemsByShop[sId]) itemsByShop[sId] = [];
      itemsByShop[sId].push(item);
    });

    const newOrders: Order[] = Object.keys(itemsByShop).map(sId => {
      const shopItems = itemsByShop[sId];
      const shop = shops.find(s => s.id === sId);
      
      const subtotal = shopItems.reduce((acc, item) => {
        const discPrice = item.product.price * (1 - item.product.discount / 100);
        return acc + (discPrice * item.quantity);
      }, 0);

      // Simple coupon code discount
      const finalTotal = couponCode?.toUpperCase() === 'LUCKY20' ? subtotal * 0.8 : subtotal;

      return {
        id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        shopId: sId,
        shopName: shop?.shopName || 'Boutique',
        products: shopItems.map(c => ({
          productId: c.product.id,
          title: c.product.title,
          quantity: c.quantity,
          price: c.product.price * (1 - c.product.discount / 100),
          size: c.size,
          color: c.color,
          image: c.product.images[0]
        })),
        totalAmount: parseFloat(finalTotal.toFixed(2)),
        paymentStatus: 'Completed',
        orderStatus: 'Processing',
        shippingAddress,
        createdAt: new Date().toISOString()
      };
    });

    setOrders(prev => [...newOrders, ...prev]);
    setCart([]);
  };

  // --- ORDER WORKFLOWS ---
  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
  };

  // --- REVIEW SYSTEM & MODERATION ---
  const addReview = (productId: string, shopId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      productId,
      shopId,
      rating,
      comment,
      isSpam: false,
      isHidden: false,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate Product average rating
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === productId) {
        const prodReviews = [newReview, ...reviews.filter(r => r.productId === productId && !r.isHidden)];
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        return {
          ...p,
          ratings: parseFloat(avg.toFixed(1)),
          reviewsCount: prodReviews.length
        };
      }
      return p;
    }));
  };

  const toggleReviewVisibility = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isHidden: !r.isHidden } : r));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      shops,
      products,
      orders,
      reviews,
      cart,
      followedShops,
      selectedShopId,
      language,
      darkMode,
      login,
      register,
      logout,
      updateUserPreferences,
      approveShop,
      suspendShop,
      deleteShop,
      updateShop,
      deleteUser,
      followShop,
      selectShop,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      checkout,
      updateOrderStatus,
      addReview,
      toggleReviewVisibility
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
