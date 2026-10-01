import { SectionId } from "@/lib/content";

// Every section is a full-height, scroll-snapping panel. Container spans ~80% width.
export function Section({ id, children }: { id: SectionId; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="relative z-10 flex min-h-screen w-full snap-start items-center justify-center py-16"
      style={{ pointerEvents: "none" }}
    >
      <div className="mx-auto w-[80%] max-w-[1400px]" style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </section>
  );
}
