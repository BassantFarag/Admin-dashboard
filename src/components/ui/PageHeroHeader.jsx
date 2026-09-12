import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const PageHeroHeader = ({
  icon,
  eyebrow,
  title,
  subtitle,
  backTo,
  backLabel = "Back",
  rightSlot,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-custom bg-card px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:px-6 sm:py-5">
      {/* Decorative curved shape (a real crescent, not a soft color blend) */}
      <svg
        className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 sm:-right-8 sm:-top-20 sm:h-72 sm:w-72"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-hover)" />
            <stop offset="100%" stopColor="var(--color-brand-active)" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#heroCurveGrad)" />
        <circle cx="55" cy="60" r="82" fill="var(--color-card-bg)" />
      </svg>

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          {backTo && (
            <Link
              to={backTo}
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-border-custom bg-input px-3 py-1.5 text-xs font-medium text-secondary transition hover:border-active/40 hover:text-active"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              {backLabel}
            </Link>
          )}

          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-active)] to-[var(--color-brand-hover)] text-bg-main shadow-[0_6px_20px_-4px_color-mix(in_srgb,var(--color-brand-active)_65%,transparent)] sm:h-14 sm:w-14">
                {icon}
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-active sm:text-[11px]">
                {eyebrow}
              </p>
              <h1 className="mt-0.5 text-xl font-extrabold tracking-tight text-primary sm:text-2xl lg:text-3xl">
                {title}
              </h1>
            </div>
          </div>

          {subtitle && (
            <p className="max-w-2xl text-xs leading-5 text-secondary sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {rightSlot && <div className="relative w-full shrink-0 lg:w-auto">{rightSlot}</div>}
      </div>
    </div>
  );
};

export default PageHeroHeader;