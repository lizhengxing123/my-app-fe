"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";

import Image from "next/image";
import bg from "@/assets/20260106/bg.jpg";

import "@/assets/css/20260106.css";

export default function Page() {
  const counterContainerRef = useRef<HTMLDivElement>(null);
  const CounterRef = useRef<HTMLHeadingElement>(null);

  const init = () => {
    gsap.registerPlugin(SplitText, CustomEase);

    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const splitText = (
      selector: gsap.DOMTarget,
      type: NonNullable<SplitText.Vars["mask"]>,
      className: string
    ) => {
      return new SplitText(selector, {
        type,
        [`${type}Class`]: className,
        mask: type,
      });
    };

    const titleSplit = splitText(".hero-title h1", "chars", "char");
    const navSplit = splitText("nav a", "words", "word");
    const footerSplit = splitText(".hero-footer p", "words", "word");

    const counter = { value: 0 };

    const t1 = gsap.timeline();

    t1.to(counter, {
      value: 100,
      duration: 3,
      ease: "power3.out",
      onUpdate: () => {
        CounterRef.current!.textContent = counter.value.toFixed(0);
      },
      onComplete: () => {
        const counterSplit = splitText(CounterRef.current!, "chars", "digit");
        gsap.to(counterSplit.chars, {
          translateX: "-100%",
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          delay: 1,
          onComplete: () => {
            counterContainerRef.current!.remove();
          },
        });
      },
    });

    t1.to(
      counterContainerRef.current!,
      {
        scale: 1,
        duration: 3,
        ease: "power3.out",
      },
      "<"
    );

    t1.to(
      ".progress-bar",
      {
        scaleX: 1,
        duration: 3,
        ease: "power3.out",
      },
      "<"
    );

    t1.to(
      ".hero-bg",
      {
        clipPath: "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)",
        duration: 1.5,
        ease: "hop",
      },
      4.5
    );

    t1.to(
      ".hero-bg img",
      {
        scale: 1.5,
        duration: 1.5,
        ease: "hop",
      },
      "<"
    );

    t1.to(
      ".hero-bg",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 2,
        ease: "hop",
      },
      6
    );

    t1.to(
      ".hero-bg img",
      {
        scale: 1,
        duration: 2,
        ease: "hop",
      },
      "<"
    );

    t1.to(
      ".progress",
      {
        scaleX: 1,
        duration: 2,
        ease: "hop",
      },
      "<"
    );

    t1.to(
      ".hero-title h1 .char",
      {
        translateX: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.075,
      },
      7
    );

    t1.to(
      "nav a .word",
      {
        translateY: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.075,
      },
      7.5
    );

    t1.to(
      ".hero-footer p .word",
      {
        translateY: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.075,
      },
      7.5
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="page">
      <div className="placeholder-counter" ref={counterContainerRef}>
        <h1 ref={CounterRef}>0</h1>
      </div>

      <nav>
        <div className="nav-logo">
          <a href="">Zheng</a>
        </div>
        <div className="nav-links">
          <a href="">Index</a>
          <a href="">About</a>
          <a href="">Contract</a>
          <a href="">Latest</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <Image src={bg} alt="hero-bg" />
        </div>

        <div className="hero-title">
          <h1>Zheng</h1>
        </div>

        <div className="hero-footer">
          <p>Experience</p>
          <p>Study</p>
          <p>Carer</p>
        </div>

        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </section>
    </main>
  );
}
