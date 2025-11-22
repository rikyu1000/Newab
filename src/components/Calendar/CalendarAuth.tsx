"use client";

import { motion } from "framer-motion";

export default function CalendarAuth() {
  return (
    <motion.a
      href="/api/auth/login"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors text-sm tracking-wider uppercase backdrop-blur-sm cursor-pointer"
    >
      Connect Calendar
    </motion.a>
  );
}
