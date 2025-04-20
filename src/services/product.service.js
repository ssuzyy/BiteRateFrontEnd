import api from './api';

const productService = {
  async getAllProducts() {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async getProductsByCategory(category) {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products in category "${category}":`, error);
      throw error;
    }
  },

  async getProductReviews(productId) {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ID ${productId}:`, error);
      throw error;
    }
  },

  // get reviews by user ID
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      const response = await api.get(`/products/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },
  
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};

export default productService;