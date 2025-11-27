"use client";

import { useState, useEffect } from "react";
import Timeline from "./Timeline";
import CalendarAuth from "./CalendarAuth";
import NextEvent from "./NextEvent";

export default function Calendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");

      if (response.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      if (data.items) {
        setEvents(data.items);
      } else {
        setEvents([]);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-32 animate-pulse bg-zinc-900/20 rounded-lg mt-auto" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full flex justify-center pb-12 mt-auto">
        <CalendarAuth />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col mt-auto relative group">
      <NextEvent events={events} />
      <div className="w-full h-32">
        <Timeline events={events} />
      </div>
      <a
        href="/api/auth/logout"
        className="absolute -top-8 right-0 text-xs text-zinc-700 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        Disconnect
      </a>
    </div>
  );
}
