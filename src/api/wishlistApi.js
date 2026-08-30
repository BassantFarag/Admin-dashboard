import api from './axios';


export const getAllWishlists = () => 
  api.get('/wishlists/admin/all');

export const getWishlistStats = () => 
  api.get('/wishlists/admin/stats');