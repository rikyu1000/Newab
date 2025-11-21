"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

interface CalendarAuthProps {
  onSuccess: (tokenResponse: any) => void;
}

export default function CalendarAuth({ onSuccess }: CalendarAuthProps) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccess(tokenResponse),
    scope: "https://www.googleapis.com/auth/calendar.events.readonly",
  });

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => login()}
      className="px-6 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors text-sm tracking-wider uppercase backdrop-blur-sm"
    >
      Connect Calendar
    </motion.button>
  );
}
