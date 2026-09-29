"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Cycles through `items` with a vertical swap. Respects reduced motion via the
// app-level <MotionConfig reducedMotion="user">.
export function RotatingText({
  prefix,
  items,
  interval = 2200,
}: {
  prefix?: string;
  items: string[];
  interval?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <span className="inline-flex items-baseline justify-center gap-2">
      {prefix && <span>{prefix}</span>}
      <span className="relative inline-block overflow-hidden text-accent">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={items[i]}
            initial={{ y: "0.7em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-0.7em", opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-block"
          >
            {items[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
