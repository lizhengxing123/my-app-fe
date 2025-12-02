"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/assets/css/md-anchor.css";

export default function MdAnchor({ anchorHtml }: { anchorHtml: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const anchorContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 获取文档内容容器
  useEffect(() => {
    // 查找文档内容容器（假设它有ref或特定的类名）
    const mdContent = document.querySelector(".md-content");
    console.log(mdContent);
    if (mdContent) {
      contentRef.current = mdContent as HTMLDivElement;
    }
  }, []);

  // 监听文档滚动，更新当前活动的锚点
  useEffect(() => {
    // 滚动事件处理函数
    const handleScroll = () => {
      // 获取标题元素
      const headings = document.querySelectorAll("h2, h3");
      let currentActiveId = "";
      
      // 遍历所有标题，找到当前可见的最上方标题
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        
        // 当标题距离视口顶部小于等于100px时，认为它是当前活动的标题
        if (rect.top <= 100) {
          currentActiveId = heading.id;
          break;
        }
      }
      
      // 更新当前活动的锚点ID
      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // 初始加载时执行一次，设置初始活动锚点
    handleScroll();

    // 清理事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeId]);

  // 监听activeId变化，确保锚点链接的active状态同步更新
  useEffect(() => {
    if (activeId && anchorContainerRef.current) {
      // 先移除所有链接的active类
      anchorContainerRef.current.querySelectorAll("a").forEach((a) => {
        a.classList.remove("active");
      });

      // 为对应链接添加active类
      const activeLink = anchorContainerRef.current.querySelector(
        `a[href="#${activeId}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  }, [activeId]);

  return (
    <div className="fixed top-24 right-4 text-sm w-[200px]">
      <div className="font-mono text-sm/6 font-medium tracking-widest text-gray-500 sm:text-xs/6 dark:text-gray-400 mb-2">本页目录</div>
      <div
        ref={anchorContainerRef}
        dangerouslySetInnerHTML={{ __html: anchorHtml }}
      ></div>
    </div>
  );
}