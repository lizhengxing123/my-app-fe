"use client";

import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import Lenis from "lenis";

import Image from "next/image";
import img1 from "@/assets/20260128/1.jpg";
import img2 from "@/assets/20260128/2.jpg";
import img3 from "@/assets/20260128/3.jpg";
import img4 from "@/assets/20260128/4.jpg";
import img5 from "@/assets/20260128/5.jpg";
import img6 from "@/assets/20260128/6.jpg";
import img7 from "@/assets/20260128/7.jpg";
import img8 from "@/assets/20260128/8.jpg";
import img9 from "@/assets/20260128/9.jpg";
import img10 from "@/assets/20260128/10.jpg";

import "@/assets/css/20260310.css";

const texts = [
  "Spring is a season in the Northern Hemisphere, usually beginning on the 21st of March and ending on the 21st of June.",
  "Summer is a season in the Northern Hemisphere, usually beginning on the 21st of June and ending on the 21st of September.",
  "Fall is a season in the Northern Hemisphere, usually beginning on the 21st of September and ending on the 21st of December.",
];

const images = [
  { src: img1, name: "Spring Scene 01" },
  { src: img2, name: "Spring Scene 02" },
  { src: img3, name: "Summer Scene 01" },
  { src: img4, name: "Summer Scene 02" },
  { src: img5, name: "Summer Scene 03" },
  { src: img6, name: "Autumn Scene 01" },
  { src: img7, name: "Autumn Scene 02" },
  { src: img8, name: "Autumn Scene 03" },
  { src: img9, name: "Winter Scene 01" },
  { src: img10, name: "Winter Scene 02" },
];

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const marqueeItemsRef = useRef<HTMLElement[]>([]); // 存储所有marquee-item元素

  const targetVelocity = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const marqueeUpdateRef = useRef<((time: number) => void) | null>(null);
  const isHoveringRef = useRef(false);
  const activeItemRef = useRef<HTMLElement | null>(null); // 当前悬浮的item

  // Lenis初始化逻辑（不变）
  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on("scroll", (e) => {
      targetVelocity.current = Math.abs(e.velocity) * 0.2;
      ScrollTrigger.update();
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 优化后的hover处理函数
  const handleImgHover = (item: HTMLElement, isEnter: boolean) => {
    const lenis = lenisRef.current;
    const updateMarquee = marqueeUpdateRef.current;

    // 基础校验
    if (!lenis || !updateMarquee || !item) return;

    console.log(isEnter, isHoveringRef.current);
    // 处理全局hover状态
    if (isEnter) {
      if (isHoveringRef.current) return; // 避免重复执行
      isHoveringRef.current = true;
      activeItemRef.current = item;
      gsap.ticker.remove(updateMarquee);
      lenis.stop();
    } else {
      if (!isHoveringRef.current) return; // 避免重复执行
      isHoveringRef.current = false;
      activeItemRef.current = null;
      gsap.ticker.add(updateMarquee);
      lenis.start();
    }

    // 获取当前item中的文字元素
    const wordMasks = item.querySelectorAll(".img-name .word-mask");
    if (!wordMasks.length) return;

    // 执行文字动画
    gsap.to(wordMasks, {
      yPercent: isEnter ? 0 : 100,
      duration: 0.3,
      ease: "power3.out",
      stagger: 0.05,
      overwrite: true, // 强制覆盖之前的动画，避免冲突
    });
  };

  useGSAP(
    () => {
      const textBlocks = gsap.utils.toArray(".copy-block p") as HTMLElement[];
      const splitInstances = textBlocks.map(
        (block) =>
          new SplitText(block, {
            type: "words",
            mask: "words",
            wordsClass: "word",
          }),
      );

      gsap.set(splitInstances[1].words, { yPercent: 100 });
      gsap.set(splitInstances[2].words, { yPercent: 100 });

      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: `+=${window.innerHeight * 6}px`,
        // scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const scrollProgress = self.progress;

          gsap.set(indicatorRef.current, { "--progress": scrollProgress });

          if (scrollProgress <= 0.5) {
            const phaseProgress = scrollProgress / 0.5;
            animateBlock(splitInstances[0], splitInstances[1], phaseProgress);
          } else {
            const phaseProgress = (scrollProgress - 0.5) / 0.5;
            gsap.set(splitInstances[0].words, { yPercent: 100 });
            animateBlock(splitInstances[1], splitInstances[2], phaseProgress);
          }
        },
      });
    },
    { scope: containerRef },
  );

  const overlapCount = 3;
  const getWordProgress = (
    phaseProgress: number,
    wordIndex: number,
    totalWords: number,
  ) => {
    const totalLength = 1 + overlapCount / totalWords;
    const scale =
      1 /
      Math.min(
        totalLength,
        1 + (totalWords - 1) / totalWords + overlapCount / totalWords,
      );

    const startTime = (wordIndex / totalWords) * scale;
    const endTime = startTime + (overlapCount / totalWords) * scale;
    const duration = endTime - startTime;

    if (phaseProgress <= startTime) return 0;
    if (phaseProgress >= endTime) return 1;
    return (phaseProgress - startTime) / duration;
  };

  const animateBlock = (
    outBlock: SplitText,
    inBlock: SplitText,
    phaseProgress: number,
  ) => {
    outBlock.words.forEach((word, index) => {
      const progress = getWordProgress(
        phaseProgress,
        index,
        outBlock.words.length,
      );
      gsap.set(word, { yPercent: progress * 100 });
    });

    inBlock.words.forEach((word, index) => {
      const progress = getWordProgress(
        phaseProgress,
        index,
        inBlock.words.length,
      );
      gsap.set(word, { yPercent: 100 - progress * 100 });
    });
  };

  const marqueePosition = useRef(0);
  const smoothVelocity = useRef(0);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const marqueeTrack = marqueeTrackRef.current;
    if (!indicator || !marqueeTrack) return;

    // 切割所有 marquee-item 中的 name
    marqueeItemsRef.current = gsap.utils.toArray(
      ".marquee-item",
    ) as HTMLElement[];
    marqueeItemsRef.current.map((item) => {
      return new SplitText(item.querySelector(".img-name"), {
        type: "words",
        mask: "words",
        wordsClass: "word",
      });
    });

    gsap.set(".img-name .word-mask", { yPercent: 100 });

    const updateMarquee = () => {
      // 悬浮时不执行更新
      if (isHoveringRef.current) return;

      smoothVelocity.current +=
        (targetVelocity.current - smoothVelocity.current) * 0.5;

      const baseSpeed = 0.45;
      const speed = baseSpeed + smoothVelocity.current * 9;

      marqueePosition.current -= speed;

      const trackWidth = marqueeTrack.scrollWidth / 2;
      if (marqueePosition.current <= -trackWidth) {
        marqueePosition.current = 0;
      }

      gsap.set(marqueeTrack, { x: marqueePosition.current });

      targetVelocity.current *= 0.9;
    };

    marqueeUpdateRef.current = updateMarquee;
    gsap.ticker.add(updateMarquee);

    return () => {
      gsap.ticker.remove(updateMarquee);
    };
  }, []);

  return (
    <>
      <main className="page" ref={containerRef}>
        <nav>
          <p>Zheng Xing</p>
          <p>2026-03-10</p>
        </nav>

        <section className="hero">
          <div className="about-copy">
            {texts.map((text, index) => (
              <div className="copy-block" key={index}>
                <p>{text}</p>
              </div>
            ))}
          </div>

          <div className="marquee">
            <div className="marquee-track" ref={marqueeTrackRef}>
              {/* 循环两次 */}
              {[...images, ...images].map((img, index) => (
                <div
                  key={index}
                  className="marquee-item"
                  onMouseEnter={() =>
                    handleImgHover(marqueeItemsRef.current[index], true)
                  }
                  onMouseLeave={() =>
                    handleImgHover(marqueeItemsRef.current[index], false)
                  }
                >
                  <p className="img-name">{img.name}</p>
                  <div className="img-wrapper">
                    <Image
                      src={img.src}
                      alt={img.name}
                      className="marquee-img"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-indicator" ref={indicatorRef}></div>
        </section>
      </main>
    </>
  );
}
