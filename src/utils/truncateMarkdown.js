export function truncateMarkdown(md, maxLength = 200) {
  if (!md) return "";

  if (md.length <= maxLength) return md;

  // Simple truncate at maxLength, add "..."
  return md.slice(0, maxLength) + "...";
}
