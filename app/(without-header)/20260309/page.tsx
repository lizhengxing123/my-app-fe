"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import spring from "@/assets/20260205/spring.webp";
import summer from "@/assets/20260205/summer.webp";
import autumn from "@/assets/20260205/autumn.webp";
import winter from "@/assets/20260205/winter.webp";

import "@/assets/css/20260309.css";

gsap.registerPlugin(SplitText);

const slideData = [
  { title: "Spring Green", image: spring },
  { title: "Summer Blue", image: summer },
  { title: "Autumn Yellow", image: autumn },
  { title: "Winter White", image: winter },
];

const genSlideItem = ({ slide }: { slide: (typeof slideData)[0] }) => {
  const item = document.createElement("div");
  item.className = "slide";
  item.innerHTML = `
                <img src="${slide.image.src}" alt="${slide.title}" class="slide-image" />
                <h1 class="slide-title">${slide.title}</h1>
            `;
  return item;
};
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const isSliderAnimating = useRef<boolean>(false);

  useGSAP(
    () => {
      const slider = sliderRef.current;
      if (!slider) return;

      slideData.forEach((item, index) => {
        const slide = genSlideItem({ slide: item });
        slider.appendChild(slide);
      });

      const slides = slider.querySelectorAll(".slide");

      slides.forEach((slide, index) => {
        const slideTitle = slide.querySelector(".slide-title");
        if (!slideTitle) return;
        new SplitText(slideTitle, { type: "words", mask: "words", wordsClass: "word" });
      });

      slides.forEach((slide, index) => {
        gsap.set(slide, {
          y: -15 + 15 * index + "%",
          z: 15 * index,
          opacity: 1,
        });
      });
    },
    { scope: containerRef },
  );

  const wheelAccumulator = useRef<number>(0);
  const wheelThreshold = 100;
  const isWheelActive = useRef<boolean>(false);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (isSliderAnimating.current || isWheelActive.current) return;

    wheelAccumulator.current += Math.abs(e.deltaY);

    if (wheelAccumulator.current >= wheelThreshold) {
      isWheelActive.current = true;
      wheelAccumulator.current = 0;

      const direction = e.deltaY > 0 ? "down" : "up";

      handleSlideChange(direction);

      setTimeout(() => {
        isWheelActive.current = false;
      }, 1200);
    }
  };

  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const isTouchActive = useRef<boolean>(false);
  const touchThreshold = 50;

  const handleTouchStart = (e: TouchEvent) => {
    if (isSliderAnimating.current || isTouchActive.current) return;

    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isSliderAnimating.current || isTouchActive.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const deltaY = touchStartY.current - touchEndY;
    const deltaX = Math.abs(touchStartX.current - touchEndX);

    if (Math.abs(deltaY) > deltaX && Math.abs(deltaY) > touchThreshold) {
      isTouchActive.current = true;

      const direction = deltaY > 0 ? "down" : "up";
      handleSlideChange(direction);

      setTimeout(() => {
        isTouchActive.current = false;
      }, 1200);
    }
  };

  const handleSlideChange = (direction: "up" | "down") => {
    if (isSliderAnimating.current) return;
    isSliderAnimating.current = true;

    if (direction === "up") {
      handleScrollUp();
    } else {
      handleScrollDown();
    }
  };

  const frontSlideIndex = useRef<number>(0);

  const handleScrollDown = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    // 这个滑块是最远的滑块
    const firstSlide = slides[0];

    frontSlideIndex.current = (frontSlideIndex.current + 1) % slideData.length;

    const newBackIndex =
      (frontSlideIndex.current + (slideData.length - 1)) % slideData.length;
    const nextSlideData = slideData[newBackIndex];

    const newSlide = genSlideItem({ slide: nextSlideData });

    const newTitle = newSlide.querySelector(".slide-title");
    const newSplit = new SplitText(newTitle, { type: "words", mask: "words", wordsClass: "word" });

    gsap.set(newSplit.words, { yPercent: 100 });

    slider.appendChild(newSlide);

    gsap.set(newSlide, {
      y: -15 + 15 * slides.length + "%",
      z: 15 * slides.length,
      opacity: 0,
    });

    const allSlides = slider.querySelectorAll(".slide");

    allSlides.forEach((slide, index) => {
      const targetPosition = index - 1;

      gsap.to(slide, {
        y: -15 + 15 * targetPosition + "%",
        z: 15 * targetPosition,
        opacity: targetPosition < 0 ? 0 : 1,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          if (index === 0) {
            firstSlide.remove();
            isSliderAnimating.current = false;
          }
        },
      });
    });

    gsap.to(newSplit.words, {
      yPercent: 0,
      duration: 0.75,
      ease: "power4.out",
      stagger: 0.15,
      delay: 0.5,
    });
  };

  const handleScrollUp = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    
    const lastSlide = slides[slides.length - 1];

    frontSlideIndex.current =
      (frontSlideIndex.current - 1 + slideData.length) % slideData.length;
    const prevSlideData = slideData[frontSlideIndex.current];

    const newSlide = genSlideItem({ slide: prevSlideData });

    const newTitle = newSlide.querySelector(".slide-title");
    new SplitText(newTitle, { type: "words", mask: "words", wordsClass: "word" });

    slider.prepend(newSlide);

    gsap.set(newSlide, {
      y: -15 + 15 * -1 + "%",
      z: 15 * -1,
      opacity: 0,
    });

    // 获取下一个最近元素
    const topSlide = slides[slides.length - 2];
    gsap.set(topSlide.querySelectorAll(".slide-title .word"), {
      yPercent: -100,
    });

    let slideQueue = Array.from(slider.querySelectorAll(".slide"));

    slideQueue.forEach((slide, i) => {
      let targetPosition = i;

      gsap.to(slide, {
        y: -15 + 15 * targetPosition + "%",
        z: 15 * targetPosition,
        opacity: targetPosition > slideQueue.length - 2 ? 0 : 1,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          if (i === slideQueue.length - 1) {
            lastSlide.remove();
            isSliderAnimating.current = false;
          }
        },
      });
    });

    gsap.to(topSlide.querySelectorAll(".slide-title .word"), {
      yPercent: 0,
      duration: 0.75,
      ease: "power4.out",
      stagger: 0.15,
      delay: 0.5,
    });
  };

  useEffect(() => {
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
  return (
    <>
      <main className="page" ref={containerRef}>
        <nav>
          <div className="nav-logo">
            <a href="#">Zheng Xing</a>
          </div>

          <div className="nav-links">
            <a href="#">Projects</a>
            <a href="#">Contact</a>
            <a href="#">About</a>
            <a href="#">Resume</a>
          </div>

          <div className="nav-cat">
            <a href="#">Join Club</a>
          </div>
        </nav>

        <footer>
          <p>Copyright © 2026 Zheng Xing. All rights reserved.</p>
          <p>Developed by Zheng Xing</p>
        </footer>

        <div className="page-container">
          <div className="slider" ref={sliderRef}></div>
        </div>
      </main>
    </>
  );
}


