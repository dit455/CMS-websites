import type { TransferCategory } from "../types/tis";

const categoryStyles: Record<TransferCategory, string> = {
  A: "bg-cat-a",
  B: "bg-cat-b",
  C: "bg-cat-c",
  D: "bg-cat-d",
  E: "bg-cat-e",
  F: "bg-cat-f",
  G: "bg-cat-g",
  H: "bg-cat-h",
  I: "bg-cat-i",
  J: "bg-cat-j",
  K: "bg-cat-k"
};

export function CategoryPill({ category }: { category: TransferCategory }) {
  return (
    <span className={`inline-flex rounded-badge px-2.5 py-1 text-xs font-black text-white ${categoryStyles[category]}`}>
      Category {category}
    </span>
  );
}
