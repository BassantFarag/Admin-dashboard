import { PackagePlus, Sparkles } from 'lucide-react';
import PageHeroHeader from './ui/PageHeroHeader';

const AddProductHeader = () => {
  return (
    <PageHeroHeader
      icon={<PackagePlus className="h-5 w-5" />}
      eyebrow="Create product"
      title="Launch a polished product entry"
      subtitle="Add products with validation, image previews, multi-upload support, and smooth UX."
      backTo="/products"
      backLabel="Back to products"
      rightSlot={
        <div className="hidden items-center gap-3 rounded-2xl border border-border-custom bg-input/60 p-3.5 lg:flex">
          <div className="animate-bounce rounded-xl bg-active/10 p-2 text-active">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-active">
              Ready to launch
            </span>
            <p className="text-xs font-medium text-primary">
              Create & save seamlessly
            </p>
          </div>
        </div>
      }
    />
  );
};

export default AddProductHeader;
