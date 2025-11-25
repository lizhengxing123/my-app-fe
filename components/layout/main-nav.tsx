"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "JavaScript",
    href: "/docs/primitives/alert-dialog",
    description:
      "JavaScript 必备知识，包括原型链、闭包、作用域等。",
  },
  {
    title: "React",
    href: "/docs/primitives/hover-card",
    description:
      "React 框架，包括基础 API、Fiber 架构等",
  },
  {
    title: "Java",
    href: "/docs/primitives/progress",
    description:
      "Java 必备知识，包括 JVM、并发编程等。",
  },
  {
    title: "Spring Boot",
    href: "/docs/primitives/scroll-area",
    description: "Spring Boot 框架，包括自动配置、起步依赖等。",
  },
  {
    title: "MySQL",
    href: "/docs/primitives/tabs",
    description:
      "MySQL 数据库，包括 SQL 语句、索引优化等。",
  },
  {
    title: "Redis",
    href: "/docs/primitives/tooltip",
    description:
      "Redis 数据库，包括数据结构、过期策略等。",
  },
]

export default function MainNav() {

  return (
    // 需要使用viewport={false}，否则会导致导航菜单不能对齐
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="flex-wrap gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">首页</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>文档</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>图表</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/chart">
                    <div className="font-medium">基础图表</div>
                    <div className="text-muted-foreground">
                      使用 Echarts 实现的各种精美图表，包括折线图、柱状图、饼图、散点图等。
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/chart">
                    <div className="font-medium">地图</div>
                    <div className="text-muted-foreground">
                      使用 Echarts 实现的地图图表，包括地图下钻、地图区域图表展示等。
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/chart">
                    <div className="font-medium">其他图表</div>
                    <div className="text-muted-foreground">
                      其他图表，包括大屏表格、数据旋转等。
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>动画</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">Gasp</div>
                    <div className="text-muted-foreground">
                      使用 Gasp 实现的各种炫酷动画特效。
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">
                    <div className="font-medium">CSS 动画</div>
                    <div className="text-muted-foreground">
                      使用 CSS 实现的各种动画特效，包括旋转、缩放、淡入淡出等。
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
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
  )
}
