import { Search } from "lucide-react";
import { KbdGroup, Kbd } from "@/components/ui/kbd";

export default function SearchToggle() {
  return (
    <div className="flex items-center border border-input rounded-md px-2 py-2 text-sm text-ring cursor-pointer">
      <Search className="h-4 w-4" />
      <p className="mx-3">快速搜索文档...</p>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  );
}
