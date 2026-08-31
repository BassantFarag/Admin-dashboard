import { motion } from "motion/react";

const Loading = () => {
    return (
        <main className="relative min-h-screen overflow-hidden bg-bg-main flex items-center justify-center">

            {/* Background Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-150 h-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-active/5 blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Moving Background Light */}
            <motion.div
                className="absolute -top-40 -left-40 w-100 h-100 rounded-full bg-active/5 blur-3xl"
                animate={{
                    x: [0, 180, 80, 0],
                    y: [0, 100, 200, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute -bottom-40 -right-40 w-100 h-100 rounded-full bg-active/5 blur-3xl"
                animate={{
                    x: [0, -180, -80, 0],
                    y: [0, -100, -200, 0],
                    scale: [1, 0.9, 1.2, 1],
                }}
                transition={{
                    duration: 17,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Decorative Lines */}
            <motion.div
                className="absolute top-1/4 left-0 w-1/4 h-px bg-active/10"
                animate={{
                    scaleX: [0.5, 1, 0.5],
                    opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-1/4 right-0 w-1/4 h-px bg-active/10"
                animate={{
                    scaleX: [0.5, 1, 0.5],
                    opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center">

                {/* Top Line */}
                <motion.div
                    className="relative w-36 h-px bg-border-custom overflow-hidden mb-8"
                >
                    <motion.div
                        className="absolute inset-y-0 left-0 w-1/3 bg-active"
                        animate={{
                            x: ["-100%", "400%"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>

                {/* Loader */}
                <div className="relative w-32 h-32 flex items-center justify-center">

                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-border-custom"
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Rotating Ring */}
                    <motion.div
                        className="absolute inset-1 rounded-full border-4 border-transparent border-t-active border-r-active"
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Glow */}
                    <motion.div
                        className="absolute w-20 h-20 rounded-full bg-active/20 blur-xl"
                        animate={{
                            scale: [0.8, 1.3, 0.8],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Core */}
                    <motion.div
                        className="relative w-12 h-12 rounded-full bg-active"
                        animate={{
                            scale: [1, 1.12, 1],
                            boxShadow: [
                                "0 0 0px transparent",
                                "0 0 30px var(--color-brand-active)",
                                "0 0 0px transparent",
                            ],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Orbiting Light */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <span className="absolute -top-1 left-1/2 w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-active shadow-[0_0_12px_var(--color-brand-active)]" />
                    </motion.div>
                </div>

                {/* Title */}
                <div className="relative mt-8 overflow-hidden">

                    <motion.h1
                        className="text-3xl font-bold tracking-[0.25em] text-border-custom"
                    >
                        LOADING DATA
                    </motion.h1>

                    {/* Gold Shimmer */}
                    <motion.div
                        className="absolute inset-y-0 left-0 overflow-hidden"
                        animate={{
                            width: ["0%", "100%", "0%"],
                        }}
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <h1 className="text-3xl font-bold tracking-[0.25em] text-active whitespace-nowrap">
                            LOADING DATA
                        </h1>
                    </motion.div>

                </div>

                {/* Description */}
                <motion.p
                    className="mt-3 text-sm text-secondary"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    Fetching data, please wait...
                </motion.p>

                {/* Loading Dots */}
                <div className="flex items-center gap-2 mt-6">
                    {[0, 1, 2].map((dot) => (
                        <motion.span
                            key={dot}
                            className="w-2 h-2 rounded-full bg-active"
                            animate={{
                                y: [0, -6, 0],
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.25, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: dot * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Bottom Line */}
                <motion.div
                    className="relative w-36 h-px bg-border-custom overflow-hidden mt-8"
                >
                    <motion.div
                        className="absolute inset-y-0 left-0 w-1/3 bg-active"
                        animate={{
                            x: ["-100%", "400%"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    />
                </motion.div>

            </div>
        </main>
    );
};

export default Loading;
