/**
 * Ambient rising gold particles (pure CSS, see `.dust` in globals.css).
 * Positions are deterministic so server and client markup match.
 */
export function GoldDust({ count = 22 }: { count?: number }) {
  return (
    <div className="dust" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37) % 100;
        const duration = 9 + ((i * 7) % 9);
        const delay = -((i * 13) % 17);
        const size = 2 + (i % 3);
        const dx = ((i % 5) - 2) * 18;
        return (
          <i
            key={i}
            style={
              {
                left: `${left}%`,
                width: size,
                height: size,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                "--dx": `${dx}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
