"use client";

import { useRef } from "react";

import { ReactLenis } from "lenis/react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";
import spring from "@/assets/20260205/spring.webp";
import summer from "@/assets/20260205/summer.webp";
import autumn from "@/assets/20260205/autumn.webp";
import winter from "@/assets/20260205/winter.webp";

import "@/assets/css/20260205.css";

gsap.registerPlugin(ScrollTrigger);

const spotlightImgFinalPos = [
  [-140, -140],
  [40, -130],
  [-160, 40],
  [20, 30],
];

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightImgsContainerRefs = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const spotlightImgsContainer = spotlightImgsContainerRefs.current!;
      const spotlightImgs =
        spotlightImgsContainer.querySelectorAll(".spotlight-image");

      ScrollTrigger.create({
        trigger: ".spotlight",
        start: "top top",
        end: `+=${window.innerHeight * 6}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const initialRotations = [5, -3, 3.5, -1];
          const phaseOneStartOffsets = [0, 0.1, 0.2, 0.3];

          spotlightImgs.forEach((img, index) => {
            const initialRotation = initialRotations[index];
            const phase1Start = phaseOneStartOffsets[index];
            // [0.405, 0.415, 0.425, 0.435]
            const phase1End = Math.min(
              phase1Start + (0.45 - phase1Start) * 0.9,
              0.45,
            );

            let x = -50;
            let y, rotation;

            if (progress < phase1Start) {
              y = 200;
              rotation = initialRotation;
            } else if (progress <= 0.45) {
              let phase1Progress;
              if (progress >= phase1End) {
                phase1Progress = 1;
              } else {
                // 0 -> 1
                const linearProgress =
                  (progress - phase1Start) / (phase1End - phase1Start);
                phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
                y = 200 - phase1Progress * 250;
                rotation = initialRotation;
              }
            } else {
              y = -50;
              rotation = initialRotation;
            }

            const phaseTwoStartOffsets = [0.5, 0.55, 0.6, 0.65];
            const phase2Start = phaseTwoStartOffsets[index];
            const phase2End = Math.min(
              phase2Start + (0.95 - phase2Start) * 0.9,
              0.95,
            );
            const finalX = spotlightImgFinalPos[index][0];
            const finalY = spotlightImgFinalPos[index][1];

            if (progress >= phase2Start && progress <= 0.95) {
              let phase2Progress;
              if (progress >= phase2End) {
                phase2Progress = 1;
              } else {
                const linearProgress =
                  (progress - phase2Start) / (phase2End - phase2Start);
                phase2Progress = 1 - Math.pow(1 - linearProgress, 3);
              }
              x = -50 + (finalX + 50) * phase2Progress;
              y = -50 + (finalY + 50) * phase2Progress;
              rotation = initialRotation * (1 - phase2Progress);
            } else if (progress > 0.95) {
              x = finalX;
              y = finalY;
              rotation = 0;
            }

            gsap.set(img, {
              transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
            });
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
        <section className="intro">
          <h1>The Spring, Summer, Autumn and Winter of Dali Shu Village</h1>
        </section>
        <section className="spotlight">
          <div className="spotlight-header">
            <h1>The seasonal changes of a tree</h1>
          </div>
          <div className="spotlight-images" ref={spotlightImgsContainerRefs}>
            <div className="spotlight-image">
              <Image src={spring} alt="spring" />
            </div>
            <div className="spotlight-image">
              <Image src={summer} alt="summer" />
            </div>
            <div className="spotlight-image">
              <Image src={autumn} alt="autumn" />
            </div>
            <div className="spotlight-image">
              <Image src={winter} alt="winter" />
            </div>
          </div>
        </section>
        <section className="outro">
          <h1>Prosperity and decline follow one's heart.</h1>
        </section>
      </main>
    </>
  );
}
