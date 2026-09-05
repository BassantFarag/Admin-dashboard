const StatCard = ({ title, value, icon }) => {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-border-custom bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-secondary">{title}</p>
            <p className="text-3xl font-bold text-primary">{value}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-active text-white">
            {icon}
        </div>
        </div>
    );
};

export default StatCard;
