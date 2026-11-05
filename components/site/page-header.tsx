import Image from "next/image";
import { GoldDust } from "./gold-dust";

/** Banner art in public/img/banner-<name>.webp (2200x943, subject on the right). */
export type Banner =
  | "about"
  | "artists"
  | "music"
  | "events"
  | "services"
  | "blog"
  | "contact"
  | "submit";

/**
 * Cinematic interior-page banner. The art sits on the right and fades into
 * the page with a mask (globals.css `.banner-img`), so the headline sits on
 * the dark left half. On phones the art is a strip above the text.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  banner,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  banner: Banner;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative aspect-[21/9] w-full md:absolute md:inset-0 md:aspect-auto">
        <Image
          src={`/img/banner-${banner}.webp`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="banner-img object-cover object-[70%_center] md:object-right"
        />
      </div>
      <GoldDust count={16} />
      <div className="container relative z-10 -mt-6 pb-12 md:mt-0 md:flex md:min-h-[440px] md:items-center md:py-20 lg:min-h-[500px]">
        <div className="reveal max-w-xl lg:max-w-2xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-metal text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
      <div className="rule-gold absolute inset-x-0 bottom-0" aria-hidden />
    </div>
  );
}
