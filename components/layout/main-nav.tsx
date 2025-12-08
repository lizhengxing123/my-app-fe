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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "JavaScript",
    href: "/docs/primitives/alert-dialog",
    description: "JavaScript 必备知识，包括原型链、闭包、作用域等。",
  },
  {
    title: "React",
    href: "/docs/primitives/hover-card",
    description: "React 框架，包括基础 API、Fiber 架构等",
  },
  {
    title: "Java",
    href: "/docs/primitives/progress",
    description: "Java 必备知识，包括 JVM、并发编程等。",
  },
  {
    title: "Spring Boot",
    href: "/docs/primitives/scroll-area",
    description: "Spring Boot 框架，包括自动配置、起步依赖等。",
  },
  {
    title: "MySQL",
    href: "/docs/primitives/tabs",
    description: "MySQL 数据库，包括 SQL 语句、索引优化等。",
  },
  {
    title: "Redis",
    href: "/docs/primitives/tooltip",
    description: "Redis 数据库，包括数据结构、过期策略等。",
  },
];
// 首页
const home: DocMenu = {
  id: "home",
  name: "首页",
  href: "/",
  description: "",
  level: 1,
  docId: 0,
  sortNum: 0,
  children: [],
};

export default function MainNav() {
  const [menus, setMenus] = React.useState<DocMenu[]>([]);

  const getNavMenus = async () => {
    const res = await getMenuTree(1, 2);
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
                        href={component.href}
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
