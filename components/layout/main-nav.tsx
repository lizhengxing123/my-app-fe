"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { getMenuTree } from "@/services/docMenuService";
import { DocMenu } from "@/types/DocMenu";

// 首页
const home: DocMenu = {
  id: "home",
  name: "首页",
  href: "/",
  icon: "",
  description: "",
  level: 1,
  docId: "0",
  sortNum: 0,
  children: [],
};

export default function MainNav() {
  const [menus, setMenus] = React.useState<DocMenu[]>([]);

  const getNavMenus = async () => {
    const res = await getMenuTree(1, 2, "");
    if (res.success) {
      return res.data;
    }
    return [];
  };

  React.useEffect(() => {
    getNavMenus().then((res) => {
      setMenus([home, ...res]);
    });
  }, []);

  return (
    // 需要使用viewport={false}，否则会导致导航菜单不能对齐
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="flex-wrap gap-4">
        {menus.map((menu) => (
          <NavigationMenuItem key={menu.id}>
            {menu.children.length > 0 ? (
              <>
                <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className={menu.children.length >= 4 ? "grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]" : "grid w-[300px] gap-4"}>
                    {menu.children.map((component) => (
                      <ListItem
                        key={component.id}
                        title={component.name}
                        href={menu.href + "?categoryId=" + menu.id}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={menu.href}>{menu.name}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
