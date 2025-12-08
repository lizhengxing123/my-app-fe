"use client";

import "@/assets/css/transition-grid.css";
import { TransitionRouter, useTransitionState } from "next-transition-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TransitionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { stage, isReady } = useTransitionState();
  console.log("stage isReady", stage, isReady);

  const gridRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);

  const BLOCK_SIZE = 60;

  const createTransitionGrid = () => {
    if (!gridRef.current) return;

    const container = gridRef.current;
    container.innerHTML = "";
    blocksRef.current = [];

    const gridWidth = window.innerWidth;
    const gridHeight = window.innerHeight;
    const cols = Math.ceil(gridWidth / BLOCK_SIZE);
    const rows = Math.ceil(gridHeight / BLOCK_SIZE) + 1;
    const offsetX = (gridWidth - cols * BLOCK_SIZE) / 2;
    const offsetY = (gridHeight - rows * BLOCK_SIZE) / 2;

    // 创建文档碎片 提升性能
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const block = document.createElement("div");
        block.className = "transition-block";
        block.style.cssText = `
        left: ${offsetX + i * BLOCK_SIZE}px;
        top: ${offsetY + j * BLOCK_SIZE}px;
        width: ${BLOCK_SIZE}px;
        height: ${BLOCK_SIZE}px;
      `;
        fragment.appendChild(block);
        blocksRef.current.push(block);
      }
    }
    container.appendChild(fragment);

    gsap.set(blocksRef.current, { opacity: 0 });
  };

  useEffect(() => {
    createTransitionGrid();
    // 监听窗口变化 重新创建网格
    window.addEventListener("resize", createTransitionGrid);
    return () => {
      window.removeEventListener("resize", createTransitionGrid);
    };
  }, []);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tween = gsap.to(blocksRef.current, {
          opacity: 1,
          duration: 0.05,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
      enter={(next) => {
        gsap.set(blocksRef.current, { opacity: 1 });
        const tween = gsap.to(blocksRef.current, {
          opacity: 0,
          duration: 0.05,
          delay: 0.2,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
    >
      <div ref={gridRef} className="transition-grid" />
      {children}
    </TransitionRouter>
  );
}
