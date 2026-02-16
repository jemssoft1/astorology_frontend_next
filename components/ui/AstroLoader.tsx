"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun } from "lucide-react";

export default function AstroLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer rotating ring of stars */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-orange-200"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-dotted border-orange-300 opacity-50"
        />

        {/* Orbiting Planet 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="w-3 h-3 bg-orange-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
        </motion.div>

        {/* Orbiting Planet 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4"
        >
          <div className="w-2 h-2 bg-yellow-400 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
        </motion.div>

        {/* Center Sun/Star pulsating */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 text-orange-500"
        >
          <Sun size={32} strokeWidth={1.5} />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="mt-6 text-sm font-medium text-orange-600 tracking-wider uppercase"
      >
        Aligning Stars...
      </motion.p>
    </div>
  );
}
