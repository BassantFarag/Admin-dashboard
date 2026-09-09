import React, { useState, useEffect } from 'react';
import { getAllCarts } from '../api/cartsApi';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  Search, 
  Eye, 
  Mail, 
  X 
} from 'lucide-react';

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCart, setSelectedCart] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllCarts();

        // Safe payload extraction for object, array, or wrapped response
        let rawData = res?.data?.carts || res?.data?.cart || res?.data || [];
        if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
          rawData = [rawData];
        }

        setCarts(Array.isArray(rawData) ? rawData : []);
      } catch (err) {
        console.error("Error fetching carts:", err);
        setError("Failed to fetch carts data from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const totalCartsCount = carts.length;
  const abandonedCartsCount = carts.filter(c => (c.status || '').toLowerCase() === 'abandoned').length;

  const potentialRevenue = carts.reduce((acc, curr) => {
    const price = Number(curr.total) || Number(curr.subtotal) || Number(curr.totalPrice) || 0;
    return acc + price;
  }, 0);

  const recoveryRate = totalCartsCount > 0 
    ? ((abandonedCartsCount / totalCartsCount) * 100).toFixed(1) 
    : "0.0";

  const filteredCarts = carts.filter(cart => {
    const userName = cart.user?.name || cart.userName || 'Customer';
    const cartId = cart._id || cart.id || '';

    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cartId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
                          (cart.status || 'Active').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-[--color-bg-main] p-4 sm:p-6 text-primary space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Admin · Management</span>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Carts</h1>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border-custom p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-active/10 text-active rounded-2xl">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Total Open Carts</p>
            <h3 className="text-xl font-bold mt-0.5">{totalCartsCount} Carts</h3>
          </div>
        </div>

        <div className="bg-card border border-border-custom p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-warning/10 text-warning rounded-2xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Abandoned Carts</p>
            <h3 className="text-xl font-bold mt-0.5">{abandonedCartsCount} Carts</h3>
          </div>
        </div>

        <div className="bg-card border border-border-custom p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Potential Revenue</p>
            <h3 className="text-xl font-bold mt-0.5">${potentialRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-card border border-border-custom p-5 rounded-3xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Recovery Rate</p>
            <h3 className="text-xl font-bold mt-0.5">{recoveryRate}%</h3>
          </div>
        </div>
      </div>

      {/* Filters and Table Container */}
      <div className="bg-card border border-border-custom rounded-3xl p-5 shadow-xl space-y-4">

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input border border-border-custom text-primary rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-active transition-colors placeholder:text-secondary/50"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Active', 'Abandoned', 'Converted'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-active text-primary'
                    : 'bg-input text-secondary hover:text-primary hover:bg-disabled/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Structure with Skeleton Rows */}
        <div className="max-h-[450px] overflow-y-auto border border-border-custom rounded-2xl">
          <table className="w-full text-left text-sm text-secondary relative">
            <thead className="bg-input text-xs uppercase tracking-wider text-secondary sticky top-0 z-10 border-b border-border-custom">
              <tr>
                <th className="py-3.5 px-4 font-semibold">CART</th>
                <th className="py-3.5 px-4 font-semibold">CUSTOMER</th>
                <th className="py-3.5 px-4 font-semibold">ITEMS</th>
                <th className="py-3.5 px-4 font-semibold">TOTAL</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold">LAST ACTIVE</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              {loading ? (
                /* Skeleton rows during loading state */
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-input/80 rounded w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-input/80 rounded w-32"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-input/80 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-input/80 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-input/80 rounded w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-input/80 rounded w-24"></div></td>
                    <td className="py-4 px-4 text-right"><div className="h-8 bg-input/80 rounded-xl w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredCarts.length === 0 ? (
                /* Empty state */
                <tr>
                  <td colSpan="7" className="text-center py-12 text-secondary text-sm">
                    {error || "No carts found."}
                  </td>
                </tr>
              ) : (
                /* Data rows */
                filteredCarts.map((cart, index) => {
                  const displayId = cart._id || cart.id || `CART-${index + 1}`;
                  const totalPrice = Number(cart.total) || Number(cart.subtotal) || Number(cart.totalPrice) || 0;
                  const itemsCount = cart.itemCount || cart.items?.length || 0;

                  return (
                    <tr key={displayId} className="hover:bg-input/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-primary">{displayId}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-active/20 text-active font-bold flex items-center justify-center text-xs">
                            {cart.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-primary font-medium text-xs sm:text-sm">{cart.user?.name || 'Customer'}</p>
                            <p className="text-secondary text-[11px]">{cart.user?.email || 'Active Cart'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-primary">{itemsCount} items</td>
                      <td className="py-4 px-4 font-bold text-primary">${totalPrice.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-xl text-[11px] font-semibold inline-block ${
                          (cart.status || '').toLowerCase() === 'abandoned'
                            ? 'bg-warning/10 text-warning border border-warning/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {cart.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs">{cart.lastUpdated || 'Recently'}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(cart.status || '').toLowerCase() === 'abandoned' && (
                            <button 
                              title="Send Recovery Email"
                              className="p-2 bg-input hover:bg-warning/20 hover:text-warning rounded-xl transition-colors cursor-pointer"
                            >
                              <Mail size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedCart(cart)}
                            title="View Details"
                            className="p-2 bg-input hover:bg-active/20 hover:text-active rounded-xl transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Cart Details */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border-custom w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setSelectedCart(null)}
              className="absolute top-5 right-5 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-primary">
                Cart Details ({selectedCart._id || selectedCart.id || 'Cart'})
              </h3>
              <p className="text-xs text-secondary">
                Customer: {selectedCart.user?.name || 'Unknown User'}
              </p>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedCart.items?.map((item, idx) => {
                const itemPrice = Number(item.price) || Number(item.product?.price) || 0;
                const qty = Number(item.quantity) || 1;
                return (
                  <div key={idx} className="flex justify-between items-center p-3 bg-input rounded-2xl border border-border-custom text-xs">
                    <div>
                      <p className="font-semibold text-primary">{item.name || item.product?.name || 'Product'}</p>
                      <p className="text-secondary">Qty: {qty}</p>
                    </div>
                    <p className="font-bold text-primary">${(itemPrice * qty).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border-custom pt-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-secondary">Total Value:</span>
              <span className="text-lg font-bold text-primary">
                ${(Number(selectedCart.total) || Number(selectedCart.subtotal) || Number(selectedCart.totalPrice) || 0).toFixed(2)}
              </span>
            </div>

            <button 
              onClick={() => setSelectedCart(null)}
              className="w-full bg-active hover:bg-active-hover text-primary font-semibold py-3 rounded-2xl text-sm transition-colors cursor-pointer"
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