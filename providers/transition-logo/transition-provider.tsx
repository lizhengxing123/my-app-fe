// components/TransitionLogoProvider.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import Logo from "./Logo";
import "@/assets/css/transition-logo.css";
import { TransitionRouter } from "next-transition-router";

export default function TransitionLogoProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const transitionOverlayRef = useRef<HTMLDivElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);
  // 新增：缓存path的总长度，避免重复计算
  const pathLengthRef = useRef<number>(0);

  // 初始化区块
  const initBlocks = useCallback(() => {
    if (!transitionOverlayRef.current) return;
    const blockCount = Math.max(10, Math.floor(window.innerWidth / 50));
    // 只有当区块数量变化时，才重建 DOM
    if (blocksRef.current.length === blockCount) {
      // 仅重置样式，不重建 DOM
      gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });
      return;
    }

    // 否则才重建区块
    transitionOverlayRef.current.innerHTML = "";
    blocksRef.current = [];

    for (let i = 0; i < blockCount; i++) {
      const block = document.createElement("div");
      block.className = "block";
      transitionOverlayRef.current.appendChild(block);
      blocksRef.current.push(block);
    }

    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    // 初始化Logo路径动画（优化：缓存path长度）
    if (logoRef.current) {
      const path = logoRef.current.querySelector("path");
      if (path) {
        pathLengthRef.current = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLengthRef.current,
          strokeDashoffset: pathLengthRef.current,
          fill: "transparent",
        });
      }
    }
  }, []);

  // 页面覆盖动画（核心修复：提前重置path状态）
  const cover = useCallback((onComplete: () => void) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const path = logoRef.current?.querySelector("path");
    if (!path || !blocksRef.current.length || !pathLengthRef.current) {
      onComplete();
      isTransitioning.current = false;
      return;
    }

    // 关在创建时间轴前，立即重置path到初始状态
    gsap.set(path, {
      strokeDashoffset: pathLengthRef.current,
      fill: "transparent",
      opacity: 1,
    });
    gsap.set(logoOverlayRef.current, { opacity: 0 });

    const t1 = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
      onReverseComplete: () => {
        isTransitioning.current = false;
      },
    });

    t1.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      transformOrigin: "left",
      ease: "power2.out",
    })
      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
      // 移除原有的延迟set，因为已经提前重置了
      .to(
        path,
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" },
        "-=0.5",
      )
      .to(path, { fill: "#ffffff", duration: 1, ease: "power2.out" }, "-=0.5")
      .to(logoOverlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      });
  }, []);

  // 页面揭示动画
  const reveal = useCallback(() => {
    if (!blocksRef.current.length) return;

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });
    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      transformOrigin: "right",
      ease: "power2.out",
      onComplete: () => {
        isTransitioning.current = false;
      },
    });
  }, []);

  // 初始化和窗口resize监听
  useEffect(() => {
    initBlocks();
    const handleResize = () => initBlocks();
    window.addEventListener("resize", handleResize);

    reveal();

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(blocksRef.current);
      if (logoRef.current) {
        gsap.killTweensOf(logoRef.current.querySelector("path"));
      }
    };
  }, [initBlocks, reveal]);

  return (
    <>
      <TransitionRouter auto leave={cover} enter={reveal}>
        <div ref={transitionOverlayRef} className="transition-overlay"></div>
        <div ref={logoOverlayRef} className="logo-overlay">
          <div className="logo-container">
            <Logo ref={logoRef} />
          </div>
        </div>
        {children}
      </TransitionRouter>
    </>
  );
}
