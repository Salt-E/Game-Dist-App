// app/library/page.tsx
import { LibraryGameCard } from "@/components/LibraryGameCard";

export default function LibraryPage() {
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>
      <div className="grid gap-4">
        {/* Library game cards will be rendered here */}
      </div>
    </div>
  );
}