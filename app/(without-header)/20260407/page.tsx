"use client";

import { useRef, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

import { LenisRef, ReactLenis } from "lenis/react";

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
import img11 from "@/assets/20260205/autumn.webp";
import img12 from "@/assets/20260205/spring.webp";
import img13 from "@/assets/20260205/summer.webp";

import "@/assets/css/20260407.css";

const imgs = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
];

gsap.registerPlugin(ScrollTrigger, Flip);
export default function Page() {
  const lenisRef = useRef<LenisRef>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeImagesRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const horizontalScrollWrapperRef = useRef<HTMLDivElement>(null);

  const pinnedMarqueeImgClone = useRef<HTMLDivElement>(null);
  const isCloneImgActive = useRef(false);
  const flipAnimation = useRef<gsap.core.Timeline>(null);

  // 获取亮色和暗色
  const lightColor = "#ffffff";
  const darkColor = "#000000";

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    return gsap.utils.interpolate(color1, color2, factor);
  };

  useGSAP(
    () => {
      const marqueeImages = marqueeImagesRef.current;
      const marquee = marqueeRef.current;
      if (!marqueeImages || !marquee) return;

      gsap.to(marqueeImages, {
        scrollTrigger: {
          trigger: marquee,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const xPosition = -75 + 25 * progress;
            gsap.set(marqueeImages, {
              x: `${xPosition}%`,
            });
          },
        },
      });
    },
    { scope: marqueeRef },
  );

  const createPinnedMarqueeImgClone = () => {
    if (isCloneImgActive.current) return;

    const originalMarqueeImg = marqueeImagesRef.current?.querySelector(
      ".pin img",
    ) as HTMLImageElement;
    if (!originalMarqueeImg) return;
    const rect = originalMarqueeImg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    pinnedMarqueeImgClone.current = originalMarqueeImg.cloneNode(
      true,
    ) as HTMLDivElement;

    gsap.set(pinnedMarqueeImgClone.current, {
      position: "fixed",
      left: centerX - originalMarqueeImg.offsetWidth / 2 + "px",
      top: centerY - originalMarqueeImg.offsetHeight / 2 + "px",
      width: originalMarqueeImg.offsetWidth + "px",
      height: originalMarqueeImg.offsetHeight + "px",
      transform: "rotate(-5deg)",
      transformOrigin: "center center",
      pointerEvents: "none",
      willChange: "transform",
      zIndex: 100,
    });

    containerRef.current?.appendChild(pinnedMarqueeImgClone.current);
    gsap.set(originalMarqueeImg, {
      opacity: 0,
    });
    isCloneImgActive.current = true;
  };

  const removePinnedMarqueeImgClone = () => {
    if (!isCloneImgActive.current) return;
    if (pinnedMarqueeImgClone.current) {
      pinnedMarqueeImgClone.current.remove();
      pinnedMarqueeImgClone.current = null;
    }
    const originalMarqueeImg = marqueeImagesRef.current?.querySelector(
      ".pin img",
    ) as HTMLImageElement;
    gsap.set(originalMarqueeImg, {
      opacity: 1,
    });
    isCloneImgActive.current = false;
  };

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: horizontalScrollRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
      });
    },
    { scope: horizontalScrollRef },
  );

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: marqueeRef.current,
        start: "top top",
        onEnter: createPinnedMarqueeImgClone,
        onEnterBack: createPinnedMarqueeImgClone,
        onLeaveBack: removePinnedMarqueeImgClone,
      });
    },
    { scope: marqueeRef },
  );

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: horizontalScrollRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 5.5}px`,
        onEnter: () => {
          if (
            pinnedMarqueeImgClone.current &&
            isCloneImgActive.current &&
            !flipAnimation.current
          ) {
            const state = Flip.getState(pinnedMarqueeImgClone.current);

            gsap.set(pinnedMarqueeImgClone.current, {
              position: "fixed",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100svh",
              transform: "rotate(0deg)",
              transformOrigin: "center center",
            });

            flipAnimation.current = Flip.from(state, {
              duration: 1,
              ease: "none",
              paused: true,
            });
          }
        },
        onLeaveBack: () => {
          if (flipAnimation.current) {
            flipAnimation.current.kill();
            flipAnimation.current = null;
          }

          gsap.set(containerRef.current, {
            backgroundColor: lightColor,
          });

          gsap.set(horizontalScrollWrapperRef.current, {
            x: "0%",
          });
        },
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: horizontalScrollRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 5.5}px`,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress <= 0.05) {
            const bgColorProgress = Math.min(progress / 0.05, 1);
            const newBgColor = interpolateColor(
              lightColor,
              darkColor,
              bgColorProgress,
            );
            gsap.set(containerRef.current, {
              backgroundColor: newBgColor,
            });
          } else if (progress > 0.05) {
            gsap.set(containerRef.current, {
              backgroundColor: darkColor,
            });
          }

          if (progress <= 0.2) {
            const scaleProgress = Math.min(progress / 0.2, 1);

            if (flipAnimation.current) {
              flipAnimation.current.progress(scaleProgress);
            }
          }

          if (progress > 0.2 && progress <= 0.95) {
            if (flipAnimation.current) {
              flipAnimation.current.progress(1);
            }

            const horizontalProgress = Math.min((progress - 0.2) / 0.75, 1);

            const wrapperTranslateX = -66.67 * horizontalProgress;
            gsap.set(horizontalScrollWrapperRef.current, {
              x: `${wrapperTranslateX}%`,
            });

            const sideMovement = (66.67 / 100) * 3 * horizontalProgress;
            const imageTranslateX = -sideMovement * 100;
            gsap.set(pinnedMarqueeImgClone.current, {
              x: `${imageTranslateX}%`,
            });
          } else if (progress > 0.95) {
            if (flipAnimation.current) {
              flipAnimation.current.progress(1);
            }

            gsap.set(pinnedMarqueeImgClone.current, {
              x: "-200%",
            });

            gsap.set(horizontalScrollWrapperRef.current, {
              x: "-66.67%",
            });
          }
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <>
      <ReactLenis root ref={lenisRef} options={{ autoRaf: false }} />
      <main className="page" ref={containerRef}>
        <section className="hero">
          <h1>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
            corporis iste impedit qui repellat accusamus incidunt in cum id
            distinctio eos vel,{" "}
          </h1>
        </section>
        <section className="marquee" ref={marqueeRef}>
          <div className="marquee-wrapper">
            <div className="marquee-images" ref={marqueeImagesRef}>
              {imgs.map((img, index) => (
                <div
                  key={index}
                  className={`marquee-img ${index === 6 ? "pin" : ""}`}
                >
                  <Image src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="horizontal-scroll" ref={horizontalScrollRef}>
          <div
            className="horizontal-scroll-wrapper"
            ref={horizontalScrollWrapperRef}
          >
            <div className="horizontal-side horizontal-spacer"></div>
            <div className="horizontal-side">
              <div className="col">
                <h3>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem numquam veniam cum voluptatem illo explicabo quod
                  expedita commodi cupiditate reprehenderit?
                </h3>
              </div>
              <div className="col">
                <Image src={img11} alt="" />
              </div>
            </div>
            <div className="horizontal-side">
              <div className="col">
                <h3>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorem numquam veniam cum voluptatem illo explicabo quod
                  expedita commodi cupiditate reprehenderit?
                </h3>
              </div>
              <div className="col">
                <Image src={img12} alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="outro">
          <h1>
            nobis optio odio possimus porro rem. Error vitae odio enim fugit
            neque recusandae et culpa voluptatum eius dolorem?
          </h1>
        </section>
      </main>
    </>
  );
}
