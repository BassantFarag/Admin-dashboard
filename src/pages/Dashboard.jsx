<<<<<<< Updated upstream
import { ShoppingCart, Clock3, CircleDollarSign, ChartColumn, Package, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import ThreatChart from "../components/ThreatChart";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    orders: {
      total: 0,
      pending: 0,
      processing: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },

    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growthPercent: 0,
    },

    recentOrders: [],

    topProducts: [],

    ordersByStatus: [],

    dailyRevenue: [],

    totalCustomers: 0,
  });

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/orders/admin/dashboard");

        if (response.data?.dashboard) {
          setDashboard(response.data.dashboard);
        }
      } catch (error) {
        console.log(
          "Dashboard Error:",
          error.response?.data || error.message
        );
      }
    };

    getDashboard();
  }, []);

  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: dashboard.orders?.total?.toLocaleString(),
      subText: "All orders received",
      icon: ShoppingCart,
    },

    {
      id: 2,
      title: "Pending Orders",
      value: dashboard.orders?.pending?.toLocaleString(),
      subText: "Awaiting action",
      icon: Clock3,
    },

    {
      id: 3,
      title: "Revenue",
      value: `$${dashboard.revenue?.total?.toLocaleString()}`,
      subText: "Total gross revenue",
      icon: CircleDollarSign,
    },

    {
      id: 4,
      title: "This Month",
      value: `$${dashboard.revenue?.thisMonth?.toLocaleString()}`,
      subText: "Monthly sales target",
      icon: ChartColumn,
    },

    {
      id: 5,
      title: "Top Product",
      value: dashboard.topProducts?.[0]?.name || "No products",
      subText: dashboard.topProducts?.[0]
        ? `${dashboard.topProducts[0].totalSold} sold`
        : "No sales yet",
      icon: Package,
    },

    {
      id: 6,
      title: "Users",
      value: dashboard.totalCustomers?.toLocaleString(),
      subText: "Registered customers",
      icon: Users,
    },
  ];

  const statusClasses = {
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-info/10 text-info border-info/20",
    confirmed: "bg-info/10 text-info border-info/20",
    shipped: "bg-info/10 text-info border-info/20",
    delivered: "bg-success/10 text-success border-success/20",
    cancelled: "bg-danger/10 text-danger border-danger/20",
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.09,
      },
    },
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getCustomerName = (order) => {
    return (
      order?.shippingAddress?.fullName ||
      "Unknown Customer"
    );
  };

  const getOrderDetails = (order) => {
    if (!order?.items?.length) {
      return "No products";
    }

    return order.items
      .map(
        (item) =>
          `${item.name || "Product"} × ${item.quantity || 0}`
      )
      .join(", ");
  };

  const orderStatuses = [
    { key: "pending", count: dashboard.orders?.pending },
    { key: "processing", count: dashboard.orders?.processing },
    { key: "confirmed", count: dashboard.orders?.confirmed },
    { key: "shipped", count: dashboard.orders?.shipped },
    { key: "delivered", count: dashboard.orders?.delivered },
    { key: "cancelled", count: dashboard.orders?.cancelled },
  ];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-main px-2 py-2 sm:px-3 md:px-4 lg:px-5 lg:py-3"
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-4 lg:space-y-5">
        
   
        <motion.section variants={cardVariants}>
          <div className="relative overflow-hidden rounded-2xl border border-border-custom bg-card px-4 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md sm:px-5 sm:py-4 lg:px-6 lg:py-5">
            <div className="absolute -right-20 -top-15 h-48 w-48 rounded-full bg-active/10 blur-3xl" />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                Admin overview
              </p>

              <h1 className="mt-1 text-lg font-extrabold tracking-tight text-primary sm:text-xl lg:text-2xl">
                Real-time commerce health
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-4 text-secondary sm:text-sm">
                Monitor your storefront with AI-style clarity and live API metrics.
              </p>
            </div>
          </div>
        </motion.section>


        <motion.section
          variants={containerVariants}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border border-border-custom bg-card px-4 py-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-active/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-active" />
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-active" />
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-active/5 blur-2xl transition-all duration-500 group-hover:bg-active/10" />

                <div className="relative flex min-h-[95px] flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-secondary truncate">
                        {stat.title}
                      </p>

                      <p className="mt-1 text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
                        {stat.value}
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 4 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-active/20 bg-active-bg text-active shadow-sm"
                    >
                      <Icon size={18} strokeWidth={2} />
                    </motion.div>
                  </div>

                  <div className="mt-2 border-t border-border-custom/60 pt-2">
                    <p className="text-[11px] font-medium text-secondary truncate">
                      {stat.subText}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>


        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <ThreatChart />
          </div>

          <motion.div
            variants={cardVariants}
            className="xl:col-span-4 rounded-2xl border border-border-custom bg-card p-4 sm:p-5 shadow-sm transition-shadow duration-300 hover:shadow-md flex flex-col justify-between xl:min-h-[420px]"
          >
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-active sm:text-[11px]">
                    Order status
                  </p>
                  <h2 className="mt-0.5 text-base font-extrabold text-primary sm:text-lg">
                    Live fulfillment breakdown
                  </h2>
                </div>
                <span className="w-fit rounded-lg border border-active/20 bg-active-bg px-2.5 py-1 text-[10px] font-semibold text-active">
                  API Sync
                </span>
              </div>

              <motion.div variants={containerVariants} className="grid grid-cols-2 gap-2.5">
                {orderStatuses.map((status) => {
                  const percentage =
                    dashboard.orders?.total > 0
                      ? Math.round((status.count / dashboard.orders.total) * 100)
                      : 0;

                  return (
                    <motion.div
                      key={status.key}
                      variants={cardVariants}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-xl border p-3 transition-shadow duration-300 hover:shadow-sm ${
                        statusClasses[status.key]
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[10px] font-bold uppercase tracking-wider">
                          {status.key}
                        </span>
                        <span className="text-[10px] font-semibold opacity-60">
                          {percentage}%
                        </span>
                      </div>
                      <p className="mt-1.5 text-xl font-black sm:text-2xl">
                        {status.count}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </section>

      
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          
       
          <motion.div variants={cardVariants} className="xl:col-span-8 flex flex-col">
            <div className="flex-1 min-h-[420px] rounded-2xl border border-border-custom bg-card p-4 sm:p-5 shadow-sm transition-shadow duration-300 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                      Recent orders
                    </p>
                    <h2 className="mt-0.5 text-base font-extrabold text-primary sm:text-lg">
                      Latest customer activity
                    </h2>
                  </div>

                  <span className="shrink-0 rounded-lg border border-active/20 bg-active-bg px-2.5 py-1 text-[10px] font-semibold text-active">
                    {dashboard.recentOrders?.length || 0} orders
                  </span>
                </div>

                <motion.div variants={containerVariants} className="space-y-2.5">
                  {dashboard.recentOrders?.length > 0 ? (
                    dashboard.recentOrders.map((order) => {
                      const statusKey = order?.status?.toLowerCase()?.trim();

                      return (
                        <motion.div
                          key={order._id}
                          variants={cardVariants}
                          whileHover={{ x: 3 }}
                          className="rounded-xl border border-border-custom/60 bg-main/30 p-3 transition-all duration-300 hover:border-active/40 hover:bg-active-bg/30"
                        >
                          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-active-bg text-active">
                                  <Users size={14} />
                                </div>
                                <p className="text-xs font-bold text-primary sm:text-sm">
                                  {getCustomerName(order)}
                                </p>
                              </div>

                              <p className="mt-1.5 line-clamp-1 text-[10px] leading-4 text-secondary sm:text-[11px]">
                                {getOrderDetails(order)}
                              </p>

                              <p className="mt-0.5 text-[10px] text-secondary/80">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-2.5 border-t border-border-custom/50 pt-2 sm:border-0 sm:pt-0">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:text-[10px] ${
                                  statusClasses[statusKey] ||
                                  "bg-main text-primary border-border-custom"
                                }`}
                              >
                                {statusKey || "unknown"}
                              </span>

                              <span className="text-xs font-extrabold text-primary sm:text-sm">
                                ${(order.totalPrice || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-border-custom/60 bg-main/30 p-5 text-center">
                      <p className="text-xs font-semibold text-secondary">No recent orders</p>
                      <p className="mt-1 text-[10px] text-secondary/70">No customer activity yet</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

       
          <motion.div variants={cardVariants} className="xl:col-span-4 flex flex-col">
            <div className="flex-1 min-h-[420px] rounded-2xl border border-border-custom bg-card p-4 sm:p-5 shadow-sm transition-shadow duration-300 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                      Top products
                    </p>
                    <h2 className="mt-0.5 text-base font-extrabold text-primary sm:text-lg">
                      Best sellers
                    </h2>
                  </div>
                </div>

                <motion.div variants={containerVariants} className="space-y-2">
                  {dashboard.topProducts?.length > 0 ? (
                    dashboard.topProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        variants={cardVariants}
                        whileHover={{ x: 4 }}
                        className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border-custom/60 bg-main/40 p-3 transition-all duration-300 hover:border-active/40 hover:bg-active-bg/40"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-active/20 bg-active-bg text-xs font-bold text-active">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-primary sm:text-sm">
                            {product.name || "Unknown Product"}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-secondary sm:text-[11px]">
                            {product.totalSold} units sold · ${(product.revenue || 0).toLocaleString()}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-bold text-active">
                          ${(product.revenue || 0).toLocaleString()}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border-custom/60 bg-main/30 p-5 text-center">
                      <p className="text-xs font-semibold text-secondary">No products available</p>
                      <p className="mt-1 text-[10px] text-secondary/70">No sales data yet</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

        </section>

      </div>
    </motion.main>
  );
};

export default Dashboard;
=======
>>>>>>> Stashed changes
