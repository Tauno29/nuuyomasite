export default function RichText({ text, className = "" }: { text?: string | null; className?: string }) {
  if (!text) return null;
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim());
  return (
    <div className={`prose-nsss ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.every((l) => /^[-•*]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{line.replace(/^[-•*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        if (lines.length === 1) return <p key={i}>{lines[0]}</p>;
        return (
          <div key={i}>
            {lines.map((line, j) => {
              if (line.startsWith("## ")) return <h2 key={j}>{line.slice(3)}</h2>;
              if (line.startsWith("### ")) return <h3 key={j}>{line.slice(4)}</h3>;
              if (/^[-•*]\s+/.test(line)) {
                return (
                  <ul key={j}>
                    <li>{line.replace(/^[-•*]\s+/, "")}</li>
                  </ul>
                );
              }
              return <p key={j}>{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}
