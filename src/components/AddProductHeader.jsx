import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackagePlus, Sparkles } from 'lucide-react';

const AddProductHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-card border border-border-custom rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-6">
      {/* Glow Effect Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-active/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-input hover:bg-disabled/50 border border-border-custom text-primary rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to products</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Title & Description */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-active md:ml-14 ">
              CREATE PRODUCT
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-active-bg text-active rounded-xl shrink-0 border border-border-custom">
              <PackagePlus size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
              Launch a polished product entry
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-secondary leading-relaxed pt-1">
            Add products with validation, image previews, multi-upload support, and smooth UX.
          </p>
        </div>

        {/* Right Side: Animated Badge (Bouncing) */}
        <div className="hidden lg:flex items-center gap-3 bg-input/60 border border-border-custom p-3.5 rounded-2xl shrink-0">
          <div className="p-2 bg-active/10 text-active rounded-xl animate-bounce">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-active block">
              READY TO LAUNCH
            </span>
            <p className="text-xs text-primary font-medium">
              Create & save seamlessly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductHeader;