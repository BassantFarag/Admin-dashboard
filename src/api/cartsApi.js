import api from './axios';

export const getAllCarts = () => 
  api.get('/orders/admin/carts');

export const sendCartRecoveryEmail = (cartId) => 
  api.post(`/orders/admin/carts/${cartId}/recover`);