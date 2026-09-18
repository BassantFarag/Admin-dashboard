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
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [cardFilter, setCardFilter] = useState("all");

  // timer for search 
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, paymentFilter, cardFilter]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllOrders({
      page: currentPage,
      limit: 10,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
      paymentMethod: cardFilter !== "all" ? cardFilter : undefined,
    })
      .then((res) => {
        if (!isMounted) return;
        const data = res.data;
        const ordersArray = data.orders || (Array.isArray(data) ? data : []);
        setOrders(ordersArray);

        
        const total =
          data.totalPages ||
          (data.total ? Math.ceil(data.total / 10) : 1);
        setTotalPages(total);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err.response?.data?.message || "Failed to fetch orders from server";
        toast.error(message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, statusFilter, paymentFilter, cardFilter]);

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

      <OrdersTable
        orders={orders}
        isLoading={loading}
        onOrderClick={setSelectedOrder}
      />

      {orders.length > 0 && (
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