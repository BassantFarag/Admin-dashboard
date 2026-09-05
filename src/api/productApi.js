import api from './axios'



// Get Products
export const getProducts = () => api.get('/products');

// Create Product
export const createProduct = (payload) =>
  api.post('/products', payload, {
    headers: {
      'Content-Type': undefined,
    },
  });

// search Products
// ملحوظة: الـ backend بياخد اسم الـ query param 'search' فقط،
// وبيدور على تطابق تام للاسم (exact match)، مش جزء من الاسم.
export const searchProducts = (searchTerm) =>
  api.get('/products/search', { params: { search: searchTerm } });

// Get Product By Id
export const getProductById = (id) => api.get(`/products/${id}`);

// Delete Product
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// update Product
export const updateProduct = (id, payload) =>
  api.patch(`/products/update/${id}`, payload, {
    headers: {
      'Content-Type': undefined,
    },
  });