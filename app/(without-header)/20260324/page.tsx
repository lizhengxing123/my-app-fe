"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { images } from "../20260323/data";

import "@/assets/css/20260324.css";

const CONFIG = {
  slideWidth: 200,
  slideHeight: 275,
  slideGap: 100,
  slideCount: 9,
  arcDepth: 200,
  centerLift: 100,
  scrollLerp: 0.05,
};

const slides = images.slice(0, -1);

const trackWidth = CONFIG.slideCount * CONFIG.slideGap;

export default function Page() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const rafIdRef = useRef<number | null>(null);

  const [activeSlideIndex, setActiveSlideIndex] = useState(-1);

  const stateRef = useRef({
    scrollTarget: 0,
    scrollCurrent: 0,
    touchStartX: 0,
    windowWidth: 0,
    windowHeight: 0,
    windowCenterX: 0,
    arcBaselineY: 0,
  });

  const computeSlideTransform = useCallback(
    (slideIndex: number, scrollOffset: number) => {
      let wrappedOffsetX =
        (((slideIndex * CONFIG.slideGap - scrollOffset) % trackWidth) +
          trackWidth) %
        trackWidth;
      if (wrappedOffsetX > trackWidth / 2) wrappedOffsetX -= trackWidth;

      const slideCenterX = stateRef.current.windowCenterX + wrappedOffsetX;
      const normalizedDist =
        (slideCenterX - stateRef.current.windowCenterX) /
        (stateRef.current.windowWidth * 0.5);
      const absDist = Math.min(Math.abs(normalizedDist), 1.3);

      const scaleFactor = Math.max(1 - absDist * 0.8, 0.25);
      const scaledWidth = CONFIG.slideWidth * scaleFactor;
      const scaledHeight = CONFIG.slideHeight * scaleFactor;

      const clampedDist = Math.min(absDist, 1);
      const arcDropY =
        (1 - Math.cos(clampedDist * Math.PI)) * 0.5 * CONFIG.arcDepth;

      const centerLiftY = Math.min(1 - absDist * 2, 0) * CONFIG.centerLift;

      return {
        x: slideCenterX - scaledWidth / 2,
        y:
          stateRef.current.arcBaselineY -
          scaledHeight / 2 +
          arcDropY -
          centerLiftY,
        width: scaledWidth,
        height: scaledHeight,
        zIndex: Math.round((1 - absDist) * 100),
        distanceFromCenter: Math.abs(wrappedOffsetX),
      };
    },
    [],
  );

  const layoutSlides = useCallback(
    (scrollOffset: number) => {
      slidesRef.current.forEach((slideEl, slideIndex) => {
        const { x, y, width, height, zIndex } = computeSlideTransform(
          slideIndex,
          scrollOffset,
        );
        gsap.set(slideEl, {
          x,
          y,
          width,
          height,
          zIndex,
        });
      });
    },
    [computeSlideTransform, slidesRef],
  );

  const syncActiveTitle = useCallback(
    (scrollOffset: number) => {
      let closestIndex = 0;
      let closestDist = Infinity;

      slidesRef.current.forEach((_, slideIndex) => {
        const { distanceFromCenter } = computeSlideTransform(
          slideIndex,
          scrollOffset,
        );
        if (distanceFromCenter < closestDist) {
          closestIndex = slideIndex;
          closestDist = distanceFromCenter;
        }
      });

      if (closestIndex !== activeSlideIndex) {
        setActiveSlideIndex(closestIndex);
        titleRef.current!.textContent = slides[closestIndex].alt;
      }
    },
    [computeSlideTransform, activeSlideIndex, titleRef, slidesRef],
  );

  const animate = useCallback(() => {
    stateRef.current.scrollCurrent +=
      (stateRef.current.scrollTarget - stateRef.current.scrollCurrent) *
      CONFIG.scrollLerp;

    layoutSlides(stateRef.current.scrollCurrent);
    syncActiveTitle(stateRef.current.scrollCurrent);

    rafIdRef.current = requestAnimationFrame(() => {
      animate();
    });
  }, [layoutSlides, syncActiveTitle, slidesRef]);
  useGSAP(
    () => {
      const slider = sliderRef.current;
      if (!slider) return;
      stateRef.current.windowWidth = window.innerWidth;
      stateRef.current.windowHeight = window.innerHeight;
      stateRef.current.windowCenterX = stateRef.current.windowWidth / 2;
      stateRef.current.arcBaselineY = stateRef.current.windowHeight * 0.4;

      setActiveSlideIndex(
        Math.round(stateRef.current.scrollCurrent / CONFIG.slideGap),
      );

      layoutSlides(0);

      animate();

      const handleResize = () => {
        stateRef.current.windowWidth = window.innerWidth;
        stateRef.current.windowHeight = window.innerHeight;
        stateRef.current.windowCenterX = stateRef.current.windowWidth / 2;
        stateRef.current.arcBaselineY = stateRef.current.windowHeight * 0.4;
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    },
    { scope: sliderRef },
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // 鼠标滚轮滚动
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.scrollTarget += e.deltaY * 0.5;
    };
    // 触摸开始
    const handleTouchStart = (e: TouchEvent) => {
      stateRef.current.touchStartX = e.touches[0].clientX;
    };
    // 触摸移动
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchCurrentX = e.touches[0].clientX;
      stateRef.current.scrollTarget +=
        (stateRef.current.touchStartX - touchCurrentX) * 1.2;
      stateRef.current.touchStartX = touchCurrentX;
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });
    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      slider.removeEventListener("wheel", handleWheel);
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  return (
    <main className="page">
      <section className="slider" ref={sliderRef}>
        {slides.map((slide, index) => (
          <div
            className="slide"
            key={index}
            ref={(el) => {
              slidesRef.current[index] = el!;
            }}
          >
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
        <p id="slide-title" ref={titleRef}>
          Slide Title
        </p>
      </section>
    </main>
  );
}
