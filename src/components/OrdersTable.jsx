import StatusBadge from "./StatusBadge";

function OrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Order</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Payment</th>
              <th className="py-4 px-6">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">

                  <td className="py-4 px-6 font-medium text-slate-900">
                    {order._id}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs">
                        {order.shippingAddress?.fullName
                          ? order.shippingAddress.fullName.charAt(0)
                          : "—"}
                      </div>

                      <div className="font-medium text-slate-900">
                        {order.shippingAddress?.fullName || "—"}
                      </div>

                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-500">
                    {order.createdAt}
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {order.paymentStatus || "PENDING"}
                    </span>

                    <div className="text-xs text-slate-400 capitalize">
                      {order.paymentMethod || "Cash"}
                    </div>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {order.totalPrice}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  لا توجد نتائج مطابقة...
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
