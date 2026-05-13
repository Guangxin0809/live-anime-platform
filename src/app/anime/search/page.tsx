import { Suspense } from "react";
import { SearchPageContent } from "./SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="py-24 text-center text-zinc-400">加载中...</div></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
