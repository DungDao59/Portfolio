"use client";
import { useEffect, useRef, useState } from "react";
import SplitFlapText from "./SplitFlapText";

// A section-title split-flap board that flips in from blank when scrolled into view.
export function FlapHeading({
  text,
  className = "",
  fontSize = "clamp(22px, 4.5vw, 42px)",
}: {
  text: string;
  className?: string;
  fontSize?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const common = {
    tileColor: "#191531",
    textColor: "#ededed",
    tileRadius: 6,
    gap: 5,
    fontSize,
    padTo: text.length,
    flipDuration: 0.1,
    stagger: 0.04,
    flipsPerChar: 6,
  };

  return (
    <div ref={ref} className={className}>
      {shown ? (
        <SplitFlapText key="go" words={["", text]} loop={false} cycleDelay={350} {...common} />
      ) : (
        <SplitFlapText key="idle" text="" {...common} />
      )}
    </div>
  );
}
