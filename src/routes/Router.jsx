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
    path: "/login",
    element: <Login />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            path: "/",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "users",
                element: <Users />,
              },
              {
                path: "products",
                element: <Products />,
              },
              {
                path: "add-product",
                element: <AddProduct />,
              },
              {
                path: "products/:id",
                element: <ProductView />,
              },
              {
                path: "orders",
                element: <Orders />,
              },
              {
                path: "carts",
                element: <Carts />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/unauthorized",
    element: (
      <div className="flex min-h-screen items-center justify-center bg-bg-main px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-secondary">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    ),
  },
]);