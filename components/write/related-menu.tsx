"use client";

import { BadgeCheckIcon, BadgeIcon, BoxesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useState } from "react";
import { getMenuTree } from "@/services/docMenuService";
import { DocMenu } from "@/types/DocMenu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Result } from "@/types/Result";

export default function RelatedMenu({
  open,
  onClose,
  publishDoc,
  loadDoc,
  selectedMenu,
  setSelectedMenu,
  btnType = "load"
}: {
  open: boolean;
  onClose: () => void;
  publishDoc?: () => void;
  loadDoc?: () => void;
  selectedMenu: DocMenu | null;
  setSelectedMenu: (menu: DocMenu | null) => void;
  btnType: "load" | "publish"
}) {
  // 获取所有菜单
  const getNavMenus = async () => {
    const res = await getMenuTree(1, 4, "");
    if (res.success) {
      return res.data;
    }
    return [];
  };

  /**
   * 顶部 tab 相关
   */
  const [tabs, setTabs] = useState<DocMenu[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 根据点击的 tab 筛选侧边栏菜单
    const sidebarMenus = tabs.find((tab) => tab.id === value);
    if (sidebarMenus) {
      setSidebarMenus([...sidebarMenus.children]);
      setActiveSidebarMenu(sidebarMenus.children[0].id);
      setSelectMenus([...sidebarMenus.children[0].children]);
      setSelectedMenu(null);
    }
  };

  /**
   * 侧边栏菜单相关
   */
  const [sidebarMenus, setSidebarMenus] = useState<DocMenu[]>([]);
  const [activeSidebarMenu, setActiveSidebarMenu] = useState("");

  // 处理侧边栏菜单点击
  const handleSidebarClick = (e: React.MouseEvent) => {
    // 获取点击的目标元素
    const target = e.target as HTMLElement;
    // 向上查找li元素
    const liElement = target.closest("li");
    if (liElement) {
      // 获取li元素的data-menu-id属性值，即菜单ID
      const menuId = liElement.getAttribute("data-menu-id");
      if (menuId) {
        // 设置当前点击的侧边栏菜单为选中状态
        setActiveSidebarMenu(menuId);
        // 查找对应的菜单对象
        const sidebarMenu = sidebarMenus.find((menu) => menu.id === menuId);
        if (sidebarMenu) {
          // 将选中的菜单添加到selectMenus中
          setSelectMenus([...sidebarMenu.children]);
        }
      }
    }
  };

  /**
   * 能被选择的菜单相关
   */
  const [selectMenus, setSelectMenus] = useState<DocMenu[]>([]);

  // 处理按钮点击
  const handleBtnClick = () => {
    if (btnType === "publish") {
      publishDoc!();
    } else {
      loadDoc!();
    }
  };

  useEffect(() => {
    getNavMenus().then((res) => {
      setTabs([...res.filter((tab) => tab.children.length > 0)]);
      setActiveTab(res[0].id);

      setSidebarMenus([...res[0].children]);
      setActiveSidebarMenu(res[0].children[0].id);
    });
  }, []);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2 [&>button]:hidden top-18 translate-y-0">
        <DialogHeader>
          <DialogTitle className="hidden">文章关联菜单</DialogTitle>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="flex w-full">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-10 flex-1"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </DialogHeader>
        <div className="flex space-x-6 mt-4 mb-6">
          <ul className="w-32 border-r py-2" onClick={handleSidebarClick}>
            {sidebarMenus.map((sidebarMenu) => (
              <li
                key={sidebarMenu.id}
                data-menu-id={sidebarMenu.id}
                className={cn(
                  activeSidebarMenu === sidebarMenu.id
                    ? "text-foreground after:content-[''] after:h-7 after:w-[2px] after:block after:absolute after:top-2 after:right-[-1px] after:bg-foreground"
                    : "text-foreground/50",
                  "relative cursor-pointer text-right px-4 py-3 text-sm hover:bg-ring/10 rounded-md"
                )}
              >
                <span>{sidebarMenu.name}</span>
              </li>
            ))}
          </ul>
          <div className="flex w-full flex-col max-h-[400px] overflow-auto flex-1 pr-6">
            {selectMenus.map((menu) => {
              return (
                <div
                  key={menu.id}
                  className="space-y-2 border-b border-dashed last:border-b-0 py-6 first:pt-0"
                >
                  <GroupMenu
                    menu={menu}
                    isSelected={menu.id === selectedMenu?.id}
                    onClick={setSelectedMenu}
                  />
                  {menu.children.map((child) => (
                    <ItemMenu
                      key={child.id}
                      menu={child}
                      isSelected={child.id === selectedMenu?.id}
                      onClick={setSelectedMenu}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter className="flex items-center sm:justify-between">
          <span className="text-sm text-foreground/80">
            {selectedMenu
              ? "已选择关联菜单：" + selectedMenu.name
              : "请选择关联菜单之后再" + (btnType === "publish" ? "发布" : "加载")}
          </span>
          <div className="flex space-x-4">
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" onClick={handleBtnClick}>
              {btnType === "publish" ? "发布" : "加载"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GroupMenu({
  menu,
  isSelected,
  onClick,
}: {
  menu: DocMenu;
  isSelected: boolean;
  onClick: (menu: DocMenu) => void;
}) {
  return (
    <Item
      variant={menu.children.length === 0 ? "outline" : "muted"}
      key={menu.id}
      className={cn(
        menu.children.length === 0 ? "cursor-pointer" : "",
        isSelected ? "border-foreground" : ""
      )}
      onClick={() => onClick(menu)}
    >
      <ItemMedia variant="icon">
        <BoxesIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{menu.name}</ItemTitle>
        <ItemDescription>{menu.description}</ItemDescription>
      </ItemContent>
      {menu.children.length === 0 && (
        <ItemActions>
          {isSelected ? (
            <BadgeCheckIcon className="size-5" />
          ) : (
            <BadgeIcon className="size-5" />
          )}
        </ItemActions>
      )}
    </Item>
  );
}

function ItemMenu({
  menu,
  isSelected,
  onClick,
}: {
  menu: DocMenu;
  isSelected: boolean;
  onClick: (menu: DocMenu) => void;
}) {
  return (
    <Item variant="outline" size="sm" asChild>
      <span
        onClick={() => onClick(menu)}
        className={cn(isSelected ? "border-foreground" : "", "cursor-pointer")}
      >
        <ItemMedia>
          {isSelected ? (
            <BadgeCheckIcon className="size-5" />
          ) : (
            <BadgeIcon className="size-5" />
          )}
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{menu.name}</ItemTitle>
        </ItemContent>
      </span>
    </Item>
  );
}
