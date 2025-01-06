'use client'
import { motion } from "motion/react";

export const ChatBackground = () => (
    <motion.div
        className="z-0 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
    >
        <svg
            className='w-full h-3/4'
            xmlns="http://www.w3.org/2000/svg"
            width="375"
            height="668"
            fill="none"
            viewBox="0 0 375 668"
        >
            <g filter="url(#filter0_f_0_1)" opacity="0.85">
                <path
                    fill="#008198"
                    d="M687 91c0 164.029-99.081 356.5-291 356.5-230 0-413-178.971-413-343S147.581-206 339.5-206 687-73.029 687 91"
                ></path>
            </g>
            <g filter="url(#filter1_f_0_1)">
                <path
                    fill="#A2E028"
                    d="M540-30.5c0 119.57-34.952 210-167.5 210C203 179.5-23 71.57-23-48s190.452-199 323-199 240 96.93 240 216.5"
                ></path>
            </g>
            <defs>
                <filter
                    id="filter0_f_0_1"
                    width="1144"
                    height="1093.5"
                    x="-237"
                    y="-426"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    ></feBlend>
                    <feGaussianBlur
                        result="effect1_foregroundBlur_0_1"
                        stdDeviation="110"
                    ></feGaussianBlur>
                </filter>
                <filter
                    id="filter1_f_0_1"
                    width="963"
                    height="826.5"
                    x="-223"
                    y="-447"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    ></feBlend>
                    <feGaussianBlur
                        result="effect1_foregroundBlur_0_1"
                        stdDeviation="100"
                    ></feGaussianBlur>
                </filter>
            </defs>
        </svg>
    </motion.div>
);
