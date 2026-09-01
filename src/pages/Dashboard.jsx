
import {
  ShoppingCart,
  Clock3,
  CircleDollarSign,
  ChartColumn,
  Package,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  // ================= DEFAULT DATA =================
  const defaultDashboard = {
    orders: {
      total: 169,
      pending: 11,
    },

    revenue: {
      total: 24580,
      thisMonth: 4280,
    },

    totalCustomers: 1250,

    ordersByStatus: [
      {
        _id: "pending",
        count: 11,
      },
      {
        _id: "processing",
        count: 24,
      },
      {
        _id: "confirmed",
        count: 31,
      },
      {
        _id: "shipped",
        count: 42,
      },
      {
        _id: "delivered",
        count: 50,
      },
      {
        _id: "cancelled",
        count: 11,
      },
    ],

    topProducts: [
      {
        _id: "1",
        name: "Wireless Headphones",
        totalSold: 120,
        revenue: 7200,
      },
      {
        _id: "2",
        name: "Smart Watch",
        totalSold: 95,
        revenue: 5700,
      },
      {
        _id: "3",
        name: "Gaming Mouse",
        totalSold: 80,
        revenue: 3200,
      },
    ],

    recentOrders: [
      {
        id: "1",
        customer: "Ahmed Mohamed",
        details: "Wireless Headphones × 2",
        date: "Today, 10:30 AM",
        status: "delivered",
        amount: 120,
      },
      {
        id: "2",
        customer: "Sara Ali",
        details: "Smart Watch × 1",
        date: "Today, 09:15 AM",
        status: "processing",
        amount: 250,
      },
      {
        id: "3",
        customer: "Omar Hassan",
        details: "Gaming Mouse × 2",
        date: "Yesterday, 06:40 PM",
        status: "pending",
        amount: 80,
      },
      {
        id: "4",
        customer: "Mona Ahmed",
        details: "Keyboard × 1",
        date: "Yesterday, 03:20 PM",
        status: "shipped",
        amount: 150,
      },
    ],
  };

  const [dashboard, setDashboard] = useState(defaultDashboard);

  // ================= API =================
  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await axios.get(
          "https://e-commerce-api-3wara.vercel.app/orders/admin/dashboard"
        );

        if (response.data?.dashboard) {
          setDashboard(response.data.dashboard);
        }
      } catch {
  console.log("Dashboard data could not be loaded");
}
    };

    getDashboard();
  }, []);

  // ================= STATS =================
  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: dashboard.orders.total.toLocaleString(),
      subText: "All orders received",
      icon: ShoppingCart,
    },

    {
      id: 2,
      title: "Pending Orders",
      value: dashboard.orders.pending.toLocaleString(),
      subText: "Awaiting action",
      icon: Clock3,
    },

    {
      id: 3,
      title: "Revenue",
      value: `$${dashboard.revenue.total.toLocaleString()}`,
      subText: "Total gross revenue",
      icon: CircleDollarSign,
    },

    {
      id: 4,
      title: "This Month",
      value: `$${dashboard.revenue.thisMonth.toLocaleString()}`,
      subText: "Monthly sales target",
      icon: ChartColumn,
    },

    {
      id: 5,
      title: "Top Product",
      value:
        dashboard.topProducts[0]?.name || "No products",
      subText: dashboard.topProducts[0]
        ? `${dashboard.topProducts[0].totalSold} sold`
        : "No sales yet",
      icon: Package,
    },

    {
      id: 6,
      title: "Users",
      value: dashboard.totalCustomers.toLocaleString(),
      subText: "Registered customers",
      icon: Users,
    },
  ];

  // ================= STATUS COLORS =================
  const statusClasses = {
    pending:
      "bg-warning/10 text-warning border-warning/20",

    processing:
      "bg-info/10 text-info border-info/20",

    confirmed:
      "bg-info/10 text-info border-info/20",

    shipped:
      "bg-info/10 text-info border-info/20",

    delivered:
      "bg-success/10 text-success border-success/20",

    cancelled:
      "bg-danger/10 text-danger border-danger/20",
  };

  // ================= ANIMATION =================
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

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-main px-2 py-3 sm:px-4 md:px-5 lg:px-7 lg:py-5"
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-7 lg:space-y-8">

        {/* ================= HEADER ================= */}
        <motion.section variants={cardVariants}>
          <div className="relative overflow-hidden rounded-2xl border border-border-custom bg-card px-4 py-5 shadow-sm transition-all duration-300 hover:shadow-md sm:px-6 sm:py-6 lg:px-7 lg:py-7">

            <div className="absolute -right-20 -top-15 h-48 w-48 rounded-full bg-active/10 blur-3xl" />

            <div className="relative">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                Admin overview
              </p>

              <h1 className="mt-2 text-xl font-extrabold tracking-tight text-primary sm:text-2xl lg:text-3xl">
                Real-time commerce health
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-secondary sm:text-sm">
                Monitor your storefront with AI-style clarity and live API
                metrics.
              </p>

            </div>
          </div>
        </motion.section>

        {/* ================= STATS ================= */}
        <motion.section
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.25,
                  },
                }}
                className="group relative overflow-hidden rounded-2xl border border-border-custom bg-card px-5 py-4 shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-active/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] sm:px-5 sm:py-4"
              >

                <div className="absolute inset-x-0 top-0 h-[3px] bg-active" />

                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-active/5 blur-2xl transition-all duration-500 group-hover:bg-active/10" />

                <div className="relative flex min-h-[110px] flex-col justify-between">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-semibold text-secondary sm:text-sm">
                        {stat.title}
                      </p>

                      <p
                        className={`mt-2 font-extrabold tracking-tight text-primary ${
                          stat.id === 5
                            ? "line-clamp-2 text-lg leading-6 sm:text-xl"
                            : "text-2xl sm:text-[27px]"
                        }`}
                      >
                        {stat.value}
                      </p>

                    </div>

                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: 4,
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-active/20 bg-active-bg text-active shadow-sm sm:h-11 sm:w-11"
                    >
                      <Icon size={20} strokeWidth={2} />
                    </motion.div>

                  </div>

                  <div className="mt-3 border-t border-border-custom/60 pt-2.5">

                    <p className="text-[10px] font-medium text-secondary sm:text-[11px]">
                      {stat.subText}
                    </p>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ================= ORDER STATUS + TOP PRODUCTS ================= */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          {/* ORDER STATUS */}
          <motion.div
            variants={cardVariants}
            className="rounded-2xl border border-border-custom bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6 xl:col-span-7"
          >

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                  Order status
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
                  Live fulfillment breakdown
                </h2>

              </div>

              <span className="w-fit rounded-lg border border-active/20 bg-active-bg px-3 py-1.5 text-[10px] font-semibold text-active sm:text-xs">
                Updated from API
              </span>

            </div>

            <motion.div
              variants={containerVariants}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
            >

              {dashboard.ordersByStatus.map((status) => (
                <motion.div
                  key={status._id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className={`rounded-xl border p-4 transition-shadow duration-300 hover:shadow-sm ${
                    statusClasses[status._id] ||
                    "bg-main text-primary border-border-custom"
                  }`}
                >

                  <div className="flex items-center justify-between gap-2">

                    <span className="truncate text-[10px] font-bold uppercase tracking-wider sm:text-[11px]">
                      {status._id}
                    </span>

                    <span className="text-[10px] font-semibold opacity-60">
                      {Math.round(
                        (status.count /
                          dashboard.orders.total) *
                          100
                      )}
                      %
                    </span>

                  </div>

                  <p className="mt-3 text-2xl font-black sm:text-3xl">
                    {status.count}
                  </p>

                </motion.div>
              ))}

            </motion.div>
          </motion.div>

          {/* TOP PRODUCTS */}
          <motion.div
            variants={cardVariants}
            className="rounded-2xl border border-border-custom bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6 xl:col-span-5"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                  Top products
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
                  Best sellers
                </h2>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-active-bg text-active">
                <Package size={18} />
              </div>

            </div>

            <motion.div
              variants={containerVariants}
              className="mt-5 space-y-2.5"
            >

              {dashboard.topProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={cardVariants}
                  whileHover={{
                    x: 4,
                  }}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-border-custom/60 bg-main/40 p-3 transition-all duration-300 hover:border-active/40 hover:bg-active-bg/40"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-active/20 bg-active-bg text-xs font-bold text-active">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-xs font-semibold text-primary sm:text-sm">
                      {product.name}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-secondary sm:text-[11px]">
                      {product.totalSold} units sold · $
                      {product.revenue.toLocaleString()}
                    </p>

                  </div>

                  <span className="hidden shrink-0 text-xs font-bold text-active md:block">
                    ${product.revenue.toLocaleString()}
                  </span>

                </motion.div>
              ))}

            </motion.div>
          </motion.div>

        </section>

        {/* ================= RECENT ORDERS ================= */}
        <motion.section variants={cardVariants}>

          <div className="rounded-2xl border border-border-custom bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">

            <div className="mb-5 flex items-center justify-between gap-3">

              <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-active sm:text-[11px]">
                  Recent orders
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
                  Latest customer activity
                </h2>

              </div>

              <span className="shrink-0 rounded-lg border border-active/20 bg-active-bg px-2.5 py-1.5 text-[10px] font-semibold text-active sm:px-3 sm:text-xs">
                {dashboard.recentOrders.length} orders
              </span>

            </div>

            <motion.div
              variants={containerVariants}
              className="space-y-3"
            >

              {dashboard.recentOrders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  whileHover={{
                    x: 3,
                  }}
                  className="rounded-xl border border-border-custom/60 bg-main/30 p-3.5 transition-all duration-300 hover:border-active/40 hover:bg-active-bg/30 sm:p-4"
                >

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-active-bg text-active">
                          <Users size={15} />
                        </div>

                        <p className="text-xs font-bold text-primary sm:text-sm">
                          {order.customer}
                        </p>

                      </div>

                      <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-secondary sm:text-[11px]">
                        {order.details}
                      </p>

                      <p className="mt-1 text-[10px] text-secondary/80">
                        {order.date}
                      </p>

                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-border-custom/50 pt-3 sm:border-0 sm:pt-0">

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide sm:text-[10px] ${
                          statusClasses[order.status] ||
                          "bg-main text-primary border-border-custom"
                        }`}
                      >
                        {order.status}
                      </span>

                      <span className="text-xs font-extrabold text-primary sm:text-sm">
                        ${order.amount}
                      </span>

                    </div>

                  </div>

                </motion.div>
              ))}

            </motion.div>

          </div>

        </motion.section>

      </div>
    </motion.main>
  );
};

export default Dashboard;

