"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface NextEventProps {
  events: CalendarEvent[];
}

export default function NextEvent({ events }: NextEventProps) {
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateNextEvent = () => {
      const now = new Date();

      // Filter for future events
      const futureEvents = events
        .filter((event) => {
          if (!event.start.dateTime) return false; // Skip all-day events
          const start = new Date(event.start.dateTime);
          return start > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.start.dateTime!);
          const dateB = new Date(b.start.dateTime!);
          return dateA.getTime() - dateB.getTime();
        });

      if (futureEvents.length > 0) {
        const next = futureEvents[0];
        setNextEvent(next);

        const start = new Date(next.start.dateTime!);
        const diff = start.getTime() - now.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          setTimeLeft(`${hours} hr ${minutes} min`);
        } else {
          setTimeLeft(`${minutes} min`);
        }
      } else {
        setNextEvent(null);
        setTimeLeft("");
      }
    };

    updateNextEvent();
    const timer = setInterval(updateNextEvent, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [events]);

  if (!nextEvent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center mb-8"
      >
        <div className="text-zinc-500 text-sm font-medium tracking-wider uppercase mb-2">
          Next Event
        </div>
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400 text-center max-w-2xl truncate px-4">
          {nextEvent.summary}
        </div>
        <div className="text-cyan-400 text-xl font-mono mt-2">
          in {timeLeft}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
