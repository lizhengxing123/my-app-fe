"use client";

import React, { useRef, useEffect, useState } from "react";
import { useActiveAnchor, getHeaders, OutlineItem } from "@/hooks/use-outline";
import ScrollProgressRing from "@/components/md/scroll-progress-ring";
import { cn } from "@/lib/utils";
import "@/assets/css/md-anchor.css";

export default function DocsPage() {
  const navRef = useRef<HTMLElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const [headers, setHeaders] = useState<OutlineItem[]>([]);
  const [title, setTitle] = useState<string>("");

  // optional: provide a function to return current header offset for fixed topbars
  const getScrollOffset = () => {
    const el = document.querySelector(".site-header") as HTMLElement | null;
    return el ? el.offsetHeight + 20 : 0;
  };

  // pass isAsideEnabled true/false or function
  const { scrollProgress } = useActiveAnchor(navRef, markerRef, {
    isAsideEnabled: true,
    getScrollOffset,
    headerSelectorContainer: ".md-content",
  });

  // if you want to render an outline list based on headings:
  useEffect(() => {
    if (typeof window === "undefined") return;
    setTimeout(() => {
      const outline = getHeaders([2, 3], ".md-content"); // default container selector override
      setHeaders(outline || []);
      setTitle("页面导航");

      // you can store outline in state and render a nav
    }, 1000);
  }, []);

  return (
    <div className="md-anchor border-box fixed top-20 right-0 w-[210px] h-full">
      <nav ref={navRef}>
        <div className="content border-l">
          <div className="outline-marker" ref={markerRef} />

          <div className="outline-title">{title}</div>

          <NavItem headers={headers} root={true} />
        </div>
      </nav>
      {/* 滚动到顶部按钮 */}
      {headers.length > 0 && (
        <ScrollProgressRing scrollProgress={scrollProgress} />
      )}
    </div>
  );
}

function NavItem({
  headers,
  root,
}: {
  headers: OutlineItem[];
  root?: boolean;
}) {
  return (
    <>
      <ul className={cn("outline-item", root ? "root" : "nested")}>
        {headers.map((header) => (
          <li key={header.link}>
            <a className="outline-link" href={header.link}>
              {header.title}
            </a>
            {header.children && header.children.length > 0 && (
              <NavItem headers={header.children} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
