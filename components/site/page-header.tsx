import { FadeUp } from "./motion";

/** Standard interior-page header with title + optional description. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="grain relative overflow-hidden border-b border-border">
      <div className="gradient-wash absolute inset-0 opacity-70" aria-hidden />
      <div className="container relative z-10 py-14 md:py-20">
        <FadeUp>
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </FadeUp>
      </div>
    </div>
  );
}
