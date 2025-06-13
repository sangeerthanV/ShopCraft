import { 
  users, 
  categories, 
  products, 
  cartItems, 
  orders,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    rating?: number;
    featured?: boolean;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const defaultCategories: InsertCategory[] = [
      { name: "Electronics", slug: "electronics", icon: "fas fa-laptop" },
      { name: "Fashion", slug: "fashion", icon: "fas fa-tshirt" },
      { name: "Home & Garden", slug: "home", icon: "fas fa-home" },
      { name: "Sports", slug: "sports", icon: "fas fa-dumbbell" },
    ];

    defaultCategories.forEach(category => {
      this.createCategory(category);
    });

    // Initialize products
    const defaultProducts: InsertProduct[] = [
      {
        name: "Premium Wireless Earbuds",
        description: "High-quality wireless earbuds with noise cancellation and premium sound quality.",
        price: "129.99",
        originalPrice: "159.99",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "electronics",
        brand: "TechPro",
        rating: "4.8",
        reviewCount: 128,
        inStock: true,
        isFeatured: true,
        isOnSale: true,
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration.",
        price: "249.99",
        originalPrice: "299.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "electronics",
        brand: "FitTech",
        rating: "4.6",
        reviewCount: 89,
        inStock: true,
        isFeatured: true,
        isOnSale: true,
      },
      {
        name: "Designer Laptop Bag",
        description: "Stylish and durable laptop bag with multiple compartments and premium materials.",
        price: "89.99",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "fashion",
        brand: "StyleCraft",
        rating: "4.9",
        reviewCount: 156,
        inStock: true,
        isFeatured: true,
        isOnSale: false,
      },
      {
        name: "Mechanical Keyboard Pro",
        description: "Professional mechanical keyboard with RGB lighting and customizable switches.",
        price: "149.99",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "electronics",
        brand: "KeyMaster",
        rating: "4.7",
        reviewCount: 94,
        inStock: true,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Designer Sunglasses",
        description: "Premium sunglasses with UV protection and contemporary style.",
        price: "199.99",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "fashion",
        brand: "SunStyle",
        rating: "4.8",
        reviewCount: 67,
        inStock: true,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Premium Coffee Maker",
        description: "Professional-grade coffee maker with multiple brewing options and temperature control.",
        price: "299.99",
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "home",
        brand: "BrewMaster",
        rating: "4.5",
        reviewCount: 43,
        inStock: true,
        isFeatured: false,
        isOnSale: false,
      },
      {
        name: "Wireless Gaming Mouse",
        description: "High-precision wireless gaming mouse with customizable DPI and RGB lighting.",
        price: "79.99",
        originalPrice: "99.99",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "electronics",
        brand: "GameTech",
        rating: "4.6",
        reviewCount: 112,
        inStock: true,
        isFeatured: false,
        isOnSale: true,
      },
      {
        name: "Yoga Mat Pro",
        description: "Premium non-slip yoga mat with excellent cushioning and eco-friendly materials.",
        price: "59.99",
        image: "https://images.unsplash.com/photo-1506629905627-b9f0e77d1e64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "sports",
        brand: "YogaLife",
        rating: "4.7",
        reviewCount: 78,
        inStock: true,
        isFeatured: false,
        isOnSale: false,
      },
    ];

    defaultProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    rating?: number;
    featured?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.category && filters.category !== "all") {
        products = products.filter(product => product.category === filters.category);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.brand.toLowerCase().includes(search)
        );
      }
      if (filters.minPrice !== undefined) {
        products = products.filter(product => parseFloat(product.price) >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(product => parseFloat(product.price) <= filters.maxPrice!);
      }
      if (filters.brand) {
        products = products.filter(product => product.brand.toLowerCase() === filters.brand!.toLowerCase());
      }
      if (filters.rating !== undefined) {
        products = products.filter(product => parseFloat(product.rating) >= filters.rating!);
      }
      if (filters.featured !== undefined) {
        products = products.filter(product => product.isFeatured === filters.featured);
      }
    }

    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);

    const itemsWithProducts = [];
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }

    return itemsWithProducts;
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values())
      .find(item => 
        item.sessionId === insertCartItem.sessionId && 
        item.productId === insertCartItem.productId
      );

    if (existingItem) {
      // Update quantity
      const updatedItem = await this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + insertCartItem.quantity
      );
      return updatedItem!;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);

    itemsToDelete.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();
