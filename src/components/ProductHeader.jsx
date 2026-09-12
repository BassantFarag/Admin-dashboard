import PageHeroHeader from "./ui/PageHeroHeader";
import { Box } from "lucide-react";

export default function ProductHeader({ isActive, handleBack }) {
  return (
    <PageHeroHeader
      icon={<Box className="h-5 w-5" />}
      eyebrow="Edit product"
      title="Update and refine the product entry"
      subtitle="Review the current product data, add new images, remove existing ones, and save your updates safely."
      backTo="/products"
      backLabel="Back to products"
      rightSlot={
        <div className="w-full rounded-xl border border-border-custom bg-card p-3 shadow-sm lg:w-60">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isActive ? "animate-pulse bg-success" : "bg-active"
              }`}
            />
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isActive ? "text-success" : "text-secondary"
              }`}
            >
              {isActive ? "Live" : "Inactive"}
            </span>
          </div>

          <p className="text-xs leading-snug text-secondary">
            Connected to the real product update API.
          </p>
        </div>
      }
    />
  );
}
