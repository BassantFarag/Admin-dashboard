import api from "./axios";

export const getAllCarts = ()=> api.get('/carts')