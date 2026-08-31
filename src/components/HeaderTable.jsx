
function HeaderTable({ orders }) {
  return (
   
   <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Admin · Management</p>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white ">Orders</h1>
    </div>
    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {orders?.total ?? 0}
        </span>
        <span className="text-xs text-slate-400">total orders</span>
         </div>
   </div>
   
  );
}

export default HeaderTable;
