"use client";

import { Badge } from "@/components/ui/badge";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import { chartMenuIconMap } from "@/assets/sidebar-menus/chart-menus";
import { usePathname, useSearchParams } from "next/navigation"; // 导入usePathname钩子
import { useEffect, useState } from "react";
import { DocMenu } from "@/types/DocMenu";
import { getMenuTree } from "@/services/docMenuService";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 获取当前路径
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";

  const [menus, setMenus] = useState<DocMenu[]>([]);

  const getNavMenus = async () => {
    if (!categoryId) {
      toast.warning("没有分类ID，无法获取菜单！");
      return [];
    }
    const res = await getMenuTree(2, 4, categoryId);
    if (res.success) {
      // 处理图标
      res.data.forEach((item) => {
        if (item.children.length > 0) {
          item.children.forEach((i) => {
            // @ts-ignore
            i.icon = chartMenuIconMap[i.icon];
          });
        }
      });
      console.log(res.data);
      return res.data;
    }
    return [];
  };

  const firstMenu = {
    title: "所有图表",
    href: "/chart",
  };

  useEffect(() => {
    getNavMenus().then((res) => {
      setMenus([...res]);
    });
  }, []);

  // 判断路径是否匹配的辅助函数
  const isPathActive = (path: string) => {
    // 完全匹配或子路径匹配（例如：/chart 匹配 /chart 和 /chart/subpath）
    return pathname === path;
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-72 h-full fixed top-16">
        <SidebarProvider
          style={{
            // @ts-ignore
            "--sidebar-width": "18rem",
            "--sidebar-width-mobile": "20rem",
          }}
        >
          <Sidebar className="static">
            <SidebarContent className="bg-background">
              <SidebarMenu className="pl-2 pt-4">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isPathActive(firstMenu.href)}
                    asChild
                  >
                    <a href={firstMenu.href} className="py-0">
                      <LayoutDashboard />
                      <span>{firstMenu.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {menus.length > 0 &&
                menus.map((menu) => (
                  <SidebarGroup key={menu.id}>
                    <SidebarGroupLabel>{menu.name}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {menu.children.map((item) => (
                          <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton
                              isActive={isPathActive(item.href)}
                              asChild
                            >
                              <a
                                href={
                                  item.href +
                                  `?categoryId=${categoryId}&docId=${item.docId}`
                                }
                              >
                                {/* @ts-ignore */}
                                <item.icon />
                                <span>{item.name}</span>
                              </a>
                            </SidebarMenuButton>
                            {item.children.length > 0 && (
                              <SidebarMenuBadge>
                                <Badge>{item.children.length}</Badge>
                              </SidebarMenuBadge>
                            )}
                            {item.children.length > 0 && (
                              <SidebarMenuSub>
                                {item.children.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.id}>
                                    <SidebarMenuSubButton asChild>
                                      <a
                                        href={
                                          subItem.href +
                                          `?categoryId=${categoryId}&docId=${subItem.docId}`
                                        }
                                      >
                                        <span>{subItem.name}</span>
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
      <div className="flex-1 pl-72">{children}</div>
    </div>
  );
}
