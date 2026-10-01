import { SectionId } from "@/lib/content";

// `fullHeight` = the hero (full viewport, centered, for the dive). Other sections
// flow as normal stacked content. Container spans ~80% of the screen width.
export function Section({
  id,
  children,
  fullHeight = false,
}: {
  id: SectionId;
  children: React.ReactNode;
  fullHeight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 w-full ${
        fullHeight ? "flex min-h-screen items-center justify-center" : "py-24"
      }`}
      style={{ pointerEvents: "none" }}
    >
      <div className="mx-auto w-[80%] max-w-[1400px]" style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </section>
  );
}
