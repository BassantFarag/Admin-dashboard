/*
 * Orders Page Component
 * 
 * File Purpose:
 * Main admin dashboard interface for fetching, filtering, and displaying orders with pagination.
 * 
 * Key Features:
 * - Fetches complete orders list on initial mount using getAllOrders API.
 * - Handles client-side multi-criteria filtering (search, order status, payment status, payment method).
 * - Implements automated pagination state resetting whenever active filters change.
 * - Passes paginated and filtered order subsets to presentational child components.
 */

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrdersTable from "../components/OrdersTable";
import OrdersFilter from "../components/OrdersFilters";
import HeaderTable from "../components/HeaderTable";
import { getAllOrders } from "../api/OrdersApi";
import Pagination from "../components/Pagination";

const Orders = () => {
  // Main state for complete orders list retrieved from API.
  const [orders, setOrders] = useState([]);
  
  // Local loading state controlling table skeleton/spinner representation.
  const [loading, setLoading] = useState(true);

  // Pagination state configuration.
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Multi-criteria client-side filter state variables.
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [cardFilter, setCardFilter] = useState("all");

  // Fetch initial orders payload from backend REST API on component mount.
  useEffect(() => {
    setLoading(true);
    getAllOrders()
      .then((res) => {
        // Fallback checks to extract array properly from response structure.
        setOrders(res.data.orders || res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        // Display toast error message on request failure (e.g., CORS or Network issues).
        const message = err.response?.data?.message || "Failed to fetch orders from server";
        toast.error(message);
        setLoading(false);
      });
  }, []);

  // Compute filtered orders array instantaneously based on active user criteria.
  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    // Check match against user full name, order ID, or creation timestamp.
    const matchesSearch =
      (order.shippingAddress?.fullName || "")
        .toLowerCase()
        .includes(searchValue) ||
      (order._id || "").toLowerCase().includes(searchValue) ||
      (order.createdAt || "").toLowerCase().includes(searchValue);

    // Check match against selected order processing status.
    const matchesStatus =
      statusFilter === "all" ||
      (order.status || "").toLowerCase() === statusFilter.toLowerCase();

    // Check match against order payment status (e.g., paid, pending).
    const matchesPayment =
      paymentFilter === "all" ||
      (order.paymentStatus || "").toLowerCase() ===
        paymentFilter.toLowerCase();

    // Check match against card/payment transaction method (e.g., card, cash).
    const matchesMethod =
      cardFilter === "all" ||
      (order.paymentMethod || "").toLowerCase() ===
        cardFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
  });

  // Automatically reset to page 1 whenever any filter parameter is modified.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter, cardFilter]);

  // Compute derived values for pagination slice calculation.
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const startIndex = (currentPage - 1) * ordersPerPage;

  // Extract subset array corresponding to the active pagination window.
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  return (
    <div className="min-h-screen bg-[--color-bg-main] space-y-6 p-4 lg:p-6">
      {/* Header section presenting metrics summary */}
      <HeaderTable orders={orders} />

      {/* Filter controls bar binding state setters */}
      <OrdersFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        cardFilter={cardFilter}
        setCardFilter={setCardFilter}
      />

      {/* Orders data table component displaying active page items */}
      <OrdersTable orders={currentOrders} isLoading={loading} />

      {/* Pagination control toolbar rendered only when data is available */}
      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Orders;