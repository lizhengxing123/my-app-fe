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
import { chartMenus as menus } from "@/assets/sidebar-menus/chart-menus";
import { usePathname } from "next/navigation"; // 导入usePathname钩子

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 获取当前路径
  const firstMenu = {
    title: "所有图表",
    herf: "/chart",
  };
  
  // 判断路径是否匹配的辅助函数
  const isPathActive = (path: string) => {
    // 完全匹配或子路径匹配（例如：/chart 匹配 /chart 和 /chart/subpath）
    return pathname === path
  };
  
  return (
    <div className="flex w-full h-full">
      <div className="w-72 h-full overflow-y-auto overflow-x-hidden">
        <SidebarProvider
          style={{
            "--sidebar-width": "18rem",
            "--sidebar-width-mobile": "20rem",
          }}
        >
          <Sidebar className="static">
            <SidebarContent className="bg-background">
              <SidebarMenu className="pl-2 pt-4">
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={isPathActive(firstMenu.herf)} asChild>
                    <a href={firstMenu.herf} className="py-0">
                      <LayoutDashboard />
                      <span>{firstMenu.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {Object.entries(menus).map(([group, items]) => (
                <SidebarGroup key={group}>
                  <SidebarGroupLabel>{group}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item) => (
                        <SidebarMenuItem key={item.herf}>
                          <SidebarMenuButton isActive={isPathActive(item.herf)} asChild>
                            <a href={item.herf}>
                              <item.icon />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                          {item.items && (
                            <SidebarMenuBadge>
                              <Badge>{item.items.length}</Badge>
                            </SidebarMenuBadge>
                          )}
                          {item.items && (
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.herf}>
                                  <SidebarMenuSubButton asChild>
                                    <a href={subItem.herf}>
                                      <span>{subItem.title}</span>
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
      <div className="flex-1">{children}</div>
    </div>
  );
}