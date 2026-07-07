/**
 * Minimal, dependency-free markdown renderer for blog bodies stored in
 * Airtable long-text fields. Supports: headings, bold/italic, links, inline
 * code, unordered/ordered lists, blockquotes, and paragraphs. Input is escaped
 * first, so no raw HTML from the CMS is ever injected.
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

function render(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      html.push(`<p>${inline(para.join(" "))}</p>`);
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

export function Markdown({ content }: { content: string }) {
  return (
    <div
      className="space-y-4 leading-relaxed text-foreground/90 [&_a]:break-words"
      dangerouslySetInnerHTML={{ __html: render(content) }}
    />
  );
}
