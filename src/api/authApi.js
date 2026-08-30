import api from './axios'


//login
export const login=(payload) => {
  return api.post('/auth/login', payload);
};

//logout
export const logout=() => {
  return api.post('/auth/logout', payload);
};

//auth me 
export const authMe=()=>api.get('/auth/me');

//auth admin text 
export const adminTest=()=>api.get('/auth/admin-test')

//change role 
export const changeRole =(payload) => api.patch('/auth/change-role' , payload)
