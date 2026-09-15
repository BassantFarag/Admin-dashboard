import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderSidebar from "../components/orderSidebar";
import OrdersTable from "../components/OrdersTable";
import OrdersFilter from "../components/OrdersFilters";
import HeaderTable from "../components/HeaderTable";
import { getAllOrders } from "../api/OrdersApi";
import Pagination from "../components/Pagination";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Client-side filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [cardFilter, setCardFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    getAllOrders()
      .then((res) => {
        setOrders(res.data.orders || res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Failed to fetch orders from server";
        toast.error(message);
        setLoading(false);
      });
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      (order.shippingAddress?.fullName || "")
        .toLowerCase()
        .includes(searchValue) ||
      (order._id || "").toLowerCase().includes(searchValue) ||
      (order.createdAt || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      (order.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      (order.paymentStatus || "").toLowerCase() ===
        paymentFilter.toLowerCase();

    const matchesMethod =
      cardFilter === "all" ||
      (order.paymentMethod || "").toLowerCase() ===
        cardFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
  });

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter, cardFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const startIndex = (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  return (
    <div className="min-h-screen bg-[--color-bg-main] space-y-6 p-4 lg:p-6">
      <HeaderTable orders={orders} />

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

      <OrdersTable orders={currentOrders} isLoading={loading} onOrderClick={setSelectedOrder} />

      {filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {selectedOrder && (
        <OrderSidebar
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(updatedData) => {
            setOrders((prevOrders) =>
              prevOrders.map((item) =>
                item._id === selectedOrder._id
                  ? { ...item, ...updatedData }
                  : item
              )
            );

            setSelectedOrder((prev) => ({
              ...prev,
              ...updatedData,
            }));
          }}
        />
      )}
    </div>
  );
};

export default Orders;