import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Search, Bell, X } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SpinnerCustom } from "@/components/common/spinner-custom";

interface SearchResult {
  title: string;
  href: string;
}
export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // 正在搜索
  const [isSearching, setIsSearching] = useState(false);
  // 搜索框值
  const [searchValue, setSearchValue] = useState("");
  // 搜索结果
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // 最近搜索项
  const [recentSearches] = useState<SearchResult[]>([
    { title: "JavaScript 必备知识", href: "/docs/primitives/alert-dialog" },
    { title: "React 框架", href: "/docs/primitives/hover-card" },
    { title: "Java 必备知识", href: "/docs/primitives/progress" },
    { title: "Spring Boot 框架", href: "/docs/primitives/scroll-area" },
    { title: "MySQL 数据库", href: "/docs/primitives/tabs" },
    { title: "Redis 数据库", href: "/docs/primitives/tooltip" },
  ]);
  // 搜索函数
  const handleSearch = () => {
    setIsSearching(true);
    if (searchValue.trim()) {
      setTimeout(() => {
        setSearchResults([
          { title: "搜索结果1" + searchValue, href: "/search/1" },
          { title: "搜索结果2" + searchValue, href: "/search/2" },
        ]);
        setIsSearching(false);
      }, 200);
    } else {
      setSearchResults([...recentSearches]);
      setIsSearching(false);
    }
  };
  // 当搜索框值改变时，调用搜索函数,更新搜索结果
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2 [&>button]:hidden top-18 translate-y-0">
        <DialogHeader className="flex-row items-center border-b">
          <DialogTitle className="hidden">搜索文档</DialogTitle>
          {isSearching ? <SpinnerCustom /> : <Search />}
          <Input
            className="border-0 focus-visible:ring-0 shadow-none"
            placeholder="输入关键字搜索文档..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Kbd>ESC</Kbd>
        </DialogHeader>
        <div className="text-sm border-b py-3">最近搜索</div>
        <div className="max-h-96 overflow-auto">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((item, index) => (
              <Item
                key={item.href}
                variant={index % 2 === 1 ? "default" : "muted"}
                className="cursor-pointer hover:bg-muted"
              >
                <ItemContent>
                  <ItemTitle>{item.title}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <X className="w-5 h-5 text-ring cursor-pointer hover:text-foreground" />
                </ItemActions>
              </Item>
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell />
                </EmptyMedia>
                <EmptyDescription>暂无最近搜索</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
