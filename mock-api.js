(function () {
  const STOCK_KEY = "dotstore_inventory_v1";

  const BASE_PRODUCTS = [
    {
      id: "home2",
      name: "Dimmable Ceiling Light Modern",
      brand: "Lumiere",
      price: 279.99,
      oldPrice: 499.99,
      category: "Home & Kitchen",
      image: "assets/products/home2.jpg",
      gallery: [
        "assets/products/home2.jpg",
        "assets/products/home1.jpg",
        "assets/products/home3.jpg",
      ],
      description:
        "Modern dimmable LED ceiling light with warm/cool ambiance control and sleek metallic ring finish.",
      stock: 20,
      sold: 995,
      rating: 4.8,
      reviewsCount: 543,
      colors: ["Gold", "Matte Black", "Silver"],
      specs: {
        Material: "Brushed Aluminum",
        Wattage: "48W LED",
        Warranty: "2 Years",
      },
      trending: true,
      featured: false,
    },
    {
      id: "home3",
      name: "Modern Storage Cabinet with Door & 3 Drawers",
      brand: "NordicHome",
      price: 129.99,
      oldPrice: 179.99,
      category: "Home & Kitchen",
      image: "assets/products/home3.jpg",
      gallery: ["assets/products/home3.jpg", "assets/products/home4.jpg"],
      description:
        "Compact wooden storage cabinet featuring one soft-close door and three spacious drawers.",
      stock: 34,
      sold: 758,
      rating: 4.7,
      reviewsCount: 355,
      colors: ["Natural Oak", "White"],
      specs: {
        Material: "Engineered Wood",
        Dimensions: "110 x 40 x 85 cm",
        Assembly: "Easy Flat-Pack",
      },
      trending: true,
      featured: false,
    },
    {
      id: "home4",
      name: "Vonanda Velvet Sofa Couch",
      brand: "Vonanda",
      price: 352.99,
      oldPrice: 429.99,
      category: "Home & Kitchen",
      image: "assets/products/home4.jpg",
      gallery: ["assets/products/home4.jpg", "assets/products/home1.jpg"],
      description:
        "Plush velvet 3-seater sofa crafted for modern living rooms with solid oak legs.",
      stock: 12,
      sold: 1420,
      rating: 4.9,
      reviewsCount: 890,
      colors: ["Emerald", "Royal Blue", "Beige"],
      specs: {
        Upholstery: "100% Velvet",
        Frame: "Solid Hardwood",
        Seats: "3 Persons",
      },
      trending: false,
      featured: false,
    },
    {
      id: "home5",
      name: "Awesome Bed for a Couple",
      brand: "DreamRest",
      price: 579.99,
      oldPrice: 699.99,
      category: "Home & Kitchen",
      image: "assets/products/home5.jpg",
      gallery: ["assets/products/home5.jpg", "assets/products/home4.jpg"],
      description:
        "King-size upholstered bed frame with tufted wingback headboard and reinforced wooden slats.",
      stock: 8,
      sold: 612,
      rating: 4.8,
      reviewsCount: 410,
      sizes: ["Queen", "King Size"],
      specs: {
        Material: "Linen & Solid Pine",
        Size: "180 x 200 cm",
        Support: "No Box Spring Needed",
      },
      trending: false,
      featured: false,
    },
    {
      id: "home1",
      name: "Vonada Velvet Sofa Couch, Mid Century Modern Craftmanship",
      brand: "Vonanda",
      price: 469.99,
      oldPrice: 755.99,
      category: "Home & Kitchen",
      image: "assets/products/home1.jpg",
      gallery: ["assets/products/home1.jpg", "assets/products/home4.jpg"],
      description:
        "Mid-century modern velvet couch built with high-density orthopedic foam cushions.",
      stock: 15,
      sold: 2151,
      rating: 4.9,
      reviewsCount: 1559,
      colors: ["Mustard", "Charcoal"],
      specs: {
        Upholstery: "Stain-Resistant Velvet",
        Style: "Mid-Century Modern",
        Warranty: "3 Years",
      },
      trending: true,
      featured: false,
    },
    {
      id: "apparel1",
      name: "Under Armour Men's Tech",
      brand: "Hurley",
      price: 56.5,
      oldPrice: 75.5,
      category: "Men's Fashion",
      image: "assets/products/apparel1.jpg",
      gallery: ["assets/products/apparel1.jpg", "assets/products/apparel2.jpg"],
      description:
        "Quick-drying, ultra-soft athletic performance tee engineered for all-day comfort.",
      stock: 7,
      sold: 2548,
      rating: 4.8,
      reviewsCount: 1955,
      sizes: ["S", "M", "L", "XL"],
      specs: {
        Fabric: "100% Recycled Polyester",
        Fit: "Athletic Loose",
        Care: "Machine Wash",
      },
      trending: true,
      featured: true,
    },
    {
      id: "apparel2",
      name: "Women's Lightweight Knit Hoodie Sweatshirt",
      brand: "Zara",
      price: 37.5,
      oldPrice: 45.5,
      category: "Women's Fashion",
      image: "assets/products/apparel2.jpg",
      gallery: ["assets/products/apparel2.jpg", "assets/products/apparel3.jpg"],
      description:
        "Lightweight everyday knit hoodie made for breathable comfort and effortless layering.",
      stock: 48,
      sold: 1275,
      rating: 4.7,
      reviewsCount: 994,
      sizes: ["XS", "S", "M", "L"],
      specs: {
        Fabric: "65% Cotton, 35% Polyester",
        Closure: "Pull-On",
        Season: "All-Season",
      },
      trending: true,
      featured: true,
    },
    {
      id: "apparel3",
      name: "Black Women's Coat Dress",
      brand: "Zara",
      price: 129.99,
      oldPrice: 189.98,
      category: "Women's Fashion",
      image: "assets/products/apparel3.jpg",
      gallery: ["assets/products/apparel3.jpg", "assets/products/apparel4.jpg"],
      description:
        "Elegant tailored coat dress with a clean silhouette, structured lapels, and soft lining.",
      stock: 21,
      sold: 2975,
      rating: 4.9,
      reviewsCount: 2548,
      sizes: ["S", "M", "L", "XL"],
      specs: {
        Fabric: "65% Polyester, 35% Viscose",
        Fit: "Tailored",
        Care: "Machine Wash Cold",
      },
      trending: true,
      featured: true,
    },
    {
      id: "apparel4",
      name: "Happy Sailed Womens Summer Boho Floral Dress",
      brand: "D&G",
      price: 118.9,
      oldPrice: 189.9,
      category: "Women's Fashion",
      image: "assets/products/apparel4.jpg",
      gallery: [
        "assets/products/apparel4.jpg",
        "assets/products/apparel3.jpg",
        "assets/products/apparel2.jpg",
      ],
      description:
        "Breezy floral boho dress designed for summer getaways, beach walks, and casual occasions.",
      stock: 26,
      sold: 3459,
      rating: 4.9,
      reviewsCount: 2548,
      sizes: ["XS", "S", "M", "L", "XL"],
      specs: {
        Fabric: "Breathable Chiffon",
        Pattern: "Botanical Floral",
        Length: "Midi",
      },
      trending: true,
      featured: true,
      isOffer: true,
    },
    {
      id: "shoe1",
      name: "Men Slip On Casual Shoes With Arch Support Insoles",
      brand: "Hurley",
      price: 80.9,
      oldPrice: 189.98,
      category: "Men's Fashion",
      image: "assets/products/shoe1.jpg",
      gallery: ["assets/products/shoe1.jpg", "assets/products/shoe3.jpg"],
      description:
        "Casual slip-on shoes with orthopedic arch-support insoles and anti-slip rubber outsoles.",
      stock: 40,
      sold: 2975,
      rating: 4.8,
      reviewsCount: 2251,
      sizes: ["40", "41", "42", "43", "44"],
      specs: {
        Upper: "Canvas & Leather",
        Sole: "Vulcanized Rubber",
        Insole: "Memory Foam Arch",
      },
      trending: true,
      featured: true,
    },
    {
      id: "shoe2",
      name: "Skechers Women's Go Joy Walking Shoe Sneaker",
      brand: "Zara",
      price: 54.95,
      oldPrice: 64.95,
      category: "Women's Fashion",
      image: "assets/products/shoe2.jpg",
      gallery: ["assets/products/shoe2.jpg", "assets/products/shoe4.jpg"],
      description:
        "Featherlight walking sneaker with responsive 5GEN cushioning and breathable athletic mesh.",
      stock: 29,
      sold: 1410,
      rating: 4.7,
      reviewsCount: 1237,
      sizes: ["37", "38", "39", "40"],
      specs: {
        Upper: "Breathable Mesh",
        Cushioning: "Goga Max Insole",
        Weight: "180g",
      },
      trending: false,
      featured: true,
    },
    {
      id: "shoe3",
      name: "Nike Running Shoes",
      brand: "Nike",
      price: 139.99,
      oldPrice: 189.98,
      category: "Sports",
      image: "assets/products/shoe3.jpg",
      gallery: ["assets/products/shoe3.jpg", "assets/products/shoe1.jpg"],
      description:
        "High-responsiveness athletic running shoes engineered for daily road training and speed.",
      stock: 31,
      sold: 840,
      rating: 4.6,
      reviewsCount: 106,
      sizes: ["40", "41", "42", "43", "44"],
      specs: { Midsole: "React Foam", Traction: "Waffle Rubber", Drop: "8mm" },
      trending: false,
      featured: true,
    },
    {
      id: "shoe4",
      name: "Women's Summer Tosca Shoe",
      brand: "D&G",
      price: 104.9,
      oldPrice: 189.9,
      category: "Women's Fashion",
      image: "assets/products/shoe4.jpg",
      gallery: ["assets/products/shoe4.jpg", "assets/products/shoe2.jpg"],
      description:
        "Stylish summer footwear combining cushioned footbed comfort with minimalist elegance.",
      stock: 19,
      sold: 520,
      rating: 4.5,
      reviewsCount: 25,
      sizes: ["37", "38", "39", "40"],
      specs: {
        Material: "Eco-Leather",
        Sole: "Flexible TPR",
        Style: "Everyday Casual",
      },
      trending: false,
      featured: true,
    },
    {
      id: "electronic1",
      name: "ROG Strix G18 (2023) G814JZ-N6036X",
      brand: "Asus",
      price: 480.9,
      oldPrice: 619.9,
      category: "Electronic",
      image: "assets/products/electronic1.jpg",
      gallery: [
        "assets/products/electronic1.jpg",
        "assets/products/electronic2.jpg",
        "assets/products/electronic5.jpg",
      ],
      description:
        "18-inch QHD 240Hz flagship gaming & workstation laptop with Tri-Fan cooling and RGB chassis.",
      stock: 17,
      sold: 1843,
      rating: 4.9,
      reviewsCount: 2251,
      colors: ["Eclipse Gray", "Volt Green"],
      specs: {
        Display: "18-inch QHD 240Hz",
        Processor: "Intel Core i9",
        Material: "Anodized Metal",
      },
      trending: true,
      featured: false,
    },
    {
      id: "electronic2",
      name: "iPhone 13 Pro / Smartphone Camera Pro",
      brand: "Oppo",
      price: 699.0,
      oldPrice: 799.0,
      category: "Electronic",
      image: "assets/products/electronic2.jpg",
      gallery: [
        "assets/products/electronic2.jpg",
        "assets/products/electronic3.jpg",
      ],
      description:
        "Pro triple-camera flagship smartphone with Super Retina XDR 120Hz display and all-day battery.",
      stock: 10,
      sold: 1320,
      rating: 4.9,
      reviewsCount: 1251,
      colors: ["Graphite", "Sierra Blue", "Silver"],
      specs: {
        Display: "6.1-inch OLED 120Hz",
        Camera: "Triple 12MP Pro",
        Storage: "256GB",
      },
      trending: false,
      featured: false,
    },
    {
      id: "electronic3",
      name: "Wireless Headphones Over Ear, Bluetooth Headphones",
      brand: "Samsung",
      price: 54.95,
      oldPrice: 64.95,
      category: "Electronic",
      image: "assets/products/electronic3.jpg",
      gallery: [
        "assets/products/electronic3.jpg",
        "assets/products/electronic1.jpg",
      ],
      description:
        "Wireless over-ear headphones with hybrid noise cancellation and 40-hour battery life.",
      stock: 24,
      sold: 1580,
      rating: 4.8,
      reviewsCount: 1237,
      colors: ["Matte Black", "Silver"],
      specs: {
        Connectivity: "Bluetooth 5.3",
        Battery: "40 Hours",
        Drivers: "40mm Dynamic",
      },
      trending: false,
      featured: false,
    },
    {
      id: "electronic4",
      name: "Type-C to Type-C Fast Charger Cable",
      brand: "Samsung",
      price: 39.99,
      oldPrice: 89.98,
      category: "Electronic",
      image: "assets/products/electronic4.jpg",
      gallery: ["assets/products/electronic4.jpg"],
      description:
        "Nylon-braided 100W Power Delivery USB-C cable engineered for laptops, tablets, and phones.",
      stock: 65,
      sold: 940,
      rating: 4.6,
      reviewsCount: 106,
      specs: {
        Power: "100W PD Fast Charge",
        Length: "2 Meters",
        Durability: "20,000+ Bends",
      },
      trending: false,
      featured: false,
    },
    {
      id: "electronic5",
      name: "Samsung TV 120Hz",
      brand: "Samsung",
      price: 104.9,
      oldPrice: 189.9,
      category: "Electronic",
      image: "assets/products/electronic5.jpg",
      gallery: [
        "assets/products/electronic5.jpg",
        "assets/products/electronic1.jpg",
      ],
      description:
        "4K UHD Smart TV featuring native 120Hz motion rate, HDR10+, and ultra-slim bezel design.",
      stock: 14,
      sold: 710,
      rating: 4.7,
      reviewsCount: 251,
      specs: {
        Resolution: "4K UHD (3840x2160)",
        RefreshRate: "120Hz Native",
        SmartOS: "Tizen Smart Hub",
      },
      trending: false,
      featured: false,
    },
  ];

  function getStockMap() {
    try {
      const raw = sessionStorage.getItem(STOCK_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const initial = {};
    BASE_PRODUCTS.forEach((p) => {
      initial[p.id] = p.stock;
    });
    try {
      sessionStorage.setItem(STOCK_KEY, JSON.stringify(initial));
    } catch (e) {}
    return initial;
  }

  function saveStockMap(map) {
    try {
      sessionStorage.setItem(STOCK_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function hydrate(p, stockMap) {
    const currentStock =
      typeof stockMap[p.id] === "number" ? stockMap[p.id] : p.stock;
    const discount =
      p.oldPrice && p.oldPrice > p.price
        ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
        : 0;
    return { ...p, stock: currentStock, discount };
  }

  window.MockApi = {
    getAllSync() {
      const stockMap = getStockMap();
      return BASE_PRODUCTS.map((p) => hydrate(p, stockMap));
    },
    getProductSync(id) {
      const stockMap = getStockMap();
      const found =
        BASE_PRODUCTS.find((item) => item.id === id) || BASE_PRODUCTS[0];
      return found ? hydrate(found, stockMap) : null;
    },
    decrementStock(items) {
      const stockMap = getStockMap();
      (items || []).forEach((item) => {
        if (typeof stockMap[item.id] === "number") {
          stockMap[item.id] = Math.max(
            0,
            stockMap[item.id] - Number(item.qty || 1),
          );
        }
      });
      saveStockMap(stockMap);
    },
    async getProducts(filters = {}) {
      let result = this.getAllSync();
      const query = String(filters.q || "")
        .trim()
        .toLowerCase();
      if (query) {
        result = result.filter((item) =>
          `${item.name} ${item.category} ${item.brand || ""} ${item.description}`
            .toLowerCase()
            .includes(query),
        );
      }
      if (filters.category && filters.category !== "all") {
        const cat = String(filters.category).toLowerCase();
        result = result.filter(
          (item) =>
            item.category.toLowerCase().includes(cat) ||
            (item.brand && item.brand.toLowerCase().includes(cat)),
        );
      }
      if (filters.maxPrice && Number(filters.maxPrice) > 0) {
        result = result.filter(
          (item) => item.price <= Number(filters.maxPrice),
        );
      }
      if (filters.inStockOnly) {
        result = result.filter((item) => item.stock > 0);
      }
      if (filters.sort === "low") result.sort((a, b) => a.price - b.price);
      if (filters.sort === "high") result.sort((a, b) => b.price - a.price);
      if (filters.sort === "name")
        result.sort((a, b) => a.name.localeCompare(b.name));
      if (filters.sort === "rating") result.sort((a, b) => b.rating - a.rating);
      return result;
    },
    async getProduct(id) {
      return this.getProductSync(id);
    },
    async getCategories() {
      return [...new Set(BASE_PRODUCTS.map((item) => item.category))];
    },
  };
})();
