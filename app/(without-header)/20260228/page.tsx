"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

import Image from "next/image";

import img1 from "@/assets/20251220/林见祈.webp";
import img2 from "@/assets/20251220/林见祈1.webp";
import img3 from "@/assets/20251220/林渭.webp";
import img4 from "@/assets/20251220/娄行.webp";

import "@/assets/css/20260228.css";

const cards = [
  {
    name: "娄行",
    desc: "鸺葵道子",
    img: img4,
  },
  {
    name: "林见祈",
    desc: "奎祈真人",
    img: img1,
  },
  {
    name: "林见祈",
    desc: "奎祈真人",
    img: img2,
  },
  {
    name: "林渭",
    desc: "后绋真人",
    img: img3,
  },
];

gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = cardsRef.current;
      const totalCards = cards.length;
      const segmentSize = 1 / totalCards;

      const cardYOffset = 5;
      const cardScaleStep = 0.075;

      cards.forEach((card, index) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50 + index * cardYOffset,
          scale: 1 - index * cardScaleStep,
        });
      });

      ScrollTrigger.create({
        trigger: cardContainerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 8}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          const activeIndex = Math.min(
            Math.floor(progress / segmentSize),
            totalCards - 1,
          );

          const segmentProgress = (progress - activeIndex * segmentSize) / segmentSize;

          cards.forEach((card, index) => {
            if(index < activeIndex) {
                gsap.set(card, {
                  yPercent: -250,
                  rotationX: 35
                });
            } else if(index === activeIndex) {
                gsap.set(card, {
                  yPercent: gsap.utils.interpolate(-50, -200, segmentProgress),
                  rotationX: gsap.utils.interpolate(0, 35, segmentProgress),
                  scale: 1,
                });
            } else {
                const behindIndex = index - activeIndex;
                const currentYOffset = (behindIndex - segmentProgress) * cardYOffset;
                const currentScale = 1 - (behindIndex - segmentProgress) * cardScaleStep;

                gsap.set(card, {
                  yPercent: -50 + currentYOffset,
                  rotationX: 0,
                  scale: currentScale,
                });
            }
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
          <h1>太阳道统 大鸺葵观</h1>
        </section>
        <section className="sticky-cards" ref={cardContainerRef}>
          {cards.map((item, index) => (
            <div
              key={index}
              className="card"
              id={`card-${index + 1}`}
              ref={(el) => {
                cardsRef.current[index] = el!;
              }}
            >
              <div className="col">
                <p>{item.name}</p>
                <h1>{item.desc}</h1>
              </div>
              <div className="col">
                <Image src={item.img} alt={item.name} />
              </div>
            </div>
          ))}
        </section>
        <section className="outro">
          <h1>太阳光明 今不复也</h1>
        </section>
      </main>
    </>
  );
}
