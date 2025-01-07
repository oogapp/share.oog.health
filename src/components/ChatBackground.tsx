'use client'
import { motion } from "motion/react";

export const ChatBackground = () => (
    <motion.div
        className="z-0 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <img src="/gradient.png" className='w-full h-full object-cover' />
    </motion.div>
);
