import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Clock, 
  DollarSign, 
  Search, 
  Eye, 
  Mail, 
  X,
  Loader2
} from 'lucide-react';

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCart, setSelectedCart] = useState(null);

  // جلب البيانات الديناميكية من الـ API
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        // استبدلي هذا الرابط بمسار الـ API الخاص بكِ
        const response = await axios.get('/api/carts'); 
        setCarts(response.data);
      } catch (err) {
        console.error("Error fetching carts:", err);
        setError("فشل في تحميل بيانات السلال من السيرفر.");
        
        // بيانات مؤقتة لتجربة التصميم في حال عدم اتصال الـ Backend
        setCarts([
          {
            id: "CART-8091",
            user: { name: "Ahmed Hassan", email: "ahmed@example.com", avatar: "A" },
            itemsCount: 3,
            totalPrice: 420.00,
            status: "Abandoned",
            lastUpdated: "10 mins ago",
            items: [
              { name: "Wireless Headphones", price: 120, quantity: 1 },
              { name: "Smart Watch v2", price: 300, quantity: 1 }
            ]
          },
          {
            id: "CART-8092",
            user: { name: "Sarah Ali", email: "sarah@example.com", avatar: "S" },
            itemsCount: 1,
            totalPrice: 85.50,
            status: "Active",
            lastUpdated: "2 mins ago",
            items: [
              { name: "Ergonomic Mouse", price: 85.50, quantity: 1 }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  // حساب الإحصائيات ديناميكياً من البيانات المستقبلة
  const totalCartsCount = carts.length;
  const abandonedCartsCount = carts.filter(c => c.status === 'Abandoned').length;
  const potentialRevenue = carts.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // فلترة وتصفية البيانات
  const filteredCarts = carts.filter(cart => {
    const userName = cart.user?.name || '';
    const cartId = cart.id || '';
    
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cartId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || cart.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-bg-main p-4 sm:p-6 text-primary space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active & Abandoned Carts</h1>
          <p className="text-secondary text-sm">Monitor customer carts in real-time and recover lost sales.</p>
        </div>
      </div>

      {/* Dynamic Stats Cards */}
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
            <h3 className="text-xl font-bold mt-0.5">
              {totalCartsCount > 0 ? ((abandonedCartsCount / totalCartsCount) * 100).toFixed(1) : 0}%
            </h3>
          </div>
        </div>
      </div>

      {/* Filters & Table Wrapper */}
      <div className="bg-card border border-border-custom rounded-3xl p-5 shadow-xl space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search user or cart ID..."
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

        {/* Loading / Table / Empty State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-secondary gap-3">
            <Loader2 className="animate-spin text-active" size={32} />
            <p className="text-sm">Loading carts data...</p>
          </div>
        ) : filteredCarts.length === 0 ? (
          <div className="text-center py-12 text-secondary text-sm">
            No carts found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-secondary">
              <thead className="bg-input/50 text-xs uppercase tracking-wider text-secondary border-b border-border-custom">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Cart ID</th>
                  <th className="py-3.5 px-4 font-semibold">User</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Price</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Last Active</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom">
                {filteredCarts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-input/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-primary">{cart.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-active/20 text-active font-bold flex items-center justify-center text-xs">
                          {cart.user?.avatar || cart.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-primary font-medium text-xs sm:text-sm">{cart.user?.name}</p>
                          <p className="text-secondary text-[11px]">{cart.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-primary">{cart.itemsCount || cart.items?.length || 0} items</td>
                    <td className="py-4 px-4 font-bold text-primary">${cart.totalPrice?.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-xl text-[11px] font-semibold inline-block ${
                        cart.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        cart.status === 'Abandoned' ? 'bg-warning/10 text-warning border border-warning/20' :
                        'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {cart.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs">{cart.lastUpdated}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cart.status === 'Abandoned' && (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cart Details Modal */}
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
              <h3 className="text-lg font-bold text-primary">Cart Details ({selectedCart.id})</h3>
              <p className="text-xs text-secondary">Belongs to: {selectedCart.user?.name}</p>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedCart.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-input rounded-2xl border border-border-custom text-xs">
                  <div>
                    <p className="font-semibold text-primary">{item.name}</p>
                    <p className="text-secondary">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border-custom pt-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-secondary">Total Value:</span>
              <span className="text-lg font-bold text-primary">${selectedCart.totalPrice?.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => setSelectedCart(null)}
              className="w-full bg-active hover:bg-active-hover text-primary font-semibold py-3 rounded-2xl text-sm transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Carts;