const Input = ({
    label,
    leftIcon,
    rightIcon,
    type = "text",
    className = "",
    ...props
    }) => {
    return (
        <div className="flex flex-col gap-2">
        {label && (
            <label className="text-sm font-medium text-primary">
            {label}
            </label>
        )}

        <div className="relative">
            {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                {leftIcon}
            </span>
            )}

            <input
            type={type}
            className={`
                w-full rounded-xl
                border border-border-custom
                bg-input
                px-4 py-3
                text-sm text-primary
                outline-none
                transition
                placeholder:text-secondary
                focus:border-active
                focus:ring-2 focus:ring-active/10
                disabled:cursor-not-allowed disabled:opacity-50
                ${leftIcon ? "pl-11" : ""}
                ${rightIcon ? "pr-11" : ""}
                ${className}
            `}
            {...props}
            />

            {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                {rightIcon}
            </span>
            )}
        </div>
        </div>
    );
};

export default Input;