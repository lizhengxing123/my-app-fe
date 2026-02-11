// components/ScrollProgressRing.tsx
"use client"; // Next.js 15 App Router 必需，Page Router 可省略
import { ChevronUp } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

// 圆环基础配置（仅保留非颜色配置，颜色由Tailwind主题控制）
const RING_CONFIG = {
  radius: 24, // 圆环半径（px）
  strokeWidth: 4, // 描边宽度（px）
  position: "bottom-4 right-0 -translate-x-4", // 定位（Tailwind类）
  zIndex: "z-50", // 层级
  animationSpeed: 0.1, // 动画过渡速度（越小越慢越丝滑）
};

// 计算圆环周长：2 * π * 半径
const CIRCUMFERENCE = 2 * Math.PI * RING_CONFIG.radius;

const ScrollProgressRing = ({ scrollProgress }: { scrollProgress: number }) => {
  // 用于平滑过渡的进度值
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  
  // 点击圆环平滑滚动到顶部（复用Lenis实例，保持滚动体验一致）
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 平滑过渡进度值
  useEffect(() => {
    // 使用 useTransition 实现非阻塞的平滑过渡
    startTransition(() => {
      setAnimatedProgress(scrollProgress);
    });
  }, [scrollProgress, startTransition]);

  // 计算SVG描边偏移，控制圆环进度（使用动画后的进度值）
  const strokeDashoffset = CIRCUMFERENCE - animatedProgress * CIRCUMFERENCE;

  return (
    // 外层容器：添加点击事件、鼠标悬浮指针、主题自适应背景、点击反馈
    <div
      onClick={handleScrollToTop}
      className={`fixed ${RING_CONFIG.position} ${RING_CONFIG.zIndex} 
        flex items-center justify-center
        cursor-pointer transition-transform hover:scale-105 active:scale-95
        bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full
        p-1 // 增加点击区域，提升交互体验
      `}
      aria-label="Scroll to top and view scroll progress"
    >
      {/* SVG圆环容器：宽高 = 2*半径，避免描边裁剪 */}
      <svg
        width={RING_CONFIG.radius * 2}
        height={RING_CONFIG.radius * 2}
        viewBox={`0 0 ${RING_CONFIG.radius * 2} ${RING_CONFIG.radius * 2}`}
      >
        {/* 圆环背景：Tailwind主题适配 - 亮色浅灰，暗色深灰 */}
        <circle
          cx={RING_CONFIG.radius}
          cy={RING_CONFIG.radius}
          r={RING_CONFIG.radius - RING_CONFIG.strokeWidth / 2}
          fill="transparent"
          strokeWidth={RING_CONFIG.strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700" // 主题切换背景色
        />
        {/* 进度圆环：核心 - 添加 transition 实现描边偏移动画 */}
        <circle
          cx={RING_CONFIG.radius}
          cy={RING_CONFIG.radius}
          r={RING_CONFIG.radius - RING_CONFIG.strokeWidth / 2}
          fill="transparent"
          strokeWidth={RING_CONFIG.strokeWidth}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${RING_CONFIG.radius} ${RING_CONFIG.radius})`}
          // 主题切换进度色：亮色黑色，暗色白色（核心需求）
          className="stroke-black dark:stroke-white transition-all duration-300 ease-out"
        />
      </svg>
      {/* 进度百分比 */}
      <span className="absolute text-sm font-medium text-black dark:text-white flex flex-col items-center justify-center">
        <ChevronUp />
      </span>
    </div>
  );
};

export default ScrollProgressRing;