"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15%" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
