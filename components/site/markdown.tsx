/**
 * Minimal, dependency-free markdown renderer for blog bodies stored in
 * Airtable long-text fields. Supports: headings, bold/italic, links, inline
 * code, unordered/ordered lists, blockquotes, and paragraphs. Input is escaped
 * first, so no raw HTML from the CMS is ever injected.
 *
 * Airtable long-text authors typically don't type markdown syntax and often
 * paste one huge wall of text with no paragraph breaks. We therefore:
 *  1. Treat single newlines as soft breaks between paragraphs (Airtable's Enter).
 *  2. As a last resort, break any paragraph longer than ~500 chars on sentence
 *     boundaries so the article doesn't render as an unreadable slab.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  let t = escapeHtml(text);
  // links [text](url)
  t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">$1</a>'
  );
  // bold **text**
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic *text*
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // inline code `code`
  t = t.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-secondary px-1.5 py-0.5 text-sm">$1</code>'
  );
  return t;
}

/**
 * Break an overly long paragraph into smaller ones on sentence boundaries.
 * Only kicks in when the paragraph is >~500 chars, which is a strong signal
 * the author didn't insert any breaks. Groups ~2-3 sentences per paragraph
 * (target ~350 chars) so the flow still feels like prose, not choppy bullets.
 */
function splitLongParagraph(text: string): string[] {
  const LONG = 500;
  const TARGET = 350;
  if (text.length <= LONG) return [text];

  // Match sentences ending with . ! or ? followed by whitespace + capital,
  // or the end of the string. Keeps trailing punctuation with the sentence.
  const sentences = text.match(/[^.!?]+[.!?]+(?:["')\]]+)?(?:\s+|$)/g);
  if (!sentences || sentences.length < 2) return [text];

  const paragraphs: string[] = [];
  let buf = "";
  for (const s of sentences) {
    if (buf && buf.length + s.length > TARGET) {
      paragraphs.push(buf.trim());
      buf = s;
    } else {
      buf += s;
    }
  }
  if (buf.trim()) paragraphs.push(buf.trim());
  return paragraphs;
}

function render(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      const joined = para.join(" ");
      for (const chunk of splitLongParagraph(joined)) {
        html.push(`<p>${inline(chunk)}</p>`);
      }
      para = [];
    }
  };
  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushPara();
      closeList();
      continue;
    }

    // Treat every non-empty line as its own paragraph. Airtable long-text
    // authors press Enter to separate ideas, but that only produces a single
    // "\n" (not the blank-line "\n\n" markdown expects). If we didn't do this,
    // the whole article would render as one giant <p>.
    if (!listType && para.length > 0) {
      flushPara();
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushPara();
      closeList();
      const level = heading[1].length;
      const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg"];
      html.push(
        `<h${level} class="mt-8 mb-3 font-display font-semibold ${sizes[level - 1]}">${inline(
          heading[2]
        )}</h${level}>`
      );
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushPara();
      closeList();
      html.push(
        `<blockquote class="my-4 border-l-2 border-primary pl-4 italic text-muted-foreground">${inline(
          trimmed.replace(/^>\s?/, "")
        )}</blockquote>`
      );
      continue;
    }

    const ol = /^\d+\.\s+(.*)$/.exec(trimmed);
    const ul = /^[-*]\s+(.*)$/.exec(trimmed);
    if (ol || ul) {
      flushPara();
      const want = ol ? "ol" : "ul";
      if (listType !== want) {
        closeList();
        listType = want;
        html.push(
          `<${want} class="my-4 ml-5 list-${ol ? "decimal" : "disc"} space-y-1">`
        );
      }
      html.push(`<li>${inline((ol ?? ul)![1])}</li>`);
      continue;
    }

    closeList();
    para.push(trimmed);
  }
  flushPara();
  closeList();
  return html.join("\n");
}

export function Markdown({
  content,
  dropCap = true,
}: {
  content: string;
  /** Decorative large first letter on the opening paragraph. Off for legal pages. */
  dropCap?: boolean;
}) {
  return (
    <div
      className={[
        "prose-article",
        // Base sizing + color
        "text-[1.0625rem] leading-[1.75] text-foreground/90",
        // Paragraph rhythm
        "[&>p]:my-5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
        // Drop cap on first paragraph — bold visual anchor at the top of the piece
        ...(dropCap
          ? [
              "[&>p:first-of-type::first-letter]:float-left",
              "[&>p:first-of-type::first-letter]:mr-2 [&>p:first-of-type::first-letter]:mt-1",
              "[&>p:first-of-type::first-letter]:font-display [&>p:first-of-type::first-letter]:font-bold",
              "[&>p:first-of-type::first-letter]:text-[3.5rem] [&>p:first-of-type::first-letter]:leading-[0.9]",
              "[&>p:first-of-type::first-letter]:text-primary",
            ]
          : []),
        // Headings
        "[&_h1]:mt-10 [&_h2]:mt-10 [&_h3]:mt-8 [&_h4]:mt-6",
        // Links: readable in-flow underline
        "[&_a]:break-words [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
        // Lists: comfortable spacing
        "[&_ul]:my-5 [&_ol]:my-5 [&_li]:my-1.5",
        // Blockquotes
        "[&_blockquote]:my-6",
        // Emphasis in-flow
        "[&_strong]:font-semibold [&_strong]:text-foreground",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: render(content) }}
    />
  );
}
