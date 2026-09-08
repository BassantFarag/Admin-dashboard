import api from './axios'

// get All users 
export const getAllUsers=()=>api.get('/users/all');

//add user
export const addAllUser=(payload)=>api.post('/users/add',payload);

//get user by id 
export const getUserById=(id)=>api.get(`/users/${id}`);

//update user profile
export const updateUser = (id, payload) => api.patch(`/users/${id}`, payload);

//Delete user
export const deleteUser = (id) => api.delete(`/users/${id}`);

