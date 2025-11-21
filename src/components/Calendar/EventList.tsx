"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface EventListProps {
  events: CalendarEvent[];
}

export default function EventList({ events }: EventListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current time (simplified: just scroll to start for now or center)
  useEffect(() => {
    if (scrollRef.current) {
      // Logic to scroll to current time could go here
    }
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="text-zinc-600 text-sm tracking-wider">
        NO EVENTS FOR TODAY
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl overflow-x-auto no-scrollbar p-4"
      ref={scrollRef}
    >
      <div className="flex gap-4 min-w-max">
        {events.map((event, index) => {
          const startTime = event.start.dateTime
            ? new Date(event.start.dateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "All Day";

          const isPast =
            event.end.dateTime && new Date(event.end.dateTime) < new Date();

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isPast ? 0.5 : 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md w-48 ${
                isPast ? "grayscale" : "hover:border-zinc-600/50"
              } transition-colors`}
            >
              <span className="text-xs text-zinc-500 font-mono mb-2 block">
                {startTime}
              </span>
              <span className="text-sm text-zinc-200 font-medium truncate">
                {event.summary}
              </span>
              {/* Decorative line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent opacity-20" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
