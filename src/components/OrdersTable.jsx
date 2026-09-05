import StatusBadge from "./StatusBadge"; // إعادة تفعيل الـ import
import { PackageX, User } from "lucide-react";

// مكون Skeleton مميز بنفس شكل الخطوط الأفقية المدورة
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-border-custom/30">
    {/* Order ID Skeleton */}
    <td className="py-5 px-6">
      <div className="h-3.5 w-24 bg-[#2a2f3d] rounded-full"></div>
    </td>

    {/* Customer Skeleton */}
    <td className="py-5 px-6">
      <div className="h-3.5 w-32 bg-[#2a2f3d] rounded-full"></div>
    </td>

    {/* Date Skeleton */}
    <td className="py-5 px-6">
      <div className="h-3.5 w-20 bg-[#2a2f3d] rounded-full"></div>
    </td>

    {/* Status Skeleton */}
    <td className="py-5 px-6">
      <div className="h-3.5 w-28 bg-[#2a2f3d] rounded-full"></div>
    </td>

    {/* Payment Skeleton */}
    <td className="py-5 px-6">
      <div className="h-3.5 w-24 bg-[#2a2f3d] rounded-full"></div>
    </td>

    {/* Total Price Skeleton */}
    <td className="py-5 px-6 flex justify-end">
      <div className="h-3.5 w-20 bg-[#2a2f3d] rounded-full"></div>
    </td>
  </tr>
);

function OrdersTable({ orders = [], isLoading = false }) {
  return (
    <div className="rounded-2xl shadow-xl border border-border-custom bg-card/80 overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Header Gradient */}
          <thead>
            <tr className="border-b border-border-custom bg-gradient-to-r from-input/60 via-input/30 to-input/60 text-secondary text-[11px] font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6 text-right">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-custom/50 text-sm">
            {isLoading ? (
              // 1. حالة التحميل: عرض الـ Skeleton Rows
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : orders.length > 0 ? (
              // 2. حالة وجود طلبات: عرض البيانات
              orders.map((order) => {
                const customerName =
                  order.user?.name ||
                  order.shippingAddress?.fullName ||
                  order.customerName ||
                  "Unknown User";

                return (
                  <tr
                    key={order._id}
                    className="hover:bg-gradient-to-r hover:from-amber-500/[0.04] hover:via-amber-500/[0.02] hover:to-transparent transition-all duration-300 group"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-primary/90 tracking-wider">
                      #{order._id ? order._id.slice(-8).toUpperCase() : "—"}
                    </td>

                    {/* Customer Name & Gradient Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 max-w-[220px]">
                        <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs uppercase shadow-xs group-hover:scale-105 transition-transform duration-300">
                          {customerName !== "Unknown User" ? (
                            customerName.charAt(0)
                          ) : (
                            <User className="w-4 h-4 text-amber-400/80" />
                          )}
                        </div>
                        <div
                          className="font-medium text-primary capitalize line-clamp-1 group-hover:text-amber-400 transition-colors"
                          title={customerName}
                        >
                          {customerName}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-secondary whitespace-nowrap">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-amber-500/15 to-amber-600/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                          {order.paymentStatus || "PENDING"}
                        </span>
                        <span className="text-xs text-secondary capitalize pl-0.5">
                          {order.paymentMethod || "Cash"}
                        </span>
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-6 text-right font-semibold text-primary font-mono whitespace-nowrap">
                      {Number(order.totalPrice || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      <span className="text-xs font-sans text-secondary ml-0.5">EGP</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              // 3. حالة عدم وجود داتا (No Orders)
              <tr>
                <td colSpan="6" className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageX className="w-12 h-12 text-secondary/40 stroke-[1.5]" />
                    <p className="text-base font-semibold text-primary">
                      No orders found
                    </p>
                    <p className="text-xs text-secondary">
                      There are no matching orders to display right now.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;