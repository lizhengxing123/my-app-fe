"use client";

import { useRef, useEffect } from "react";

import gsap from "gsap";

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

import "@/assets/css/20260409.css";

const CONFIG = {
  totalSides: 20,
  endScale: 5,
};

const slideTitles = Array.from(
  { length: CONFIG.totalSides },
  (_, i) => `Zheng xing ${i + 1}`,
);
const imgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export default function Page() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideTitleRef = useRef<HTMLParagraphElement>(null);
  const thumbnailWheelRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    slideWidth: 0,
    viewportCenter: 0,
    isMobile: false,
    currentX: 0,
    targetX: 0,
    isSCrolling: false,
    scrollTimeout: 0,
    activeSlideIndex: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      state.current.slideWidth = window.innerWidth * 0.45;
      state.current.viewportCenter = window.innerWidth / 2;
      state.current.isMobile = window.innerWidth < 1000;

      thumbnailWheelRef.current!.innerHTML = "";

      createThumbnailItems();
      createSlides();

      initialSlider();
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const createSlides = () => {
    for (let i = 0; i < CONFIG.totalSides * 3; i++) {
      const slide = document.createElement("div");
      slide.classList.add("slide");

      const img = document.createElement("img");
      const imgIndex = i % imgs.length;
      img.src = imgs[imgIndex].src;

      slide.appendChild(img);
      sliderRef.current?.appendChild(slide);
    }
  };

  const initialSlider = () => {
    const slides = sliderRef.current?.querySelectorAll(".slide");
    if (!slides) return;

    slides.forEach((slide, index) => {
      const x = state.current.slideWidth * index;
      gsap.set(slide, { x });
    });

    const centerOffset = window.innerWidth / 2 - state.current.slideWidth / 2;
    state.current.targetX = centerOffset;
    state.current.currentX = centerOffset;
  };

  const handleScroll = (e: WheelEvent) => {
    const scrollIntensity = e.deltaY || e.detail;
    state.current.targetX -= scrollIntensity * 1;

    state.current.isSCrolling = true;
    clearTimeout(state.current.scrollTimeout);

    // @ts-ignore
    state.current.scrollTimeout = setTimeout(() => {
      state.current.isSCrolling = false;
    }, 150);
  };

  const animate = () => {
    state.current.currentX +=
      (state.current.targetX - state.current.currentX) * 0.1;
    const totalWidth = CONFIG.totalSides * state.current.slideWidth;

    if (state.current.currentX > 0) {
      state.current.currentX -= totalWidth;
      state.current.targetX -= totalWidth;
    } else if (state.current.currentX < -totalWidth) {
      state.current.currentX += totalWidth;
      state.current.targetX += totalWidth;
    }

    let centerSlideIndex = 0;
    let closestToCenter = Infinity;

    const slides = sliderRef.current?.querySelectorAll(".slide");
    if (!slides) return;

    slides.forEach((slide, index) => {
      const x = state.current.currentX + state.current.slideWidth * index;
      gsap.set(slide, { x });

      const sliderCenterX = x + state.current.slideWidth / 2;
      const distanceFromCenter = Math.abs(
        sliderCenterX - state.current.viewportCenter,
      );

      const outerDistance = state.current.slideWidth * 3;
      const progress = Math.min(1, distanceFromCenter / outerDistance);

      const easedProgress =
        progress < 0.5
          ? progress * 2 * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const scale = 1 + easedProgress * (CONFIG.endScale - 1);

      const img = slide.querySelector("img");
      if (!img) return;
      gsap.set(img, { scale });

      if (distanceFromCenter < closestToCenter) {
        closestToCenter = distanceFromCenter;
        centerSlideIndex = index % CONFIG.totalSides;
      }
    });

    slideTitleRef.current!.textContent = slideTitles[centerSlideIndex];

    updateThumbnailItems();
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });

    const handleSCrollToTop = (e: Event) => {
      if (e.target === document || e.target === document.body) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("scroll", handleSCrollToTop, { passive: false });

    animate();
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("scroll", handleSCrollToTop);
    };
  }, []);

  const createThumbnailItems = () => {
    for (let i = 0; i < CONFIG.totalSides; i++) {
      const angle = (i / CONFIG.totalSides) * Math.PI * 2;
      const radius = state.current.isMobile ? 150 : 350;
      const x = radius * Math.cos(angle) + window.innerWidth / 2;
      const y = radius * Math.sin(angle) + window.innerHeight / 2 - 25;

      const thumbnail = document.createElement("div");
      thumbnail.classList.add("thumbnail-item");
      thumbnail.dataset.index = i.toString();
      thumbnail.dataset.angle = angle.toString();
      thumbnail.dataset.radius = radius.toString();

      const img = document.createElement("img");
      const imgIndex = i % imgs.length;
      img.src = imgs[imgIndex].src;
      thumbnail.appendChild(img);

      gsap.set(thumbnail, {
        x,
        y,
        transformOrigin: "center center",
      });

      thumbnailWheelRef.current?.appendChild(thumbnail);
    }
  };

  const updateThumbnailItems = () => {
    const exactSLideProgress =
      Math.abs(state.current.currentX) / state.current.slideWidth;
    const currentRotationAngle =
      -(exactSLideProgress * (360 / CONFIG.totalSides)) + 90;

    const thumbnails = thumbnailWheelRef.current?.querySelectorAll(
      ".thumbnail-item",
    ) as NodeListOf<HTMLDivElement>;
    if (!thumbnails) return;

    thumbnails.forEach((thumbnail) => {
      const baseAngle = parseFloat(thumbnail.dataset.angle!);
      const radius = state.current.isMobile ? 150 : 350;
      const currentAngle = baseAngle + (currentRotationAngle * Math.PI) / 180;

      const x = radius * Math.cos(currentAngle) + window.innerWidth / 2;
      const y = radius * Math.sin(currentAngle) + window.innerHeight / 2 - 25;
      gsap.set(thumbnail, {
        x,
        y,
        rotation: 0,
        transformOrigin: "center center",
      });
    });
  };

  return (
    <>
      <main className="page">
        <div className="slider" ref={sliderRef}>
          <p className="slide-title" ref={slideTitleRef}>
            20260409
          </p>
        </div>
        <div className="thumbnail-wheel" ref={thumbnailWheelRef}></div>
      </main>
    </>
  );
}
