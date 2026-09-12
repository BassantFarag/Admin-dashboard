import { ClipboardList } from "lucide-react";
import PageHeroHeader from "./ui/PageHeroHeader";

function HeaderTable({ orders }) {
  const totalOrders = orders.length || 0;

  return (
    <PageHeroHeader
      icon={<ClipboardList className="h-5 w-5" />}
      eyebrow="Admin · Management"
      title="Orders"
      subtitle="Track, filter, and update every order coming through your storefront."
      rightSlot={
        <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-card px-4 py-2.5">
          <span className="text-2xl font-bold tabular-nums text-primary">
            {totalOrders}
          </span>
          <span className="text-xs text-secondary">total orders</span>
        </div>
      }
    />
  );
}

export default HeaderTable;
