import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login'; 
import Users from '../pages/Users';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import Orders from '../pages/Orders';
import Carts from '../pages/Carts';
import Settings from '../pages/Settings';
import ProductView from "../pages/ProductView";

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />, 
  },
  {
    path: '/',
    element: <DashboardLayout />, 
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'products', element: <Products /> },
      { path: 'add-product', element: <AddProduct /> },
      { path: 'products/:id', element: <ProductView /> },
      { path: 'orders', element: <Orders /> },
      { path: 'carts', element: <Carts /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);