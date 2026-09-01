function StatusBadge({ status = "pending" }) {
  const normalizedStatus = status?.toLowerCase() || "pending";
  const statusStyles = {
    delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    shipped: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    processing: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    confirmed: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 capitalize transition-colors ${
        statusStyles[normalizedStatus] || "bg-secondary/10 text-secondary border-secondary/20"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {normalizedStatus}
    </span>
  );
}

export default StatusBadge;
