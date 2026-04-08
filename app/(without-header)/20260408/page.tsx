"use client";

import { useRef, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LenisRef, ReactLenis } from "lenis/react";

import Image from "next/image";
import autumn from "@/assets/20260205/autumn.webp";
import spring from "@/assets/20260205/spring.webp";
import summer from "@/assets/20260205/summer.webp";
import winter from "@/assets/20260205/winter.webp";

import "@/assets/css/20260408.css";

const cards = [
  {
    title: "春天",
    img: spring,
    desc: "春天是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节。",
  },
  {
    title: "夏天",
    img: summer,
    desc: "夏天是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节。",
  },
  {
    title: "秋天",
    img: autumn,
    desc: "秋天是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节。",
  },
  {
    title: "冬天",
    img: winter,
    desc: "冬天是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节，它是一个非常重要的季节。",
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const lenisRef = useRef<LenisRef>(null);
  const stickyCardsRef = useRef<HTMLDivElement>(null);
  const stickyCardArrRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useGSAP(
    () => {
      const stickyCards = stickyCardsRef.current;
      const stickyCardArr = stickyCardArrRef.current;

      if (!stickyCards || !stickyCardArr) return;

      const last = stickyCardArr.length - 1;

      stickyCardArr.forEach((card, index) => {
        if (index < last) {
          ScrollTrigger.create({
            trigger: card,
            endTrigger: stickyCardArr[last],
            start: "top top",
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
        }

        if (index < last) {
          ScrollTrigger.create({
            trigger: stickyCardArr[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              const scale = 1 - progress * 0.25;
              const rotation = (index % 2 === 0 ? 5 : -5) * progress;

              gsap.set(card, {
                scale,
                rotation,
                "--after-opacity": progress,
              });
            },
          });
        }
      });
    },
    { scope: stickyCardsRef },
  );
  return (
    <>
      <ReactLenis ref={lenisRef} root options={{ autoRaf: false }} />
      <main className="page">
        <section className="intro">
          <h1>一年</h1>
        </section>
        <div className="sticky-cards" ref={stickyCardsRef}>
          {cards.map((item, index) => (
            <div
              key={index}
              className="sticky-card"
              ref={(el) => {
                stickyCardArrRef.current[index] = el!;
              }}
            >
              <div className="sticky-card-index">
                <h1>{`0${index + 1}`}</h1>
              </div>
              <div className="sticky-card-content">
                <div className="sticky-card-content-wrapper">
                  <h1 className="sticky-card-header">{item.title}</h1>
                  <div className="sticky-card-img">
                    <Image src={item.img} alt={item.title} />
                  </div>
                  <div className="sticky-card-copy">
                    <div className="sticky-card-copy-title">
                      <p>（关于这个季节）</p>
                    </div>
                    <div className="sticky-card-copy-desc">
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <section className="outro">
          <h1>四季</h1>
        </section>
      </main>
    </>
  );
}
