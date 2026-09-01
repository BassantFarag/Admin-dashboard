import StatusBadge from "./StatusBadge";
import { PackageX , User } from "lucide-react";
function OrdersTable({ orders = [] }) {
  return (
    <div className="rounded-xl shadow-sm border border-border-custom bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b border-border-custom text-secondary text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-custom text-sm text-secondary">
            {orders.length > 0 ? (
              orders.map((order) => {
                const customerName =
                  order.user?.name ||
                  order.shippingAddress?.fullName ||
                  order.customerName ||
                  "Unknown User";
                
                return(
                <tr key={order._id} className="hover:bg-input transition-colors">
                    {/* Order ID */}
                  <td className="py-4 px-6 font-medium text-primary">
                    #{order._id ? order._id.slice(-8).toUpperCase() : "—"}
                  </td>

                  {/* Customer Name & Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {/*Avatar */}
                      <div className="w-8 h-8 rounded-full bg-input border border-border-custom flex items-center justify-center text-primary font-semibold text-xs uppercase">
                            {customerName !== "Unknown User" ? (
                              customerName.charAt(0)
                              ) : ( <User className="w-4 h-4 text-secondary" /> )}
                        </div>
                                 
                    
                         {/* Customer Name */}
                      <div className="font-medium text-primary capitalize">
                          {customerName}
                      </div>

                    </div>
                  </td>
                  {/* Date */}
                  <td className="py-4 px-6 text-secondary">
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

                  {/* Payment Status & Method */}
                  <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase">
                        {order.paymentStatus || "PENDING"}
                      </span>
                      <div className="text-xs text-secondary capitalize">
                        {order.paymentMethod || "Cash"}
                      </div>
                    </td>

                  <td className="py-4 px-6 font-semibold text-primary">
                      {Number(order.totalPrice || 0).toLocaleString("en-US", {
                       minimumFractionDigits: 2,
                       })}{" "}
                          EGP
                  </td>

                </tr>);
                })
            ) : (
             <tr>
              <td colSpan="6" className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <PackageX className="w-10 h-10 text-secondary/50 stroke-[1.5]" />
                  <p className="text-sm font-medium text-primary">
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
