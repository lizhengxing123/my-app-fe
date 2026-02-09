"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import Image from "next/image";
import img1 from "@/assets/20260209/img-1.jpg";
import img2 from "@/assets/20260209/img-2.jpg";
import img3 from "@/assets/20260209/img-3.jpg";
import img4 from "@/assets/20260209/img-4.jpg";
import img5 from "@/assets/20260209/img-5.jpg";
import "@/assets/css/20260209.css";

gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("hop", "0.85, 0, 0.15, 1");

export default function Page() {
  // 缓存所有需要操作的DOM元素引用
  const containerRef = useRef<HTMLDivElement>(null);
  const counterProgressRef = useRef<HTMLHeadingElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null); // 标题容器
  const overlayTextRef = useRef<HTMLDivElement>(null); // 叠加文本
  const heroImagesRef = useRef<HTMLDivElement>(null); // 图片容器
  const heroOverlayRef = useRef<HTMLDivElement>(null); // 叠加层
  // 缓存图片容器（批量ref）
  const imgContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroImgRef = useRef<HTMLDivElement>(null); // 核心图片

  const counter = { value: 0 };

  useGSAP(
    () => {
      // 提前校验所有ref，避免重复判断
      const { current: container } = containerRef;
      const { current: heroHeader } = heroHeaderRef;
      const { current: overlayText } = overlayTextRef;
      const { current: heroImages } = heroImagesRef;
      const { current: heroOverlay } = heroOverlayRef;
      const { current: heroImg } = heroImgRef;
      const imgContainers = imgContainerRefs.current.filter(Boolean); // 过滤null

      if (
        !container ||
        !heroHeader ||
        !overlayText ||
        !heroImages ||
        !heroOverlay ||
        !heroImg ||
        imgContainers.length === 0
      ) {
        return;
      }

      // 拆分文本
      const splitText = new SplitText(heroHeader.querySelector("h1"), {
        type: "words",
        mask: "words",
        wordsClass: "word",
      });

      // 定义3个时间线（timeline），分别管理不同动画序列
      // 时间线1：数字计数动画（0→100）
      const counterTl = gsap.timeline({ delay: 0.5 }); // 延迟0.5秒开始
      counterTl.to(counter, {
        value: 100, // 目标值
        duration: 5, // 动画时长5秒
        ease: "power2.out", // 缓动效果（先快后慢）
        onUpdate: () => {
          // 动画每一帧执行的回调
          if (!counterProgressRef.current) return;
          // 更新DOM文本，toFixed(0)保留0位小数（整数）
          counterProgressRef.current.textContent = counter.value.toFixed(0);
        },
      });

      // 时间线2：叠加文本向上位移动画
      const overlayTextTl = gsap.timeline({ delay: 0.75 });
      overlayTextTl
        .to(overlayText, { y: 0, duration: 0.75, ease: "hop" }) // 初始位移到0
        .to(overlayText, {
          y: "-2rem",
          duration: 0.75,
          ease: "hop",
          delay: 0.75,
        }) // 上移2rem
        .to(overlayText, {
          y: "-4rem",
          duration: 0.75,
          ease: "hop",
          delay: 0.75,
        }) // 上移4rem
        .to(overlayText, {
          y: "-6rem",
          duration: 0.75,
          ease: "hop",
          delay: 1,
        }); // 上移6rem

      // 时间线3：图片和标题的核心动画
      const revealTl = gsap.timeline({ delay: 0.5 });
      revealTl
        // 步骤1：所有图片容器从位移状态恢复，透明度从0→1，逐个触发（stagger:0.05）
        .to(imgContainers, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "hop",
        })
        // 步骤2：图片容器间距变为0.75vw，延迟0.5秒
        .to(heroImages, {
          gap: "0.75vw",
          duration: 1,
          delay: 0.5,
          ease: "hop",
        })
        // 步骤3：图片容器缩放恢复为1，与上一步同时开始（"<"表示立即执行）
        .to(imgContainers, { scale: 1, duration: 1, ease: "hop" }, "<")
        // 步骤4：非hero-img的图片容器通过clipPath裁剪为不可见（多边形裁剪，高度为0）
        .to(
          imgContainers.filter((el) => el !== heroImg),
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            stagger: 0.1,
            ease: "hop",
          },
        )
        // 步骤5：核心图片（hero-img）缩放为2倍
        .to(heroImg, { scale: 2, duration: 1, ease: "hop" })
        // 步骤6：叠加层通过clipPath裁剪为不可见
        .to(heroOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        })
        // 步骤7：标题文字逐词向下位移到0（入场），提前0.5秒开始（"-=0.5"）
        .to(
          splitText.words,
          {
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5",
        );

      // 返回清理函数，避免内存泄漏
      return () => {
        // 销毁时间线
        counterTl.kill(); 
        overlayTextTl.kill();
        revealTl.kill();
        splitText.revert(); // 恢复拆分的文本
        gsap.set(
          [
            imgContainers,
            overlayText,
            heroImages,
            heroImg,
            heroOverlay,
            heroHeader.querySelector("h1"),
          ],
          {
            clearProps: "all", // 清除所有动画属性
          },
        );
      };
    },
    {
      scope: containerRef,
    },
  );

  return (
    <main className="page" ref={containerRef}>
      <nav>
        <div className="nav-logo">
          <a href="">Zheng Xing</a>
        </div>
        <div className="nav-items">
          <a href="">Home</a>
          <a href="">About</a>
          <a href="">Contact</a>
          <a href="">Running</a>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-overlay" ref={heroOverlayRef}>
          <div className="counter">
            <h1 ref={counterProgressRef}>0</h1>
          </div>
          <div className="overlay-text-container">
            <div className="overlay-text" ref={overlayTextRef}>
              <p>Welcome</p>
              <p>Start Running</p>
              <p>Come</p>
            </div>
          </div>
        </div>
        <div className="hero-images" ref={heroImagesRef}>
          <div
            className="img-container"
            ref={(el) => {
              imgContainerRefs.current[0] = el;
            }}
          >
            <Image src={img1} alt="img-1" />
          </div>
          <div
            className="img-container"
            ref={(el) => {
              imgContainerRefs.current[1] = el;
            }}
          >
            <Image src={img2} alt="img-2" />
          </div>
          <div
            className="img-container hero-img"
            ref={(el) => {
              imgContainerRefs.current[2] = el;
              heroImgRef.current = el; // 核心图片单独绑定
            }}
          >
            <Image src={img3} alt="img-3" />
          </div>
          <div
            className="img-container"
            ref={(el) => {
              imgContainerRefs.current[3] = el;
            }}
          >
            <Image src={img4} alt="img-4" />
          </div>
          <div
            className="img-container"
            ref={(el) => {
              imgContainerRefs.current[4] = el;
            }}
          >
            <Image src={img5} alt="img-5" />
          </div>
        </div>
        <div className="hero-header" ref={heroHeaderRef}>
          <h1>Zheng XingYun</h1>
        </div>
      </section>
    </main>
  );
}
