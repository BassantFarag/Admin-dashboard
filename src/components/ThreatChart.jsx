import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity, ShieldAlert } from "lucide-react";

export const ThreatChart = () => {
  const data = [
    { name: "Week 1", threats: 120, secured: 240 },
    { name: "Week 2", threats: 180, secured: 310 },
    { name: "Week 3", threats: 150, secured: 290 },
    { name: "Week 4", threats: 210, secured: 380 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-active/25 bg-active-bg text-active">
              <ShieldAlert size={18} />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-active sm:text-xs">
              Analytics & Security
            </p>
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-primary sm:text-2xl">
            Monthly Threat Activity & System Security
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-active/30 bg-active-bg px-3.5 py-2 text-xs font-semibold text-active shadow-sm">
            This Month
          </span>
        </div>
      </div>

   
      <div className="mt-8 h-[380px] w-full">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary sm:text-sm">
            <Activity size={16} className="text-active" /> Performance Flow (Monthly View)
          </p>
          <span className="text-xs text-secondary">Live API Sync</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-active)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-brand-active)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSecured" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-status-success)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-status-success)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-main)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-secondary)" 
              fontSize={13} 
              tickLine={false} 
            />
            <YAxis 
              stroke="var(--color-text-secondary)" 
              fontSize={13} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "var(--color-card-bg)",
                borderColor: "var(--color-border-main)",
                borderRadius: "12px",
                color: "var(--color-text-primary)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
            <Area 
              type="monotone" 
              dataKey="threats" 
              name="Threats Detected" 
              stroke="var(--color-brand-active)" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorThreats)" 
            />
            <Area 
              type="monotone" 
              dataKey="secured" 
              name="Secured Items" 
              stroke="var(--color-status-success)" 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#colorSecured)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ThreatChart;