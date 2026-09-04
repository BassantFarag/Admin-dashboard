const Button = ({
    children,
    leftIcon,
    rightIcon,
    type = "button",
    className = "",
    ...props
    }) => {

    return (
        <button
        type={type}
        className={`
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
        {leftIcon}
        {children}
        {rightIcon}
        </button>
    );
};

export default Button;