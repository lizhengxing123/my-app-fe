"use client";
import { useRef } from "react";

import { ReactLenis, useLenis } from "lenis/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import lottie from "lottie-web";
import lottieJson from "@/assets/20260115/lottie.json";

import Image from "next/image";
import bg from "@/assets/20260115/bg.jpg";

import "@/assets/css/20260115.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Page() {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  const scrollDirectionRef = useRef<string>("down"); 
  const lastScrollYRef = useRef<number>(0); 

  useLenis(({ scroll }) => {
    scrollDirectionRef.current = scroll > lastScrollYRef.current ? "down" : "up";
    lastScrollYRef.current = scroll;
  });

  useGSAP(() => {
    const heroImg = heroImgRef.current!;
    const lottieContainer = lottieContainerRef.current!;

    const lottieAnimation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      autoplay: false,
      animationData: lottieJson,
    });

    const heroImgInitialWidth = heroImg.offsetWidth;
    const heroImgTargetWidth = 300;

    ScrollTrigger.create({
      trigger: ".about",
      start: "top bottom",
      end: "top 30%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const width =
          heroImgInitialWidth -
          (heroImgInitialWidth - heroImgTargetWidth) * progress;
        gsap.set(heroImg, { width: `${width}px` });
      },
    });

    let isAnimationPaused = false;

    ScrollTrigger.create({
      trigger: ".about",
      start: "top 30%",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const lottieOffset = self.progress * window.innerHeight * 1.1;
        isAnimationPaused = self.progress > 0;
        gsap.set(lottieContainer, {
          y: -lottieOffset,
          rotateY: scrollDirectionRef.current === "up" ? -180 : 0,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (!isAnimationPaused) {
          const scrollDistance = self.scroll() - self.start;
          const pixelsPerFrame = 3;
          const frame =
            Math.floor(scrollDistance / pixelsPerFrame) %
            lottieAnimation.totalFrames;
          lottieAnimation.goToAndStop(frame, true);
        }

        gsap.set(lottieContainer, {
          rotateY: scrollDirectionRef.current === "up" ? -180 : 0,
        });
      },
    });
  });

  return (
    <main className="page">
      <ReactLenis root />
      <nav>
        <a href="">Zheng</a>
      </nav>
      <section className="hero"></section>
      <section className="about">
        <h1>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, labore?
        </h1>
      </section>
      <div className="lottie-container">
        <div className="lottie" ref={lottieContainerRef}></div>
        <div className="hero-img" ref={heroImgRef}>
          <Image src={bg} alt="bg" />
        </div>
      </div>
    </main>
  );
}
