function OrdersFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  cardFilter,
  setCardFilter,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="relative flex-1 min-w-[280px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search ID, customer..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700"
          >
            <option value="all">All statuses</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700"
          >
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={cardFilter}
            onChange={(e) => setCardFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700"
          >
            <option value="all">All methods</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>

        </div>
      </div>
    </div>
  );
}

export default OrdersFilters;
