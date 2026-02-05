"use client";
import { useRef } from "react";
import Image from "next/image";

import { ReactLenis } from "lenis/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import skyImg from "@/assets/20260202/sky.jpg";
import windowImg from "@/assets/20260202/image.png";
import "@/assets/css/20260202.css";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const windowContainerRef = useRef<HTMLDivElement>(null);
  const skyContainerRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const windowContainer = windowContainerRef.current!;
      const heroHeader = heroHeaderRef.current!;
      const heroCopy = heroCopyRef.current!;
      const skyContainer = skyContainerRef.current!;

      const skyContainerHeight = skyContainer.offsetHeight;
      const viewportHeight = window.innerHeight;
      const skyContainerMoveDistance = skyContainerHeight - viewportHeight;

      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: `+=${window.innerHeight * 3}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let windowScale;
          if (progress <= 0.5) {
            windowScale = 1 + (progress / 0.5) * 3;
          } else {
            windowScale = 4;
          }

          gsap.set(windowContainer, {
            scale: windowScale,
          });

          gsap.set(heroHeader, {
            scale: windowScale,
            z: progress * 500,
          });

          gsap.set(skyContainer, {
            y: -progress * skyContainerMoveDistance,
          });

          let heroCopyY;
          if (progress <= 0.66) {
            heroCopyY = 100;
          } else if (progress >= 1) {
            heroCopyY = 0;
          } else {
            heroCopyY = 100 * (1 - (progress - 0.66) / 0.34);
          }
          gsap.set(heroCopy, {
            y: `${heroCopyY}%`,
          });
        },
      });
    },
    {
      scope: containerRef,
    },
  );
  return (
    <>
      <ReactLenis root />
      <main className="page" ref={containerRef}>
        <section className="hero">
          <div className="sky-container" ref={skyContainerRef}>
            <Image src={skyImg} alt="sky" />
          </div>
          <div className="hero-copy" ref={heroCopyRef}>
            <h1>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              tenetur numquam in sint ad laboriosam tempore odio esse earum
              neque?
            </h1>
          </div>
          <div className="window-container" ref={windowContainerRef}>
            <Image src={windowImg} alt="window" />
          </div>
          <div className="hero-header" ref={heroHeaderRef}>
            <div className="col">
              <h1>
                Lorem ipsum <br />
                dolor sit.
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Aliquam sequi, explicabo accusamus iure sed nemo debitis laborum
                atque ipsum eveniet.
              </p>
            </div>
            <div className="col">
              <p>Lorem ipsum</p>
              <h1>
                Lorem ipsum <br />
                dolor sit amet.
              </h1>
            </div>
          </div>
        </section>
        <section className="outro">
          <h1>End of view.</h1>
        </section>
      </main>
    </>
  );
}
