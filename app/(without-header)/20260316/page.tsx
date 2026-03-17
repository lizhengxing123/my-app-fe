"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "@/assets/css/20260316.css";

import Image from "next/image";
import img1 from "@/assets/20260224/1.jpg";
import img2 from "@/assets/20260224/2.jpg";
import img3 from "@/assets/20260224/3.jpg";
import img4 from "@/assets/20260224/4.jpg";
import img5 from "@/assets/20260224/5.jpg";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create(
"hop",
"M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1",
);

const carouselSlides = [
  { title: "Feast of Color", image: img1 },
  { title: "The Matador", image: img2 },
  { title: "Final Plea", image: img3 },
  { title: "Old Philosopher", image: img4 },
  { title: "Evening Waltz", image: img5 },
];

export default function CarouselPage() {
  // 核心状态
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 引用
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]); // 所有图片的ref
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const splitTextInstances = useRef<SplitText[]>([]);

  // 初始化标题拆分
  const splitTitles = useCallback(() => {
    if (splitTextInstances.current.length > 0) return;

    titleRefs.current.forEach((title, index) => {
      if (!title) return;
      const splitText = new SplitText(title, {
        type: "words",
        wordsClass: "word",
      });
      splitTextInstances.current.push(splitText);

      // 初始化所有标题样式（除了第一个）
      const words = title.querySelectorAll(".word");
      gsap.set(words, {
        filter: "blur(75px)",
        opacity: 0,
      });
    });
  }, []);

  // 初始化第一张幻灯片
  const initFirstSlide = useCallback(() => {
    // 初始化第一张标题动画
    const firstTitleWords = titleRefs.current[0]?.querySelectorAll(".word");
    if (firstTitleWords) {
      gsap.to(firstTitleWords, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 2,
        ease: "power3.out",
      });
    }

    // 初始化所有图片的初始位置
    imageRefs.current.forEach((img, index) => {
      if (!img) return;
      gsap.set(img, {
        x: index === 0 ? 0 : window.innerWidth, // 第一张在可视区，其他在右侧
        opacity: index === 0 ? 1 : 0,
      });
    });
  }, []);

  // 更新标题显示状态
  const updateActiveTextSlide = useCallback((newIndex: number) => {
    titleRefs.current.forEach((title, index) => {
      if (!title) return;
      const words = title.querySelectorAll(".word");

      if (index === newIndex) {
        gsap.to(words, {
          filter: "blur(0px)",
          opacity: 1,
          duration: 2,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.to(words, {
          filter: "blur(75px)",
          opacity: 0,
          duration: 2.5,
          ease: "power1.out",
          overwrite: true,
        });
      }
    });
  }, []);

  // 核心动画逻辑（仅控制GSAP，不操作DOM）
  const animateSlide = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating) return;
      setIsAnimating(true);

      const viewportWidth = window.innerWidth;
      const sideOffset = Math.min(viewportWidth / 2, 500);

      // 计算新索引（提前计算，避免闭包问题）
      const newIndex =
        direction === "right"
          ? (currentIndex + 1) % carouselSlides.length
          : (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;

      // 获取当前和目标图片
      const currentImg = imageRefs.current[currentIndex];
      const targetImg = imageRefs.current[newIndex];

      if (!currentImg || !targetImg) {
        setIsAnimating(false);
        return;
      }

      // 1. 先把目标图片放到动画起始位置
      gsap.set(targetImg, {
        x: direction === "right" ? sideOffset : -sideOffset,
        clipPath: direction === "right" ? "polygon(100% 0%, 100% 0, 100% 100%, 100% 100%)" : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        opacity: 1,
      });

      // 2. 执行当前图片退场动画
      gsap.to(currentImg, {
        x: direction === "right" ? -viewportWidth : viewportWidth,
        duration: 1.5,
        ease: "hop",
      });

      // 3. 执行目标图片入场动画
      gsap.to(targetImg, {
        x: 0,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
        onComplete: () => {
          // 动画完成后更新索引，并重置非当前图片的位置
          setCurrentIndex(newIndex);
          setIsAnimating(false);
        },
      });

      // 同步更新标题动画
      updateActiveTextSlide(newIndex);
    },
    [currentIndex, isAnimating, updateActiveTextSlide],
  );

  // 绑定GSAP初始化逻辑
  useGSAP(
    () => {
      if (!containerRef.current) return;
      splitTitles();
      initFirstSlide();
    },
    { scope: containerRef, dependencies: [splitTitles, initFirstSlide] },
  );

  // 窗口大小变化时重置图片位置
  useEffect(() => {
    const handleResize = () => {
      if (isAnimating) return;
      imageRefs.current.forEach((img, index) => {
        if (img) {
          gsap.set(img, {
            x: index === currentIndex ? 0 : window.innerWidth,
          });
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, isAnimating]);

  // 清理GSAP实例
  useEffect(() => {
    return () => {
      splitTextInstances.current.forEach((instance) => instance.revert());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <main className="page" ref={containerRef}>
      <nav>
        <div className="nav-logo">
          <a href="#">Zheng xing</a>
        </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Projects</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      <div className="carousel">
        {/* 预渲染所有标题 */}
        {carouselSlides.map((slide, index) => (
          <div key={`title-${index}`} className="slide-title-container">
            <h1
              className="title"
              ref={(el) => {
                titleRefs.current[index] = el;
              }}
            >
              {slide.title}
            </h1>
          </div>
        ))}

        {/* 预渲染所有图片（核心优化点） */}
        <div className="carousel-images">
          {carouselSlides.map((slide, index) => (
            <div key={`img-${index}`} className="img">
              <Image
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                src={slide.image}
                alt={slide.title}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="slider-controls">
        <div
          className="prev-btn slider-btn"
          onClick={() => animateSlide("left")}
        >
          <ArrowLeft />
        </div>
        <div
          className="next-btn slider-btn"
          onClick={() => animateSlide("right")}
        >
          <ArrowRight />
        </div>
      </div>

      <footer>
        <p>Copyright © 2026 Zheng xing. All rights reserved.</p>
        <p>Designed by Zheng xing</p>
      </footer>

      <svg
        viewBox="0 0 0 0"
        aria-hidden="true"
        style={{ position: "absolute", zIndex: -1, opacity: 0 }}
      >
        <defs>
          <filter id="blur-matrix">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </main>
  );
}
