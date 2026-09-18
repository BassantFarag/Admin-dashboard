import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Users from "../pages/Users";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import Orders from "../pages/Orders";
import Carts from "../pages/Carts";
import Settings from "../pages/Settings";
import ProductView from "../pages/ProductView";
import EditProductPage from "../pages/EditProductPage";
import AdminProfile from "../pages/AdminProfile";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Wishlist from "../pages/Wishlist";
import Unauthorized from "../pages/Unauthorized";

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
                path: "products/edit/:id",
                element: <EditProductPage />,
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
              {
                path: "AdminProfile",
                element: <AdminProfile />,
              },
              {
                path: "Wishlist",
                element: <Wishlist />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);