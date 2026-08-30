import api from './axios';


export const getAdminDashboardStats = () => 
  api.get('/orders/admin/dashboard');


export const getAllActiveCarts = () => 
  api.get('/orders/admin/carts');


export const getAllOrders = () => 
  api.get('/orders/admin');


export const getOrderById = (id) => 
  api.get(`/orders/admin/${id}`);


export const updateOrderStatus = (id, payload) => 
  api.patch(`/orders/admin/${id}/status`, payload);