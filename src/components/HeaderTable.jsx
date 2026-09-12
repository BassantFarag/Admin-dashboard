
function HeaderTable({ orders }) {
    const totalOrders=orders.length|| 0;
  return (
   
   <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Admin · Management</p>
        <h1 className="text-2xl font-bold text-primary ">Orders</h1>
    </div>
    <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-card px-4 py-2.5">
        <span className="text-2xl font-bold tabular-nums text-primary">
            {totalOrders}
        </span>
        <span className="text-xs text-secondary">total orders</span>
         </div>
   </div>
   
  );
}

export default HeaderTable;
