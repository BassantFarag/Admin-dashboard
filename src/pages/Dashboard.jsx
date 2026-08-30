import { useState, useEffect } from "react";
import api from "../api/axios.js";

import {
  ShoppingCart,
  Clock3,
  CircleDollarSign,
  ChartColumn,
  Package,
  Users,
} from "lucide-react";



const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});


  useEffect(() => {
  api
    .get("/orders/admin/dashboard")
    .then((response) => {
      setDashboard(response.data.dashboard);
    
    })
    .catch((error) => {
      console.log(error);
    });
}, []);


const carts = [
  {
    id: 1,
    title: "Total Orders",
    value: "169",
    subText: "All orders received",
    icon: ShoppingCart,
  },
  {
    id: 2,
    title: "Pending Orders",
    value: "11",
    subText: "Awaiting action",
    icon: Clock3,
  },
  {
    id: 3,
    title: "Revenue",
    value: "$16,079,595.16",
    subText: "Total gross revenue",
    icon: CircleDollarSign,
  },
  {
    id: 4,
    title: "This Month",
    value:"$15,960,652.90",
    subText: "Monthly sales target",
    icon: ChartColumn,
  },
  {
    id: 5,
    title: "Top Product",
    value:"Modern Floor Lamp",
    subText: dashboard.topProducts?.[0]
      ? `${dashboard.topProducts[0].totalSold} sold`
      : "",
    icon: Package,
  },
  {
    id: 6,
    title: "Users",
    value: " 1",
    subText: "Registered customers",
    icon: Users,
  },
];

  return (
    <div className="w-full min-h-screen bg-main px-4 sm:px-6 lg:px-8 py-5 space-y-5">

      
      <section className="w-full">
        <div className="w-full rounded-xl border border-border-custom bg-card shadow-sm px-5 py-4 sm:px-6 sm:py-5">

          <p className="mb-1 text-[11px] font-bold tracking-[0.18em] uppercase text-active">
            Admin overview
          </p>

          <h1 className="mb-1 text-xl sm:text-2xl font-extrabold tracking-tight text-primary">
            Real-time commerce health
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-secondary">
            Monitor your storefront with AI-style clarity and live API metrics.
          </p>

        </div>
      </section>

     
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {carts.map((stat) => {
          const IconComponent = stat.icon;

          return (
            <div
              key={stat.id}
              className="group relative rounded-xl border border-border-custom bg-card p-4 sm:p-5 shadow-[0_-3px_18px_-4px_rgba(184,131,34,0.08),0_4px_6px_-1px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md hover:border-active/60 flex flex-col justify-between"
            >

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    {stat.title}
                  </h2>

                  <div className="mt-2">
                    <p className="break-words text-xl sm:text-2xl font-bold tracking-tight text-primary">
                      {stat.value}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-active-bg text-active border border-active/35 shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <IconComponent
                    size={20}
                    strokeWidth={2}
                  />
                </div>

              </div>

              <div className="mt-4 pt-2.5 border-t border-border-custom/40 flex items-center justify-between">

                <p className="text-xs font-medium text-secondary">
                  {stat.subText}
                </p>

              </div>

            </div>
          );
        })}

      </section>

  
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">

       
        <div className="lg:col-span-7 bg-card rounded-xl border border-border-custom shadow-[0_-3px_18px_-4px_rgba(184,131,34,0.08),0_4px_6px_-1px_rgba(0,0,0,0.03)] px-5 py-4 sm:px-6 sm:py-5 flex flex-col justify-between min-h-[350px]">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>
              <h1 className="mb-1 text-[11px] font-bold tracking-[0.18em] uppercase text-active">
                Order status
              </h1>

              <p className="text-lg sm:text-xl font-extrabold tracking-tight text-primary">
                Live fulfillment breakdown
              </p>
            </div>

            <div className="px-3 h-8 flex items-center justify-center text-xs font-medium border border-border-custom/50 rounded-md bg-active-bg text-active w-fit">
              Updated from API
            </div>

          </div>

          <div className="my-auto py-6 text-xs text-secondary">

            {dashboard.ordersByStatus?.map((status) => (
              <div
                key={status._id}
                className="flex items-center justify-between py-2 border-b border-border-custom/40"
              >
                <span className="capitalize">
                  {status._id}
                </span>

                <span className="font-semibold text-primary">
                  {status.count}
                </span>
              </div>
            ))}

          </div>

        </div>

       
        <div className="lg:col-span-5 bg-card rounded-xl border border-border-custom shadow-[0_-3px_18px_-4px_rgba(184,131,34,0.08),0_4px_6px_-1px_rgba(0,0,0,0.03)] px-5 py-4 sm:px-6 sm:py-5 flex flex-col justify-between min-h-[350px]">

          <div>

            <h1 className="mb-1 text-[11px] font-bold tracking-[0.18em] uppercase text-active">
              Top products
            </h1>

            <p className="text-lg sm:text-xl font-extrabold tracking-tight text-primary">
              Best sellers
            </p>

          </div>

          <div className="my-auto py-6 text-xs text-secondary">

            {dashboard.topProducts?.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between py-3 border-b border-border-custom/40"
              >

                <div>
                  <p className="font-semibold text-primary">
                    {product.name}
                  </p>

                  <p className="text-xs text-secondary">
                    {product.totalSold} sold
                  </p>
                </div>

                <p className="font-semibold text-primary">
                  ${product.revenue}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;