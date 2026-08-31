function StatusBadge({ status = "pending" }) {
  const normalizedStatus = status?.toLowerCase() || "pending";
  const statusStyles = {
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    shipped: "bg-cyan-50 text-cyan-600 border-cyan-200",
    processing: "bg-purple-50 text-purple-600 border-purple-200",
    cancelled: "bg-rose-50 text-rose-600 border-rose-200",
    confirmed: "bg-sky-50 text-sky-600 border-sky-200",
    pending: "bg-amber-50 text-amber-600 border-amber-200",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 capitalize transition-colors ${
        statusStyles[normalizedStatus] || "bg-secondary/10 text-secondary border-secondary/20"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
}

export default StatusBadge;
