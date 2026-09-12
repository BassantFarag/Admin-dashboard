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
    <div className="w-full max-w-full flex-row overflow-x-hidden min-h-screen bg-[--color-bg-main] p-3 sm:p-6 text-primary space-y-4 sm:space-y-6 box-border">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 w-full">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-secondary font-semibold">Admin · Management</span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Carts</h1>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 w-full box-border">
          <div className="p-2.5 sm:p-3 bg-active/10 text-active rounded-xl sm:rounded-2xl shrink-0">
            <ShoppingCart size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-secondary font-medium truncate">Total Open Carts</p>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5 truncate">{totalCartsCount} Carts</h3>
          </div>
        </div>

        <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 w-full box-border">
          <div className="p-2.5 sm:p-3 bg-warning/10 text-warning rounded-xl sm:rounded-2xl shrink-0">
            <Clock size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-secondary font-medium truncate">Abandoned Carts</p>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5 truncate">{abandonedCartsCount} Carts</h3>
          </div>
        </div>

        <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 w-full box-border">
          <div className="p-2.5 sm:p-3 bg-emerald-500/10 text-emerald-400 rounded-xl sm:rounded-2xl shrink-0">
            <DollarSign size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-secondary font-medium truncate">Potential Revenue</p>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5 truncate">${potentialRevenue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-card border border-border-custom p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 w-full box-border">
          <div className="p-2.5 sm:p-3 bg-purple-500/10 text-purple-400 rounded-xl sm:rounded-2xl shrink-0">
            <ShoppingBag size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-secondary font-medium truncate">Recovery Rate</p>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5 truncate">{recoveryRate}%</h3>
          </div>
        </div>
      </div>

      {/* Filters and Main Content Container */}
      <div className="bg-card border border-border-custom rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl space-y-4 w-full max-w-full box-border overflow-hidden">

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center w-full">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input border border-border-custom text-primary rounded-xl sm:rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-active transition-colors placeholder:text-secondary/50 box-border"
            />
          </div>

          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {['All', 'Active', 'Abandoned', 'Converted'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
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

        {/* Mobile View: Cards Layout / Desktop View: Traditional Table */}
        <div className="w-full">
          
          {/* Mobile Cards Layout (Visually active on screens < sm) */}
          <div className="block sm:hidden space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-input/30 p-4 rounded-2xl border border-border-custom animate-pulse space-y-2">
                  <div className="h-4 bg-input rounded w-24"></div>
                  <div className="h-4 bg-input rounded w-32"></div>
                </div>
              ))
            ) : filteredCarts.length === 0 ? (
              <div className="text-center py-8 text-secondary text-sm">
                {error || "No carts found."}
              </div>
            ) : (
              filteredCarts.map((cart, index) => {
                const displayId = cart._id || cart.id || `CART-${index + 1}`;
                const totalPrice = Number(cart.total) || Number(cart.subtotal) || Number(cart.totalPrice) || 0;
                const itemsCount = cart.itemCount || cart.items?.length || 0;

                return (
                  <div key={displayId} className="bg-card border border-border-custom rounded-2xl p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center border-b border-border-custom/50 pb-2">
                      <span className="font-mono text-xs font-bold text-primary">{displayId}</span>
                      <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-semibold ${
                        (cart.status || '').toLowerCase() === 'abandoned'
                          ? 'bg-warning/10 text-warning border border-warning/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {cart.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-active/20 text-active font-bold flex items-center justify-center text-xs shrink-0">
                        {cart.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-primary font-medium text-xs truncate">{cart.user?.name || 'Customer'}</p>
                        <p className="text-secondary text-[11px] truncate">{cart.user?.email || 'Active Cart'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-secondary">{itemsCount} items</span>
                      <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border-custom/50">
                      <span className="text-[11px] text-secondary">{cart.lastUpdated || 'Recently'}</span>
                      <div className="flex items-center gap-2">
                        {(cart.status || '').toLowerCase() === 'abandoned' && (
                          <button 
                            title="Send Recovery Email"
                            className="p-1.5 bg-input hover:bg-warning/20 hover:text-warning rounded-lg transition-colors cursor-pointer"
                          >
                            <Mail size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedCart(cart)}
                          title="View Details"
                          className="p-1.5 bg-input hover:bg-active/20 hover:text-active rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View (Visible only on screens >= sm) */}
          <div className="hidden sm:block max-h-[500px] overflow-y-auto border border-border-custom rounded-2xl">
            <table className="w-full text-left text-sm text-secondary">
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
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-4"><div className="h-4 bg-input rounded w-20"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-input rounded w-32"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-input rounded w-16"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-input rounded w-16"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-input rounded w-20"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-input rounded w-24"></div></td>
                      <td className="py-4 px-4 text-right"><div className="h-8 bg-input rounded-xl w-8 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredCarts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-secondary text-sm">
                      {error || "No carts found."}
                    </td>
                  </tr>
                ) : (
                  filteredCarts.map((cart, index) => {
                    const displayId = cart._id || cart.id || `CART-${index + 1}`;
                    const totalPrice = Number(cart.total) || Number(cart.subtotal) || Number(cart.totalPrice) || 0;
                    const itemsCount = cart.itemCount || cart.items?.length || 0;

                    return (
                      <tr key={displayId} className="hover:bg-input/30 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs font-bold text-primary whitespace-nowrap">{displayId}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-active/20 text-active font-bold flex items-center justify-center text-xs shrink-0">
                              {cart.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-primary font-medium text-xs sm:text-sm truncate">{cart.user?.name || 'Customer'}</p>
                              <p className="text-secondary text-[11px] truncate">{cart.user?.email || 'Active Cart'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-primary whitespace-nowrap">{itemsCount} items</td>
                        <td className="py-4 px-4 font-bold text-primary whitespace-nowrap">${totalPrice.toFixed(2)}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-xl text-[11px] font-semibold inline-block ${
                            (cart.status || '').toLowerCase() === 'abandoned'
                              ? 'bg-warning/10 text-warning border border-warning/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {cart.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs whitespace-nowrap">{cart.lastUpdated || 'Recently'}</td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
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
      </div>

      {/* Modal for Cart Details */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-card border border-border-custom w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setSelectedCart(null)}
              className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-1 pr-6">
              <h3 className="text-base sm:text-lg font-bold text-primary truncate">
                Cart Details ({selectedCart._id || selectedCart.id || 'Cart'})
              </h3>
              <p className="text-xs text-secondary truncate">
                Customer: {selectedCart.user?.name || 'Unknown User'}
              </p>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {selectedCart.items?.map((item, idx) => {
                const itemPrice = Number(item.price) || Number(item.product?.price) || 0;
                const qty = Number(item.quantity) || 1;
                return (
                  <div key={idx} className="flex justify-between items-center p-2.5 sm:p-3 bg-input rounded-xl sm:rounded-2xl border border-border-custom text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-primary truncate">{item.name || item.product?.name || 'Product'}</p>
                      <p className="text-secondary">Qty: {qty}</p>
                    </div>
                    <p className="font-bold text-primary shrink-0">${(itemPrice * qty).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border-custom pt-3 flex justify-between items-center">
              <span className="text-xs sm:text-sm font-semibold text-secondary">Total Value:</span>
              <span className="text-base sm:text-lg font-bold text-primary">
                ${(Number(selectedCart.total) || Number(selectedCart.subtotal) || Number(selectedCart.totalPrice) || 0).toFixed(2)}
              </span>
            </div>

            <button 
              onClick={() => setSelectedCart(null)}
              className="w-full bg-active hover:bg-active-hover text-primary font-semibold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm transition-colors cursor-pointer shrink-0"
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