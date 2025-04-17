// src/services/review.service.js
import api from './api';

const reviewService = {
  /**
   * Get all reviews for a specific product
   * @param {number} productID - The ID of the product
   * @returns {Promise} - Promise with review data
   */
  async getReviewsByProduct(productID) {
    try {
      const response = await api.get(`/reviews/product/${productID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },
  
  /**
   * Get all reviews by a specific user
   * @param {number} userID - The ID of the user
   * @returns {Promise} - Promise with review data
   */
  async getReviewsByUser(userID) {
    try {
      const response = await api.get(`/reviews/user/${userID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },
  
  /**
   * Create a new review
   * @param {Object} reviewData - The review data object
   * @returns {Promise} - Promise with created review
   */
  async createReview(reviewData) {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing review
   * @param {number} reviewID - The ID of the review to update
   * @param {Object} reviewData - The updated review data
   * @returns {Promise} - Promise with update result
   */
  async updateReview(reviewID, reviewData) {
    try {
      const response = await api.put(`/reviews/${reviewID}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
  
  /**
   * Delete a review
   * @param {number} reviewID - The ID of the review to delete
   * @param {number} userID - The ID of the user deleting the review
   * @returns {Promise} - Promise with delete result
   */
  async deleteReview(reviewID, userID) {
    try {
      const response = await api.delete(`/reviews/${reviewID}`, {
        data: { userID }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
  
  /**
   * Vote on a review (helpful/unhelpful)
   * @param {number} reviewID - The ID of the review
   * @param {number} userID - The ID of the user voting
   * @param {string} voteType - The type of vote ('helpful' or 'unhelpful')
   * @returns {Promise} - Promise with vote result
   */
  async voteOnReview(reviewID, userID, voteType) {
    try {
      const response = await api.post('/reviews/vote', {
        reviewID,
        userID,
        voteType
      });
      return response.data;
    } catch (error) {
      console.error('Error voting on review:', error);
      throw error;
    }
  }
};

export default reviewService;