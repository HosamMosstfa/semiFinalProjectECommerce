(() => {
  const products = [
    { id: "home2", name: "Dimmable Ceiling Light Modern", price: 279.99, oldPrice: 319.99, category: "Home", image: "assets/products/home2.jpg", description: "Modern dimmable ceiling light with warm ambient illumination.", stock: 20 },
    { id: "home3", name: "Modern Storage Cabinet with Door & 3 Drawers", price: 129.99, oldPrice: 179.99, category: "Home", image: "assets/products/home3.jpg", description: "Compact storage cabinet with one door and three organized drawers.", stock: 34 },
    { id: "home4", name: "Vonanda Velvet Sofa Couch", price: 352.99, oldPrice: 429.99, category: "Home", image: "assets/products/home4.jpg", description: "Comfortable velvet sofa designed for a modern living room.", stock: 12 },
    { id: "home5", name: "Awesome Bed for a Couple", price: 579.99, oldPrice: 699.99, category: "Home", image: "assets/products/home5.jpg", description: "King-size bed frame with an elegant upholstered finish.", stock: 8 },
    { id: "apparel2", name: "Women's Lightweight Knit Hoodie Sweatshirt", price: 37.50, oldPrice: 45.50, category: "Women", image: "assets/products/apparel2.jpg", description: "Lightweight everyday hoodie made for comfort and easy layering.", stock: 48 },
    { id: "apparel3", name: "Black Women's Coat Dress", price: 129.99, oldPrice: 189.98, category: "Women", image: "assets/products/apparel3.jpg", description: "Elegant coat dress with a clean silhouette and soft fabric.", stock: 21 },
    { id: "apparel4", name: "Women's Summer Boho Floral Dress", price: 118.90, oldPrice: 189.90, category: "Women", image: "assets/products/apparel4.jpg", description: "Light floral dress for summer occasions and everyday outings.", stock: 26 },
    { id: "shoe1", name: "Men Slip On Casual Shoes", price: 80.90, oldPrice: 119.90, category: "Shoes", image: "assets/products/shoe1.jpg", description: "Casual slip-on shoes with a cushioned arch-support insole.", stock: 40 },
    { id: "shoe3", name: "Nike Running Shoes", price: 139.99, oldPrice: 179.99, category: "Shoes", image: "assets/products/shoe3.jpg", description: "Lightweight athletic shoes for running and everyday training.", stock: 31 },
    { id: "electronic1", name: "Wireless Bluetooth Headphones", price: 480.90, oldPrice: 619.90, category: "Electronics", image: "assets/products/electronic1.jpg", description: "Wireless over-ear headphones with clear sound and long battery life.", stock: 17 },
    { id: "electronic2", name: "Smartphone Camera Pro", price: 699.00, oldPrice: 799.00, category: "Electronics", image: "assets/products/electronic2.jpg", description: "Advanced smartphone camera for detailed photos and videos.", stock: 10 },
    { id: "electronic3", name: "Modern Smart Watch", price: 249.99, oldPrice: 299.99, category: "Electronics", image: "assets/products/electronic3.jpg", description: "Smart watch for activity tracking, notifications and daily routines.", stock: 24 }
  ];

  const delay = () => new Promise((resolve) => setTimeout(resolve, 120));

  window.MockApi = {
    async getProducts(filters = {}) {
      await delay();
      let result = [...products];
      const query = String(filters.q || "").trim().toLowerCase();
      if (query) result = result.filter((item) => `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query));
      if (filters.category) result = result.filter((item) => item.category.toLowerCase() === String(filters.category).toLowerCase());
      if (filters.sort === "low") result.sort((a, b) => a.price - b.price);
      if (filters.sort === "high") result.sort((a, b) => b.price - a.price);
      if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
      return result;
    },
    async getProduct(id) {
      await delay();
      return products.find((item) => item.id === id) || null;
    },
    async getCategories() {
      await delay();
      return [...new Set(products.map((item) => item.category))];
    }
  };
})();
