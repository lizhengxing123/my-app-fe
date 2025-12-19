"use client";

import React, { useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client"; // React 19 导入 createRoot
import { createMarkdownIt } from "@/lib/markdown-it-plugin";
import { componentMap } from "./md-components";
import PageSkeleton from "../skeleton/page-skeleton";
import MdAnchor from "./md-anchor";
import markdownItTocDoneRight from "markdown-it-toc-done-right";
import "@/assets/css/md-content.css";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  showAnchor?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  className,
  content,
  showAnchor = true,
}) => {
  const mdRef = useRef<HTMLDivElement>(null);
  const [parsedHtml, setParsedHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tocHtml, setTocHtml] = useState("");

  const md = createMarkdownIt();

  md.use(markdownItTocDoneRight, {
    level: 2, // 从第二级开始
    linkClass: "md-anchor", // 自定义锚点类名
    slugify: (str: string) => str.trim(), // 原样输出，不进行其他操作
    callback: (tocHtml: string) => {
      setTocHtml(tocHtml);
    },
  });

  // 缓存每个占位符的 Root 实例，用于卸载时调用 unmount()
  const rootMap = useRef<Map<HTMLElement, Root>>(new Map());

  // 异步解析 MD 内容（含代码块高亮）- 逻辑不变
  useEffect(() => {
    const parseMd = async () => {
      setIsLoading(true);
      try {
        const html = await md.render(content);
        setParsedHtml(html);
      } catch (err) {
        console.error("MD 解析失败：", err);
        setParsedHtml("<div>解析失败</div>");
      } finally {
        setIsLoading(false);
      }
    };

    parseMd();
  }, [content]);

  // 替换自定义组件占位符（React 19 适配核心）
  useEffect(() => {
    if (!mdRef.current || isLoading) return;

    // 使用 setTimeout 将卸载和重新渲染操作推迟到下一个事件循环
    setTimeout(() => {
      // 清空之前的 Root 实例（避免重复渲染）
      rootMap.current.forEach((root) => root.unmount());
      rootMap.current.clear();

      if(!mdRef.current) return;

      // 重新渲染新的组件
      const placeholders = mdRef.current.querySelectorAll(
        "[data-md-component]"
      ) as NodeListOf<HTMLElement>;

      placeholders.forEach((placeholder) => {
        const componentName = placeholder.getAttribute("data-md-component");

        if (
          !componentName ||
          !componentMap[componentName as keyof typeof componentMap]
        ) {
          placeholder.textContent = `未知组件：${componentName}`;
          return;
        }

        // 获取所有 data-props-* 属性
        const props = {};
        Object.entries(placeholder.dataset).forEach(([key, value]) => {
          if (key.startsWith("props")) {
            const propsKey = key.replace("props", "").toLowerCase();
            // @ts-ignore
            props[propsKey] = decodeURIComponent(value || "");
          }
        });

        const Component =
          componentMap[componentName as keyof typeof componentMap];
        // React 19：使用 createRoot 创建根节点，渲染组件
        const root = createRoot(placeholder);
        // @ts-ignore
        root.render(<Component {...props} />);
        // 缓存 Root 实例，便于后续卸载
        rootMap.current.set(placeholder as HTMLElement, root);
      });
    }, 0);

    // 清理副作用：组件卸载时卸载所有 React 组件
    return () => {
      // 使用 setTimeout 将卸载操作推迟到下一个事件循环
      setTimeout(() => {
        rootMap.current.forEach((root) => {
          if (root) root.unmount();
        });
        rootMap.current.clear();
      }, 0);
    };
  }, [parsedHtml, isLoading]);

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      {/* 文档内容 */}
      <div
        ref={mdRef}
        id="write"
        className={cn("md-content", className)}
        dangerouslySetInnerHTML={{ __html: parsedHtml }}
      ></div>
      {/* 文档锚点 */}
      {showAnchor && <MdAnchor anchorHtml={tocHtml} />}
    </>
  );
};

export default MarkdownRenderer;
