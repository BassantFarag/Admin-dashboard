import { useState, useEffect } from 'react';
import { getAllCarts } from '../api/cartsApi';

import {
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Eye,
  X,
} from 'lucide-react';

const Carts = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCart, setSelectedCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllCarts();

        console.log('REAL CART DATA:', res.data);

        setCart(res.data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setError('Failed to load cart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);


  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;
  const subtotal = Number(cart?.subtotal) || 0;
  const discountAmount = Number(cart?.discountAmount) || 0;
  const total = Number(cart?.total) || 0;
  const coupon = cart?.coupon || null;

  return (
    <div className="w-full max-w-full min-h-screen bg-[--color-bg-main] p-3 sm:p-6 text-primary space-y-4 sm:space-y-6 box-border overflow-x-hidden">

  
      <div>
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-secondary font-semibold">
          Admin · Management
        </span>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
          Cart
        </h1>
      </div>


      {loading && (
        <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-6 text-center">
          <p className="text-secondary">Loading cart...</p>
        </div>
      )}

    
      {!loading && error && (
        <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-6 text-center">
          <p className="text-warning">{error}</p>
        </div>
      )}

    
      {!loading && !error && cart && (
        <>
      
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">

          
            <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-active/10 text-active rounded-xl sm:rounded-2xl">
                <ShoppingCart size={22} />
              </div>

              <div>
                <p className="text-[11px] sm:text-xs text-secondary font-medium">
                  Total Items
                </p>

                <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                  {itemCount}
                </h3>
              </div>
            </div>

          
            <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-emerald-500/10 text-emerald-400 rounded-xl sm:rounded-2xl">
                <DollarSign size={22} />
              </div>

              <div>
                <p className="text-[11px] sm:text-xs text-secondary font-medium">
                  Subtotal
                </p>

                <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                  ${subtotal.toFixed(2)}
                </h3>
              </div>
            </div>

    
            <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-warning/10 text-warning rounded-xl sm:rounded-2xl">
                <ShoppingBag size={22} />
              </div>

              <div>
                <p className="text-[11px] sm:text-xs text-secondary font-medium">
                  Discount
                </p>

                <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                  ${discountAmount.toFixed(2)}
                </h3>
              </div>
            </div>

    
            <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-purple-500/10 text-purple-400 rounded-xl sm:rounded-2xl">
                <DollarSign size={22} />
              </div>

              <div>
                <p className="text-[11px] sm:text-xs text-secondary font-medium">
                  Total
                </p>

                <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                  ${total.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>

      
          {coupon && (
            <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">
                  Applied Coupon
                </span>

                <span className="px-3 py-1 rounded-xl bg-active/10 text-active font-semibold text-sm">
                  {coupon}
                </span>
              </div>
            </div>
          )}

     
          <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-primary">
                  Cart Items
                </h2>

                <p className="text-xs text-secondary mt-1">
                  {items.length} products
                </p>
              </div>
            </div>

     
            <div className="hidden sm:block overflow-x-auto border border-border-custom rounded-2xl">
              <table className="w-full text-left text-sm">

                <thead className="bg-input text-xs uppercase tracking-wider text-secondary">
                  <tr>
                    <th className="py-3.5 px-4">PRODUCT</th>
                    <th className="py-3.5 px-4">PRICE</th>
                    <th className="py-3.5 px-4">QUANTITY</th>
                    <th className="py-3.5 px-4">TOTAL</th>
                    <th className="py-3.5 px-4 text-right">ACTION</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-custom">

                  {items.map((item, index) => {
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    const itemTotal = price * quantity;

                    return (
                      <tr
                        key={item._id || index}
                        className="hover:bg-input/30 transition-colors"
                      >

                  
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">

                            <img
                              src={item.image || '/placeholder.png'}
                              alt={item.name || 'Product'}
                              className="w-12 h-12 rounded-xl object-cover bg-input"
                            />

                            <div>
                              <p className="font-semibold text-primary">
                                {item.name || 'Product'}
                              </p>

                              <p className="text-xs text-secondary">
                                ID: {item.product || item._id || 'N/A'}
                              </p>
                            </div>

                          </div>
                        </td>

                   
                        <td className="py-4 px-4 font-medium text-primary">
                          ${price.toFixed(2)}
                        </td>

                        <td className="py-4 px-4 text-primary">
                          {quantity}
                        </td>

                      
                        <td className="py-4 px-4 font-bold text-primary">
                          ${itemTotal.toFixed(2)}
                        </td>

                  
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSelectedCart(item)}
                            title="View Details"
                            className="p-2 bg-input hover:bg-active/20 hover:text-active rounded-xl transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="block sm:hidden space-y-3">

              {items.map((item, index) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const itemTotal = price * quantity;

                return (
                  <div
                    key={item._id || index}
                    className="bg-input/30 border border-border-custom rounded-2xl p-3"
                  >

                    <div className="flex gap-3">

                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name || 'Product'}
                        className="w-16 h-16 rounded-xl object-cover bg-input shrink-0"
                      />

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-2">

                          <div className="min-w-0">
                            <p className="font-semibold text-primary text-sm truncate">
                              {item.name || 'Product'}
                            </p>

                            <p className="text-xs text-secondary mt-1">
                              Price: ${price.toFixed(2)}
                            </p>

                            <p className="text-xs text-secondary">
                              Quantity: {quantity}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedCart(item)}
                            className="p-2 h-fit bg-input hover:bg-active/20 hover:text-active rounded-xl"
                          >
                            <Eye size={15} />
                          </button>

                        </div>

                        <p className="font-bold text-primary mt-2">
                          ${itemTotal.toFixed(2)}
                        </p>

                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-4 sm:p-5">

            <div className="max-w-md ml-auto space-y-3">

              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal</span>
                <span className="font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-secondary">Discount</span>
                <span className="font-semibold text-warning">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>

              {coupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Coupon</span>
                  <span className="font-semibold text-active">
                    {coupon}
                  </span>
                </div>
              )}

              <div className="border-t border-border-custom pt-3 flex justify-between">
                <span className="font-bold">Total</span>

                <span className="text-lg font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && !error && !cart && (
        <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-10 text-center">
          <p className="text-secondary">No cart found.</p>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">

          <div className="bg-card border border-border-custom w-full max-w-md rounded-2xl sm:rounded-3xl p-5 shadow-2xl relative">

            <button
              onClick={() => setSelectedCart(null)}
              className="absolute top-4 right-4 text-secondary hover:text-primary"
            >
              <X size={20} />
            </button>

            <div className="pr-8">
              <h3 className="text-lg font-bold text-primary">
                Product Details
              </h3>

              <p className="text-sm text-secondary mt-1">
                {selectedCart.name || 'Product'}
              </p>
            </div>

            <div className="mt-5 space-y-3">

              <div className="flex justify-between">
                <span className="text-secondary">Price</span>
                <span className="font-semibold">
                  ${Number(selectedCart.price || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary">Quantity</span>
                <span className="font-semibold">
                  {selectedCart.quantity || 0}
                </span>
              </div>

              <div className="flex justify-between border-t border-border-custom pt-3">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  $
                  {(
                    Number(selectedCart.price || 0) *
                    Number(selectedCart.quantity || 0)
                  ).toFixed(2)}
                </span>
              </div>

            </div>

            <button
              onClick={() => setSelectedCart(null)}
              className="w-full mt-5 bg-active hover:bg-active-hover text-primary font-semibold py-2.5 rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Carts;
