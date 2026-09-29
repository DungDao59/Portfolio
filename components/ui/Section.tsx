import { SectionId } from "@/lib/content";

export function Section({ id, children }: { id: SectionId; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="relative z-10 flex min-h-screen w-full items-center justify-center px-6"
      style={{ pointerEvents: "none" }}
    >
      <div className="w-full max-w-[var(--maxw)]" style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </section>
  );
}
