import { Search } from "lucide-react";
import { KbdGroup, Kbd } from "@/components/ui/kbd";
import { useEffect, useState } from "react";
import SearchDialog from "./search-dialog";
export default function SearchToggle() {

  // 搜索对话框是否打开
  const [open, setOpen] = useState(false);

  // 监听 Ctrl+K 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 监听 Ctrl+K 快捷键
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }

      // 监听 Esc 键关闭对话框
      if (e.key === "Escape") {
        setOpen(false);
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    // 清理事件监听器
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center border border-input rounded-md px-2 py-2 text-sm text-ring cursor-pointer"
      >
        <Search className="h-4 w-4" />
        <p className="mx-3">快速搜索文档...</p>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
