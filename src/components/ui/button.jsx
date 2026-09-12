const Button = ({
    children,
    leftIcon,
    rightIcon,
    type = "button",
    className = "",
    ...props
    }) => {

    return (
        <>
            <style>{`
                @keyframes btn-shine-sweep {
                    0% {
                        transform: translateX(-150%) skewX(-25deg);
                    }
                    60%, 100% {
                        transform: translateX(250%) skewX(-25deg);
                    }
                }
                .animate-btn-shine {
                    animation: btn-shine-sweep 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
            <button
            type={type}
            className={`
                relative overflow-hidden
                inline-flex items-center justify-center gap-2
                rounded-2xl px-5 py-3
                font-semibold
                shadow-md
                transition
                active:scale-95
                disabled:cursor-not-allowed disabled:opacity-50
                ${className}
            `}
            {...props}
            >
            <span
                className="pointer-events-none absolute inset-0 -translate-x-full animate-btn-shine bg-gradient-to-r from-transparent via-white/55 to-transparent"
                aria-hidden="true"
            />
            {leftIcon}
            {children}
            {rightIcon}
            </button>
        </>
    );
};

export default Button;