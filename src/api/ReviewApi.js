import api from './axios';


export const getProductReviews = (productId) => 
  api.get(`/products/${productId}/reviews`);


export const addReview = (productId, payload) => 
  api.post(`/products/${productId}/reviews`, payload);


export const deleteReview = (productId, reviewId) => 
  api.delete(`/products/${productId}/reviews/${reviewId}`);