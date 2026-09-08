import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../api/OrdersApi";

// state

const OrderSidebar = ({ order, onClose, onOrderUpdated }) => {
  const [status, setStatus] = useState("pending");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!order) return;

    setStatus((order.status || "pending").toLowerCase());
    setAdminNote(order.adminNote || "");

    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  }, [order]);

  // close sidebar
  const handleClose = () => {
    setIsOpen(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  // save order changes
  const handleSaveChanges = async () => {
    if (!order?._id) {
      toast.error("Order ID not found");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        status,
        adminNote,
      };

      await updateOrderStatus(order._id, payload);

      toast.success(`status updated to "${status}"`);

      setIsOpen(false);

      setTimeout(() => {
        onOrderUpdated?.({
          status,
          adminNote,
        });

        onClose();
      }, 300);
    } catch (error) {
      console.error("Update order error:", error);

      const message = error.response?.data?.message || "Failed to update order";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };
// check order 
  if (!order) return null;


  // status for style
  const statusStyles = {
    pending:
      "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-400/30",
    confirmed:
      "bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-900/30 dark:text-sky-200 dark:ring-sky-400/30",
    processing:
      "bg-purple-100 text-purple-800 ring-purple-300 dark:bg-purple-900/30 dark:text-purple-200 dark:ring-purple-400/30",
    shipped:
      "bg-indigo-100 text-indigo-800 ring-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-200 dark:ring-indigo-400/30",
    delivered:
      "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-400/30",
    cancelled:
      "bg-red-100 text-red-800 ring-red-300 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-400/30",
    returned:
      "bg-orange-100 text-orange-800 ring-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:ring-orange-400/30",
  };

  // status dot colors

  const statusDots = {
    pending: "bg-amber-500 dark:bg-amber-400",
    confirmed: "bg-sky-500 dark:bg-sky-400",
    processing: "bg-purple-500 dark:bg-purple-400",
    shipped: "bg-indigo-500 dark:bg-indigo-400",
    delivered: "bg-emerald-500 dark:bg-emerald-400",
    cancelled: "bg-red-500 dark:bg-red-400",
    returned: "bg-orange-500 dark:bg-orange-400",
  };
  // order price calculations

  const subtotal = Number(
    order.subtotal || order.itemsPrice || order.totalPrice || 0,
  );
  const shipping = Number(order.shippingPrice || 0);
  const tax = Number(order.taxPrice || 0);
  const discount = Number(order.discount || 0);

  const total = Number(
    order.totalPrice || subtotal + shipping + tax - discount,
  );

  // payment 
  const paymentStatus = order.paymentStatus || "Pending";
  const paymentMethod = order.paymentMethod || "Cash";

  return (
    <>
      {/* blur */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 h-full bg-black/40 backdrop-blur-md transition-opacity duration-300 ease-out ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      {/* side bar*/}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col bg-white text-gray-900 shadow-2xl transition-transform duration-300 ease-out dark:bg-gray-950 dark:text-white ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* header side bar*/}
        <div className="flex shrink-0 items-center justify-between border-b border-amber-300/70 px-6 py-4 dark:border-white/10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Order detail
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-gray-900 dark:text-white">
              #{order._id?.slice(-8)}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-amber-50 hover:text-gray-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
          {/* status */}

          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-white/50">
              Order Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-amber-300/70 bg-amber-50/30 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-gray-900 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusStyles[status] || statusStyles.pending}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${statusDots[status] || statusDots.pending}`}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>

          {/* customers */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40">
              Customer
            </h3>

            <div className="rounded-xl border border-amber-300/70 bg-amber-50/30 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {order.shippingAddress?.fullName || "N/A"}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                {order.shippingAddress?.phone || "N/A"}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                {order.shippingAddress?.email || order.user?.email || "N/A"}
              </p>
            </div>
          </section>

          {/* shiping address */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40">
              Shipping Address
            </h3>

            <div className="rounded-xl border border-amber-300/70 bg-amber-50/30 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm leading-6 text-gray-700 dark:text-white/80">
                {order.shippingAddress?.address || "N/A"}
              </p>

              <p className="text-sm text-gray-500 dark:text-white/50">
                {order.shippingAddress?.city || ""}
                {order.shippingAddress?.city && order.shippingAddress?.country
                  ? ", "
                  : ""}
                {order.shippingAddress?.country || ""}
              </p>
            </div>
          </section>

          {/* order items */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40">
              Order Items
            </h3>

            <div className="space-y-3">
              {(order.items || []).map((item, index) => {
                const product = item.product || item.productId || item;
                const productName = product?.name || item.name || "Product";
                const image =
                  product?.image || product?.images?.[0] || item.image || null;
                const quantity = item.quantity || item.qty || 1;
                const price = Number(item.price || item.productPrice || 0);

                return (
                  <div
                    key={item._id || index}
                    className="flex gap-3 rounded-xl border border-amber-300/70 bg-amber-50/30 p-3 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={productName}
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs text-gray-500 dark:bg-white/10 dark:text-white/30">
                        No Image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {productName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-white/40">
                        Quantity: {quantity}
                      </p>

                      <p className="mt-2 text-sm font-bold text-amber-600 dark:text-amber-400">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/*  payment method */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40">
              Payment
            </h3>

            <div className="rounded-xl border border-amber-300/70 bg-amber-50/30 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/50">
                  Method
                </span>

                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {paymentMethod}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/50">
                  Payment Status
                </span>

                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {paymentStatus}
                </span>
              </div>
            </div>
          </section>

          {/* price summary */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40">
              Price Summary
            </h3>

            <div className="rounded-xl border border-amber-300/70 bg-amber-50/30 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white/50">
                  Subtotal
                </span>

                <span className="text-gray-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white/50">
                  Shipping
                </span>

                <span className="text-gray-900 dark:text-white">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500 dark:text-white/50">Tax</span>

                <span className="text-gray-900 dark:text-white">
                  ${tax.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-white/50">
                    Discount
                  </span>

                  <span className="text-emerald-600 dark:text-emerald-400">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-amber-300/70 pt-4 dark:border-white/10">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Total
                </span>

                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* admin note */}
          <section className="pb-6">
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40">
              Admin Note
            </label>

            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
              placeholder="Add a note about this order..."
              className="w-full resize-none rounded-xl border border-amber-300/70 bg-amber-50/30 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/20"
            />
          </section>
        </div>

        {/* fotter */}
        <div className="shrink-0 border-t border-amber-300/70 bg-white px-6 py-4 dark:border-white/10 dark:bg-gray-950">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="w-full cursor-pointer rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default OrderSidebar;
